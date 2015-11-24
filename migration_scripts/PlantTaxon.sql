CREATE TABLE PlantTaxon(
_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
DKname VARCHAR(255) NOT NULL,
DKandLatinName VARCHAR(255) NOT NULL,
DKCode VARCHAR(11) ,
Ectomycorrhizal VARCHAR(11),
Genus VARCHAR(11),
LatinName VARCHAR(255) NOT NULL,
LatinCode VARCHAR(11) 
WoodySubstrate VARCHAR(11)
) ENGINE = InnoDB DEFAULT CHARSET=UTF8;

-- direct match on DKname
UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p._id where o._id=f.AtlasLNR AND f.associatedOrganism= p.DKname;
-- direct match on concatted DKname and latin name
UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p._id where o._id=f.AtlasLNR AND f.associatedOrganism= p.DKandLatinName;
-- direct match on latin name
UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p._id where o._id=f.AtlasLNR AND f.associatedOrganism= p.LatinName;

-- match on first taxon if multiple, dk name
UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p._id where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(f.associatedOrganism, ", ", 1) = p.DKname;
-- match on first taxon if multiple, dk name and latin
UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p._id where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(f.associatedOrganism, ", ", 1) = p.DKandLatinName;
-- match on first taxon if multiple, latin name
UPDATE Observation o, PlantTaxon p, Fungi f SET o.primaryassociatedorganism_id = p._id where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(f.associatedOrganism, ", ", 1) = p.LatinName;



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
INSERT INTO ObservationPlantTaxon SELECT p._id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -1), ", ", 2) = p.DKname;
INSERT INTO ObservationPlantTaxon SELECT p._id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -1), ", ", 2) = p.DKandLatinName;
INSERT INTO ObservationPlantTaxon SELECT p._id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -1), ", ", 2) = p.LatinName;

-- insert third taxon if exists
INSERT INTO ObservationPlantTaxon SELECT p._id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -1), ", ", 3) = p.DKname;
INSERT INTO ObservationPlantTaxon SELECT p._id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -1), ", ", 3) = p.DKandLatinName;
INSERT INTO ObservationPlantTaxon SELECT p._id, o._id FROM Observation o, PlantTaxon p, Fungi f  where f.associatedOrganism LIKE "%,%" AND o._id=f.AtlasLNR AND SUBSTRING_INDEX(SUBSTRING_INDEX(f.associatedOrganism, ", ", -1), ", ", 3) = p.LatinName;

 