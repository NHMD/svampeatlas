CREATE TABLE IF NOT EXISTS Determination (
  _id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime DEFAULT NULL,
  observation_id int(11) NOT NULL ,
  taxon_id int(11) NOT NULL ,
  user_id int(11)  NULL,
  confidence ENUM( 'sikker', 'sandsynlig', 'mulig' ),
  score INT(11) DEFAULT 0, 
  validation ENUM( 'Godkendt', 'Gammelvali', 'Valideres', 'Afventer',  'Afvist',  'Slettes'  ),
  notes TEXT,
  validatorremarks VARCHAR(255),
  validator_id INT(11)  NULL,
  verbatimdeterminator VARCHAR(255),
  FOREIGN KEY (observation_id) REFERENCES Observation(_id),
   FOREIGN KEY (taxon_id) REFERENCES Taxon(_id),
   FOREIGN KEY (user_id) REFERENCES Users(_id),
   FOREIGN KEY (validator_id) REFERENCES Users(_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE DeterminationMethod (
	 _id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
	 name VARCHAR(255) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE DeterminationDeterminationMethod (
	determination_id INT(11) NOT NULL,
	method_id INT(11) NOT NULL,
	PRIMARY KEY (determination_id, method_id ),
	FOREIGN KEY (determination_id) REFERENCES Determination(_id),
	FOREIGN KEY (method_id) REFERENCES DeterminationMethod(_id)
) ENGINE = InnoDB DEFAULT CHARSET=UTF8;


CREATE TABLE Litterature (
	 _id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
	 shortname VARCHAR(255) NOT NULL,
	 fullname VARCHAR(510) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE DeterminationLitterature (
	determination_id INT(11) NOT NULL,
	litterature_id INT(11) NOT NULL,
	PRIMARY KEY (determination_id, litterature_id ),
	FOREIGN KEY (determination_id) REFERENCES Determination(_id),
	FOREIGN KEY (litterature_id) REFERENCES Litterature(_id)
) ENGINE = InnoDB DEFAULT CHARSET=UTF8;


UPDATE Fungi set AtlasForumVali ="Godkendt" WHERE AtlasForumVali="OK";
-- taxon match on id where validation is set
INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator
	
) SELECT f.AtlasLNR, o.createdAt, f.DkIndexNumber, f.AtlasForumVali, f.Det FROM Fungi f, Observation o WHERE f.AtlasLNR = o._id AND AtlasForumVali <> "" AND f.DkIndexNumber IN (SELECT _id from Taxon);

-- taxon match on id where validation is NOT set
INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator
	
) SELECT f.AtlasLNR, o.createdAt, f.DkIndexNumber, null , f.Det FROM Fungi f, Observation o WHERE f.AtlasLNR = o._id AND AtlasForumVali = "" AND f.DkIndexNumber IN (SELECT _id from Taxon);

SELECT COUNT(*) from Fungi where DkIndexNumber NOT IN (select _id from Taxon);

-- taxon match on full name
INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator
	
) SELECT f.AtlasLNR, o.createdAt, t._id, f.AtlasForumVali, f.Det FROM Fungi f, Observation o, Taxon t WHERE f.FuldeNavnFromFUN = t.FullName AND f.AtlasLNR = o._id AND AtlasForumVali <> "" AND o._id  NOT IN (SELECT observation_id from Determination d);

-- taxon match on full name
INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator
	
) SELECT f.AtlasLNR, o.createdAt, t._id, null, f.Det FROM Fungi f, Observation o, Taxon t WHERE f.FuldeNavnFromFUN = t.FullName AND f.AtlasLNR = o._id AND AtlasForumVali = "" AND o._id  NOT IN (SELECT observation_id from Determination d);

-- direct match on determinator name
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator = u.name;

UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator = u.Initialer AND d.user_id IS NULL;
-- prefix match on determinator name -TOO SLOW
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator LIKE CONCAT(u.name, "%") AND d.user_id IS NULL;

UPDATE Determination d, Users u SET d.user_id = u._id WHERE SUBSTRING_INDEX(d.verbatimdeterminator, " & ", 1) = u.name AND d.user_id IS NULL;

UPDATE Determination d, Users u SET d.user_id = u._id WHERE SUBSTRING_INDEX(d.verbatimdeterminator, " og ", 1) = u.name AND d.user_id IS NULL;

UPDATE Determination d, Users u SET d.user_id = u._id WHERE SUBSTRING_INDEX(d.verbatimdeterminator, ",", 1) = u.name AND d.user_id IS NULL;

select AtlasLNR, Det from Determination d, Fungi f where d.user_id IS NULL AND d.verbatimdeterminator <> "" AND d.verbatimdeterminator is not null AND d.observation_id= f.AtlasLNR;

UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator IN ("M. Lange", "M. Lange etc.", "M. Lange, Lise Hansen, Henry Dissing & J. P. Jensen", "M. Lange (J. P. Jensen)", "M. Lange + J. P. Jensen noter", "M. Lange & J. P. Jensen") AND u.Initialer = "MOL" ;
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator IN ("J. E. Lange") AND u.Initialer = "JE-L" ;
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator IN ("K. Bülow & J. P. Jensen", "K. Bülow") AND u.Initialer = "KBU" ;
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator IN ("A. B. Klinge", "A. B. Klinge & J. P. Jensen", "A. B. Klinge & H. Folkmar", "A. B. Klinge, H. Folkmar & K. Toft", "A. B. Klinge, H. Folkmar & S. Andersson") AND u.Initialer = "ABK" ;
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="Steen A. Elborne" AND u.Initialer = "SAE" ;
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="K. Hauerslev" AND u.Initialer = "KHA" ;
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="Vang Alstrup, Steen Christensen, M. Skytte Christiansen" AND u.Initialer = "vagna" ;
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="Leif Sørensen" AND u.Initialer = "LS" ;
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="SNC, US og IJ" AND u.Initialer = "US" ;
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="Leif Døssing" AND u.Initialer = "LDO" ;
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="Leif W. Laursen" AND u.Initialer = "LWL" ;
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="Ulla & Klas Nørskov" AND u.Initialer = "UGN" ;
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="Thomas S. Jeppesen" AND u.Initialer = "TSJ"  ;
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="Thomas Læssøe m.fl." AND u.Initialer = "tl";
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator IN ("N. F. Buchwald (M. Lange, F. H. Møller & J. P. Jensen)", "N. F. Buchwald (J. P. Jensen)") AND u.Initialer = "NFB";
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="K. Toft" AND u.Initialer = "KTO";
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator IN ("H. Dissing","H. Dissing & J. P. Jensen") AND u.Initialer = "HDI";
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="Poul  Larsen" AND u.Initialer ="PO-L";
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="T. Borgen" AND u.Initialer ="TB";
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator IN ("Ella & Poul Erik Brandt/Inga Bergholt", "Ella & Poul Erik Brandt" )AND u.Initialer ="EPB"
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator IN ("Bille-Hansen, H. Dissing, J. P. Jensen et al.", "Bille-Hansen & J. P. Jensen") AND u.Initialer = "EBH"
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator ="F. H. Møller / N. F. Buchwald" AND u.Initialer = "FHM"
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator = "Henrik Mathiassen (HM)" AND u.Initialer = "HM"
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator = "Thomas Brandt-Pedersen" AND u.Initialer = "ThB"
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator = "Svend Olsen + Bjørn Pedersen" AND u.Initialer = "SO";
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator = "K. Bülow og J. P. Jensen" AND u.Initialer ="KBU"
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator = "K. Bjørnekær (M. P. Christiansen)" AND u.Initialer ="KB-J"




INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator,
	score
	
) SELECT f.AtlasLNR, o.createdAt, t._id, f.AtlasForumVali, f.Det, 10 FROM Fungi f, Observation o, Taxon t WHERE f.DkIndexNumber NOT IN (select _id from Taxon) AND f.FuldeNavnFromFUN <> "" AND SUBSTRING_INDEX(f.FuldeNavnFromFUN, " ", 2) = t.FullName AND f.AtlasLNR = o._id AND AtlasForumVali <> "" AND o._id  NOT IN (SELECT observation_id from Determination d);
INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator,
	score
	
) SELECT f.AtlasLNR, o.createdAt, t._id, null, f.Det, 10 FROM Fungi f, Observation o, Taxon t WHERE f.DkIndexNumber NOT IN (select _id from Taxon) AND f.FuldeNavnFromFUN <> "" AND SUBSTRING_INDEX(f.FuldeNavnFromFUN, " ", 2) = t.FullName AND f.AtlasLNR = o._id AND AtlasForumVali = "" AND o._id  NOT IN (SELECT observation_id from Determination d);



-- Taxa that was missing from taxonbase


INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator,
	score
	
) SELECT f.AtlasLNR, o.createdAt, 67158, f.AtlasForumVali, f.Det, 20 FROM Fungi f, Observation o WHERE  f.AtlasLNR = o._id AND f.FuldeNavnFromFUN  IN ("Lasiobelonium variegatum (Fuckel) Raitv.","Lasiobelonium cf. variegatum (Fuckel) Raitv.") AND o._id  NOT IN (SELECT observation_id from Determination d);

INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator,
	score
	
) SELECT f.AtlasLNR, o.createdAt, 67159, f.AtlasForumVali, f.Det, 20 FROM Fungi f, Observation o WHERE  f.AtlasLNR = o._id AND f.FuldeNavnFromFUN  IN ("Trichoglossum cf. variabile (E.J. Durand) Nannf.","Trichoglossum variabile (E.J. Durand) Nannf.") AND o._id  NOT IN (SELECT observation_id from Determination d);

INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator,
	score
	
) SELECT f.AtlasLNR, o.createdAt, 67160, f.AtlasForumVali, f.Det, 20 FROM Fungi f, Observation o WHERE  f.AtlasLNR = o._id AND f.FuldeNavnFromFUN  IN ("Puccinia variabilis Grev.") AND o._id  NOT IN (SELECT observation_id from Determination d);

INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator,
	score
	
) SELECT f.AtlasLNR, o.createdAt, 67161, f.AtlasForumVali, f.Det, 20 FROM Fungi f, Observation o WHERE  f.AtlasLNR = o._id AND f.FuldeNavnFromFUN  IN ("Melanogaster variegatus (Vittad.) Tul.") AND o._id  NOT IN (SELECT observation_id from Determination d);

INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator,
	score
	
) SELECT f.AtlasLNR, o.createdAt, 67162, f.AtlasForumVali, f.Det, 20 FROM Fungi f, Observation o WHERE  f.AtlasLNR = o._id AND f.FuldeNavnFromFUN  IN ("Diaporthe varians (Curr.) Sacc.") AND o._id  NOT IN (SELECT observation_id from Determination d);

INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator,
	score
	
) SELECT f.AtlasLNR, o.createdAt, 67163, f.AtlasForumVali, f.Det, 20 FROM Fungi f, Observation o WHERE  f.AtlasLNR = o._id AND f.FuldeNavnFromFUN  IN ("Flammulaster rhombospora (G.F. Atk.) Watling") AND o._id  NOT IN (SELECT observation_id from Determination d);

INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator,
	score
	
) SELECT f.AtlasLNR, o.createdAt, 67164, f.AtlasForumVali, f.Det, 20 FROM Fungi f, Observation o WHERE  f.AtlasLNR = o._id AND f.FuldeNavnFromFUN  IN ("Typhula laschii Rabenh.") AND o._id  NOT IN (SELECT observation_id from Determination d);

INSERT INTO Determination (
	observation_id,
	createdAt,
	taxon_id,
	validation,
	verbatimdeterminator,
	score
	
) SELECT f.AtlasLNR, o.createdAt, 67045, f.AtlasForumVali, f.Det, 20 FROM Fungi f, Observation o WHERE  f.AtlasLNR = o._id AND f.FuldeNavnFromFUN  IN ("Varicosporium elodeae W. Kegel") AND o._id  NOT IN (SELECT observation_id from Determination d);


UPDATE Determination d, Observation o SET o.primarydetermination_id = d._id WHERE d.observation_id = o._id;
ALTER TABLE Determination add column createdByUser INT(11);

ALTER TABLE Determination ADD CONSTRAINT fk_createdbyuser_id FOREIGN KEY (createdByUser) REFERENCES Users(_id);
ALTER TABLE Determination add column baseScore INT(11) DEFAULT 0;


SELECT o.primaryuser_id, observation_id,taxon_id, COUNT(*) c FROM Determination d, Observation o WHERE d.observation_id=o._id GROUP BY observation_id,taxon_id HAVING c > 1;


-- remove duplicate determinations:
DELETE FROM Determination WHERE _id IN (SELECT _id FROM (SELECT  d1._id, o.primarydetermination_id
FROM    Determination d1, Observation o
WHERE d1.observation_id= o._id AND EXISTS
        (
        SELECT  1
        FROM    Determination d2
        WHERE   d1.observation_id = d2.observation_id AND d1.taxon_id = d2.taxon_id LIMIT 1, 1
        )) a WHERE a._id <> a.primarydetermination_id);
-- Add unique constraint on taxon, observation in determinations 
ALTER TABLE Determination add UNIQUE (observation_id, taxon_id);