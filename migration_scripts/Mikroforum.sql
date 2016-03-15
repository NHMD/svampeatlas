-- husk at flytte "Serial" kollonne op øverst i eksport



CREATE TABLE IF NOT EXISTS `Mikroforum` (
`_id` INT(11) PRIMARY KEY NOT NULL,
  `adressefelt` varchar(85) DEFAULT NULL,
  `AtlasKommentar` varchar(55) DEFAULT NULL,
  `AtlasSPM` varchar(55) DEFAULT NULL,
  `Bruger` varchar(32) DEFAULT NULL,
  `Dato` varchar(19) DEFAULT NULL,
  `IDFelt` varchar(55) DEFAULT NULL,
  `InputAgeInDays` VARCHAR(55) DEFAULT NULL,
  `JulianDato` VARCHAR(55) DEFAULT NULL,
  `Komikon` VARCHAR(55) DEFAULT NULL,
  `kun dato` VARCHAR(55) DEFAULT NULL,
  `LastKomm` VARCHAR(55) DEFAULT NULL,
  `Textfelt` TEXT DEFAULT NULL,
  `UUID` varchar(55) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- search and replace i Mikroforum.csv \""  med \"
-- 😄 😊 🍄 😳 😀 🚴
LOAD DATA INFILE '/Users/thomasjeppesen/svampeatlas/exports/Mikroforum.csv' INTO TABLE Mikroforum CHARACTER SET utf8mb4
  FIELDS TERMINATED BY ',' ENCLOSED BY '"' 
  LINES TERMINATED BY '\r' ;
  
 

CREATE TABLE ObservationForum (
	_id int(11) PRIMARY KEY NOT NULL,
	observation_id int(11) NOT NULL,
	user_id int(11),
	createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	content TEXT NOT NULL,
	FOREIGN KEY (observation_id) REFERENCES Observation (_id),
	FOREIGN KEY  (user_id) REFERENCES Users (_id)	
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `ObservationForum` CHANGE `_id` `_id` INT(11) NOT NULL AUTO_INCREMENT;
-- fix crappy charset
UPDATE Mikroforum SET Bruger = REPLACE(Bruger, '&#230;', 'æ') WHERE INSTR(Bruger, '&#230;') > 0;
UPDATE Mikroforum SET Bruger = REPLACE(Bruger, '&#248;', 'ø') WHERE INSTR(Bruger, '&#248;') > 0;
UPDATE Mikroforum SET Bruger = REPLACE(Bruger, '&#233;', 'é') WHERE INSTR(Bruger, '&#233;') > 0;
UPDATE Mikroforum SET Bruger = REPLACE(Bruger, '&#229;', 'å') WHERE INSTR(Bruger, '&#229;') > 0;




INSERT INTO ObservationForum (_id, observation_id, createdAt, content) SELECT m._id, SUBSTRING_INDEX(m.IDFelt, "-", -1), 
CONCAT(
	SUBSTRING_INDEX(SUBSTRING_INDEX(m.Dato, " ", 1), "/", -1), 
	"-",
	SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(m.Dato, " ", 1), "/", 2), "/", -1),
	"-", 
	SUBSTRING_INDEX(SUBSTRING_INDEX(m.Dato, " ", 1), "/", 1),
	" ",
	SUBSTRING_INDEX(m.Dato, " ", -1)
 ), Textfelt FROM Mikroforum m, Fungi f WHERE m.IDfelt <> "" AND m.IDfelt=f.AtlasIDnummer;
	
UPDATE 	ObservationForum o, Users u, Mikroforum m SET o.user_id = u._id where m._id = o._id AND m.Bruger = u.name;

UPDATE 	ObservationForum o, Users u, Mikroforum m SET o.user_id = u._id where m._id = o._id AND m.Bruger = "Torbjorn" AND u.name ="Torbjørn Borgen";
UPDATE 	ObservationForum o, Users u, Mikroforum m SET o.user_id = u._id where m._id = o._id AND m.Bruger = "Jacob Heilmann Clausen" AND u.name ="Jacob Heilmann-Clausen";
UPDATE 	ObservationForum o, Users u, Mikroforum m SET o.user_id = u._id where m._id = o._id AND m.Bruger = "Jan" AND u.name ="Jan Vesterholt";
UPDATE 	ObservationForum o, Users u, Mikroforum m SET o.user_id = u._id where m._id = o._id AND m.Bruger = "Leif Sørensen" AND u.initialer ="LS";
UPDATE 	ObservationForum o, Users u, Mikroforum m SET o.user_id = u._id where m._id = o._id AND m.Bruger = u.initialer;

-- Create User Leif W. Laursen ?? (7 records in Mikroforum)
	
SELECT 	m.Bruger, count(m.*) FROM Mikroforum m, ObservationForum o WHERE m._id=o._id and o.user_id IS NULL GROUP BY m.Bruger;
	
	