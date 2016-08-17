CREATE TABLE Taxonprobability (
_id INT(11) PRIMARY KEY NOT NULL,
FullName VARCHAR(255) NOT NULL,
probability INT(11) NOT NULL
) ENGINE = InnoDB;



INSERT INTO Taxonprobability (_id, FullName, probability) SELECT ta._id, ta.FullName, count(*) FROM Taxon ta, Taxon t, Determination d where d.taxon_id=t._id AND t.accepted_id=ta._id AND ta.RankID =10000 AND d.validation="Godkendt" GROUP BY ta._id;


CREATE TABLE PlantTaxonprobability (
_id INT(11) PRIMARY KEY NOT NULL,
DKandLatinName VARCHAR(255) NOT NULL,
probability INT(11) NOT NULL
) ENGINE = InnoDB;


INSERT INTO PlantTaxonprobability (_id, DKandLatinName, probability) SELECT p._id, p.DKandLatinName, count(*) FROM PlantTaxon p, Observation o WHERE p._id = o.primaryassociatedorganism_id GROUP BY p._id;

CREATE TABLE Localityprobability (
_id INT(11) PRIMARY KEY NOT NULL,
name VARCHAR(255) NOT NULL,
probability INT(11) NOT NULL
) ENGINE = InnoDB;


INSERT INTO Localityprobability (_id, name, probability) SELECT l._id, l.name, count(*) FROM Locality l, Observation o WHERE l._id = o.locality_id GROUP BY l._id;



ALTER TABLE Locality ADD COLUMN probability INT(11) NOT NULL DEFAULT 0;
UPDATE Locality l, Localityprobability p SET l.probability = p.probability WHERE l._id=p._id;

ALTER TABLE Locality ADD INDEX `probability` (`probability`);

ALTER TABLE Taxon ADD COLUMN probability INT(11) NOT NULL DEFAULT 0;
UPDATE Taxon t, Taxonprobability p SET t.probability = p.probability WHERE t._id=p._id;

ALTER TABLE Taxon ADD INDEX `probability` (`probability`);

ALTER TABLE PlantTaxon ADD COLUMN probability INT(11) NOT NULL DEFAULT 0;
UPDATE PlantTaxon t, PlantTaxonprobability p SET t.probability = p.probability WHERE t._id=p._id;

ALTER TABLE PlantTaxon ADD INDEX `probability` (`probability`);

