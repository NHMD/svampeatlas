CREATE TABLE PlantTaxon(
_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
DKname VARCHAR(255) NOT NULL,
DKandLatinName VARCHAR(255) NOT NULL,
DKCode VARCHAR(11) ,
Ectomycorrhizal VARCHAR(11),
Genus VARCHAR(11),
LatinName VARCHAR(255) NOT NULL,
LatinCode VARCHAR(11) 
WoodySubstrate VARCHAR(11),
accepted_id INT(11),
parent_id INT(11),
defaultlist TINYINT(1) DEFAULT 0
) ENGINE = InnoDB DEFAULT CHARSET=UTF8;

-- mark all taxa in the default list
UPDATE PlantTaxon set defaultlist = 1;

UPDATE PlantTaxon set Genus = 1 where Genus = "X";
UPDATE PlantTaxon set Genus = 0 where Genus = "";
alter table PlantTaxon modify Genus tinyint(1);
-- Find all duplicate latin names (45)
SELECT * FROM PlantTaxon p, (select LatinName, COUNT(*) FROM PlantTaxon GROUP by LatinName HAVING  COUNT(*) > 1) a where p.LatinName = a.LatinName ORDER BY p.LatinName;

-- Synonymize where we have several dk names for plants
UPDATE PlantTaxon p, PlantTaxon p1 SET p1.accepted_id = p._id WHERE p.LatinName=p1.LatinName AND p._id < p1._id;

-- Self synonymize
UPDATE PlantTaxon set accepted_id = _id WHERE accepted_id IS NULL;

-- Map Species to genera
UPDATE PlantTaxon p, PlantTaxon p1 SET p1.parent_id = p._id WHERE p1.LatinName LIKE CONCAT(p.LatinName, "%") AND p.Genus = 1 AND p1.Genus =0;



-- direct match on concatted DKname and latin name
UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p.accepted_id where o._id=f.AtlasLNR AND f.associatedOrganism= p.DKandLatinName;

-- direct match on latin name
UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p.accepted_id where o._id=f.AtlasLNR AND f.associatedOrganism= p.LatinName;
-- direct match on DKname to Genus
UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p.accepted_id where o._id=f.AtlasLNR AND f.associatedOrganism= p.DKname AND p.Genus =1;

-- direct match on DKname to Species
UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p.accepted_id where o._id=f.AtlasLNR AND f.associatedOrganism= p.DKname AND p.Genus =0 AND o.primaryassociatedorganism_id IS NULL;


-- match on first taxon if multiple, dk name and latin
UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p.accepted_id where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(f.associatedOrganism, ", ", 1) = p.DKandLatinName;
-- match on first taxon if multiple, latin name
UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p.accepted_id where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(f.associatedOrganism, ", ", 1) = p.LatinName;

-- match on first taxon if multiple, dk name
UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p.accepted_id where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(f.associatedOrganism, ", ", 1) = p.DKname AND p.Genus =1;

UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p.accepted_id where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(f.associatedOrganism, ", ", 1) = p.DKname AND p.Genus =0 AND o.primaryassociatedorganism_id IS NULL;



CREATE TABLE ObservationPlantTaxon (
	planttaxon_id INT(11) NOT NULL,
	observation_id INT(11) NOT NULL,
	PRIMARY KEY (planttaxon_id, observation_id ),
	FOREIGN KEY (planttaxon_id) REFERENCES PlantTaxon(_id),
	FOREIGN KEY (observation_id) REFERENCES Observation(_id)
) ENGINE = InnoDB DEFAULT CHARSET=UTF8;

--insert all primary associated taxa
INSERT INTO ObservationPlantTaxon SELECT primaryassociatedorganism_id, _id FROM Observation WHERE primaryassociatedorganism_id IS NOT NULL;

--insert all secondary taxa 
INSERT INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(f.associatedOrganism, ", ", -1) = p.DKname AND p.Genus=1 ON DUPLICATE KEY UPDATE planttaxon_id=p.accepted_id, observation_id =o._id;
INSERT INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(f.associatedOrganism, ", ", -1) = p.DKandLatinName ON DUPLICATE KEY UPDATE planttaxon_id=p.accepted_id, observation_id =o._id;
INSERT INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(f.associatedOrganism, ", ", -1) = p.LatinName ON DUPLICATE KEY UPDATE planttaxon_id=p.accepted_id, observation_id =o._id;

-- insert third taxon if exists
INSERT INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -2), ", ", 1) = p.DKname AND p.Genus=1 ON DUPLICATE KEY UPDATE planttaxon_id=p._id, observation_id =o._id;
INSERT INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -2), ", ", 1) = p.DKandLatinName ON DUPLICATE KEY UPDATE planttaxon_id=p._id, observation_id =o._id;
INSERT INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -2), ", ", 1) = p.LatinName ON DUPLICATE KEY UPDATE planttaxon_id=p._id, observation_id =o._id;

-- insert fourth taxon if exists
INSERT INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -3), ", ", 1) = p.DKname AND p.Genus=1 ON DUPLICATE KEY UPDATE planttaxon_id=p._id, observation_id =o._id;
INSERT INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -3), ", ", 1) = p.DKandLatinName ON DUPLICATE KEY UPDATE planttaxon_id=p._id, observation_id =o._id;
INSERT INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -3), ", ", 1) = p.LatinName ON DUPLICATE KEY UPDATE planttaxon_id=p._id;

INSERT IGNORE INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -3), ", ", 1) = p.LatinName ;

-- insert fifth taxon if exists
INSERT INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -4), ", ", 1) = p.DKname AND p.Genus=1 ON DUPLICATE KEY UPDATE planttaxon_id=p._id, observation_id =o._id;
INSERT INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -4), ", ", 1) = p.DKandLatinName ON DUPLICATE KEY UPDATE planttaxon_id=p._id, observation_id =o._id;
INSERT INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -4), ", ", 1) = p.LatinName ON DUPLICATE KEY UPDATE planttaxon_id=p._id, observation_id =o._id;

INSERT IGNORE INTO ObservationPlantTaxon SELECT p.accepted_id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -4), ", ", 1) = p.LatinName;


CREATE TABLE temp_ass_org_is_mapped (
	obs_id INT(11) PRIMARY KEY NOT NULL
) ENGINE=InnoDB;

INSERT IGNORE INTO temp_ass_org_is_mapped SELECT AtlasLNR FROM PlantTaxon p, Fungi f WHERE  f.associatedOrganism= p.DKandLatinName;
INSERT INTO temp_ass_org_is_mapped SELECT AtlasLNR FROM PlantTaxon p, Fungi f WHERE  f.associatedOrganism= p.DKname ON DUPLICATE KEY UPDATE obs_id= AtlasLNR;
INSERT INTO temp_ass_org_is_mapped SELECT AtlasLNR FROM PlantTaxon p, Fungi f WHERE  f.associatedOrganism= p.LatinName ON DUPLICATE KEY UPDATE obs_id= AtlasLNR;
UPDATE Fungi f, Observation o SET o.ecologynote = CONCAT(o.ecologynote, " [Associated organism: ",f.associatedOrganism, "]") WHERE f.associatedOrganism <> "" AND f.AtlasLNR NOT IN (select obs_id from temp_ass_org_is_mapped) AND o._id = f.AtlasLNR AND o.ecologynote <> "";
UPDATE Fungi f, Observation o SET o.ecologynote = CONCAT("[Associated organism: ",f.associatedOrganism, "]") WHERE f.associatedOrganism <> "" AND f.AtlasLNR NOT IN (select obs_id from temp_ass_org_is_mapped) AND o._id = f.AtlasLNR AND o.ecologynote = "";

DROP TABLE temp_ass_org_is_mapped;

ALTER TABLE `PlantTaxon` ADD `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `_id`, ADD `updatedAt` DATETIME NULL AFTER `createdAt`;
ALTER TABLE `PlantTaxon` CHANGE `DKname` `DKname` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL;