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

SELECT * from Taxon where DkIndexNumber NOT IN select _id from Taxon;

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
-- prefix match on determinator name -TOO SLOW
UPDATE Determination d, Users u SET d.user_id = u._id WHERE d.verbatimdeterminator LIKE CONCAT(u.name, "%") AND d.user_id IS NULL;

UPDATE Determination d, Users u SET d.user_id = u._id WHERE SUBSTRING_INDEX(d.verbatimdeterminator, " & ", 1) = u.name AND d.user_id IS NULL;

UPDATE Determination d, Users u SET d.user_id = u._id WHERE SUBSTRING_INDEX(d.verbatimdeterminator, " og ", 1) = u.name AND d.user_id IS NULL;

UPDATE Determination d, Users u SET d.user_id = u._id WHERE SUBSTRING_INDEX(d.verbatimdeterminator, ",", 1) = u.name AND d.user_id IS NULL;


UPDATE Determination d, Observation o SET o.primarydetermination_id = d._id WHERE d.observation_id = o._id;