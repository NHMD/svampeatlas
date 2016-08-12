CREATE TABLE TaxonProbabilty (
_id INT(11) PRIMARY KEY NOT NULL,
FullName VARCHAR(255) NOT NULL,
probabilty INT(11) NOT NULL
) ENGINE = InnoDB;



INSERT INTO TaxonProbabilty (_id, FullName, probabilty) SELECT ta._id, ta.FullName, count(*) FROM Taxon ta, Taxon t, Determination d where d.taxon_id=t._id AND t.accepted_id=ta._id AND ta.RankID =10000 AND d.validation="Godkendt" GROUP BY ta._id;


CREATE TABLE PlantTaxonProbabilty (
_id INT(11) PRIMARY KEY NOT NULL,
DKandLatinName VARCHAR(255) NOT NULL,
probabilty INT(11) NOT NULL
) ENGINE = InnoDB;


INSERT INTO PlantTaxonProbabilty (_id, DKandLatinName, probabilty) SELECT p._id, p.DKandLatinName, count(*) FROM PlantTaxon p, Observation o WHERE p._id = o.primaryassociatedorganism_id GROUP BY p._id;

CREATE TABLE LocalityProbabilty (
_id INT(11) PRIMARY KEY NOT NULL,
name VARCHAR(255) NOT NULL,
probabilty INT(11) NOT NULL
) ENGINE = InnoDB;


INSERT INTO LocalityProbabilty (_id, name, probabilty) SELECT l._id, l.name, count(*) FROM Locality l, Observation o WHERE l._id = o.locality_id GROUP BY l._id;



ALTER TABLE Locality ADD COLUMN probabilty INT(11) NOT NULL DEFAULT 0;
UPDATE Locality l, LocalityProbabilty p SET l.probability = p.probabilty WHERE l._id=p._id;

ALTER TABLE Taxon ADD COLUMN probabilty INT(11) NOT NULL DEFAULT 0;
UPDATE Taxon t, TaxonProbabilty p SET t.probability = p.probabilty WHERE t._id=p._id;

ALTER TABLE PlantTaxon ADD COLUMN probabilty INT(11) NOT NULL DEFAULT 0;
UPDATE PlantTaxon t, PlantTaxonProbabilty p SET t.probability = p.probabilty WHERE t._id=p._id;
