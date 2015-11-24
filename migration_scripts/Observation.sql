CREATE TABLE IF NOT EXISTS Observation (
  _id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime DEFAULT NULL,
  observationDate datetime NOT NULL,
  observationDateAccuracy ENUM('day', 'month', 'year', 'invalid') NOT NULL DEFAULT 'day',
  locality_id INT(11),
  primaryuser_id INT(11),
  verbatimLeg VARCHAR(255),
  primarydetermination_id INT(11),
  primaryassociatedorganism_id INT(11) ,
  vegetationtype_id INT(11),
  ecologynote VARCHAR(510),
  decimalLatitude DOUBLE NOT NULL,
  decimalLongitude DOUBLE NOT NULL,
  accuracy INT(11),
  atlasUUID CHAR(43) ,
  fieldnumber VARCHAR(255),
  herbarium VARCHAR(55),
  note text,
  noteInternal VARCHAR(255),
  dataSource VARCHAR(255),
  FOREIGN KEY (primaryuser_id) REFERENCES Users(_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE Observation 
ADD FOREIGN KEY (primarydetermination_id) REFERENCES Determination(_id),
ADD FOREIGN KEY (vegetationtype_id) REFERENCES VegetationType(_id);
-- Husk at sætte primary determination NOT NULL når disse er oprettet og måske også VegType

CREATE TABLE observation_user (
user_id INT(11) NOT NULL,
observation_id	INT(11) NOT NULL,
PRIMARY KEY (user_id, observation_id),
FOREIGN KEY (user_id) REFERENCES User(_id),
FOREIGN KEY (observation_id) REFERENCES Observation(_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- clean data 

UPDATE Fungi SET AtlasUserPrec = 0 WHERE AtlasUserPrec = "";
UPDATE Fungi SET AtlasUserPrec = SUBSTRING_INDEX(AtlasUserPrec, ",", 1) WHERE AtlasUserPrec LIKE "%,%";
-- indsæt alle som kan mappes til fuld dato (observationDateAccuracy = day)

INSERT INTO Observation (
    _id ,
	createdAt,
	updatedAt,
    observationDate,
    locality_id,
    primaryuser_id,	
	verbatimLeg,
    ecologynote ,
    decimalLatitude ,
    decimalLongitude ,
    accuracy,
    atlasUUID, 
    fieldnumber,
    herbarium ,	
	note,
	noteInternal,
	dataSource
) select f.AtlasLNR, 
CONCAT( SUBSTRING(f.creation_date, 7, 4), SUBSTRING(f.creation_date, 4, 2), SUBSTRING(f.creation_date, 1, 2)),
CONCAT( SUBSTRING(f.modification_date, 7, 4), SUBSTRING(f.modification_date, 4, 2), SUBSTRING(f.modification_date, 1, 2)),  
CONCAT( SUBSTRING(f.date_calculated, 7, 4), SUBSTRING(f.date_calculated, 4, 2), SUBSTRING(f.date_calculated, 1, 2)),
f.AtlasLocID,
u._id,
f.Leg,
f.AtlasEcoNote,
f.AtlasUserLati,
f.AtlasUserLong,
f.AtlasUserPrec ,
f.AtlasUUID,
f.CollNr,
f.Herbarium,
f.Bemaerkn,
f.BemaerknIntern,
f.input_of_data
FROM Fungi f LEFT JOIN Users u ON f.AtlasLegInit = u.initialer WHERE f.AtlasLNR NOT IN (select _id from Observation) AND f.date_calculated NOT LIKE "%?%" AND f.date_calculated  <> "" AND f.creation_date  <> "";

UPDATE Observation o, Fungi f SET o.dataSource = f.input_of_data where f.AtlasLNR = o._id;

SELECT input_of_data, count(*) FROM Fungi f WHERE (f.date_calculated  LIKE "%?%" OR f.date_calculated  = "") AND date_year NOT REGEXP '^[[:digit:]]{4}$' GROUP BY input_of_data;


SELECT input_of_data, count(*) FROM Fungi f WHERE (f.date_calculated  LIKE "%?%" OR f.date_calculated  = "") AND date_year REGEXP '^[[:digit:]]{4}$'  AND date_month <> "0" AND date_day ="0" GROUP BY input_of_data;

-- Fix 4 TL records with wrong year in creation date
UPDATE Fungi SET creation_date = CONCAT(SUBSTRING_INDEX(creation_date, "/", 2), "/2001")  WHERE SUBSTRING_INDEX(creation_date, "/", -1) LIKE "0%";

-- indsæt alle som kan mappes til fuld måned (observationDateAccuracy = month)

INSERT INTO Observation (
    _id ,
	createdAt,
	updatedAt,
    observationDate,
	observationDateAccuracy,
    locality_id,
    primaryuser_id,	
	verbatimLeg,
    ecologynote ,
    decimalLatitude ,
    decimalLongitude ,
    accuracy,
    atlasUUID, 
    fieldnumber,
    herbarium ,	
	note,
	noteInternal,
	dataSource
) select f.AtlasLNR, 
CONCAT( SUBSTRING(f.creation_date, 7, 4), SUBSTRING(f.creation_date, 4, 2), SUBSTRING(f.creation_date, 1, 2)),
CONCAT( SUBSTRING(f.modification_date, 7, 4), SUBSTRING(f.modification_date, 4, 2), SUBSTRING(f.modification_date, 1, 2)),  
CONCAT( f.date_year,"-",f.date_month, "-00"),
'month',
f.AtlasLocID,
u._id,
f.Leg,
f.AtlasEcoNote,
f.AtlasUserLati,
f.AtlasUserLong,
f.AtlasUserPrec ,
f.AtlasUUID,
f.CollNr,
f.Herbarium,
f.Bemaerkn,
f.BemaerknIntern,
f.input_of_data
FROM Fungi f LEFT JOIN Users u ON f.AtlasLegInit = u.initialer WHERE f.AtlasLNR NOT IN (select _id from Observation) AND (f.date_calculated  LIKE "%?%" OR f.date_calculated  = "") AND f.date_year REGEXP '^[[:digit:]]{4}$'  AND f.date_month <> "0" AND (f.date_day ="0" OR CAST(f.date_day AS UNSIGNED) > 31);

-- indsæt alle som kan mappes til fuldt år (observationDateAccuracy = year) 

INSERT INTO Observation (
    _id ,
	createdAt,
	updatedAt,
    observationDate,
	observationDateAccuracy,
    locality_id,
    primaryuser_id,	
	verbatimLeg,
    ecologynote ,
    decimalLatitude ,
    decimalLongitude ,
    accuracy,
    atlasUUID, 
    fieldnumber,
    herbarium ,	
	note,
	noteInternal,
	dataSource
) select f.AtlasLNR, 
CONCAT( SUBSTRING(f.creation_date, 7, 4), SUBSTRING(f.creation_date, 4, 2), SUBSTRING(f.creation_date, 1, 2)),
CONCAT( SUBSTRING(f.modification_date, 7, 4), SUBSTRING(f.modification_date, 4, 2), SUBSTRING(f.modification_date, 1, 2)),  
CONCAT( f.date_year,"-", "-00-00"),
'year',
f.AtlasLocID,
u._id,
f.Leg,
f.AtlasEcoNote,
f.AtlasUserLati,
f.AtlasUserLong,
f.AtlasUserPrec ,
f.AtlasUUID,
f.CollNr,
f.Herbarium,
f.Bemaerkn,
f.BemaerknIntern,
f.input_of_data
FROM Fungi f LEFT JOIN Users u ON f.AtlasLegInit = u.initialer WHERE f.AtlasLNR NOT IN (select _id from Observation) AND (f.date_calculated  LIKE "%?%" OR f.date_calculated  = "") AND f.date_year REGEXP '^[[:digit:]]{4}$'  AND (f.date_month = "0" OR CAST(f.date_month AS UNSIGNED) > 12);

-- indsæt alle som kan mappes til dato, men ikke har korrekt date_calculated (observationDateAccuracy = day)

INSERT INTO Observation (
    _id ,
	createdAt,
	updatedAt,
    observationDate,
	observationDateAccuracy,
    locality_id,
    primaryuser_id,	
	verbatimLeg,
    ecologynote ,
    decimalLatitude ,
    decimalLongitude ,
    accuracy,
    atlasUUID, 
    fieldnumber,
    herbarium ,	
	note,
	noteInternal,
	dataSource
) select f.AtlasLNR, 
CONCAT( SUBSTRING(f.creation_date, 7, 4), SUBSTRING(f.creation_date, 4, 2), SUBSTRING(f.creation_date, 1, 2)),
CONCAT( SUBSTRING(f.modification_date, 7, 4), SUBSTRING(f.modification_date, 4, 2), SUBSTRING(f.modification_date, 1, 2)),  
CONCAT( f.date_year,"-", LPAD(f.date_month, 2,"0") ,"-", LPAD(f.date_day, 2,"0")),
'day',
f.AtlasLocID,
u._id,
f.Leg,
f.AtlasEcoNote,
f.AtlasUserLati,
f.AtlasUserLong,
f.AtlasUserPrec ,
f.AtlasUUID,
f.CollNr,
f.Herbarium,
f.Bemaerkn,
f.BemaerknIntern,
f.input_of_data
FROM Fungi f LEFT JOIN Users u ON f.AtlasLegInit = u.initialer WHERE f.AtlasLNR NOT IN (select _id from Observation) AND (f.date_calculated  LIKE "%?%" OR f.date_calculated  = "") AND f.date_year REGEXP '^[[:digit:]]{4}$'  AND f.date_month <> "0" AND CAST(f.date_month as UNSIGNED) < 13 AND f.date_day <>"0" 
AND ((f.date_month = "2" AND CAST(f.date_day as UNSIGNED) < 29) OR (f.date_month IN ("4", "6", "9", "11")  AND CAST(f.date_day as UNSIGNED) < 31) OR (f.date_month IN ("1","3", "5", "7", "8", "10", "12") AND CAST(f.date_day as UNSIGNED) < 32));

UPDATE Fungi SET date_year = "2010" where Det = "Svampekursus 2010 AU" AND date_year ="0";
UPDATE Fungi f SET creation_date = date_calculated WHERE creation_date="" AND f.date_calculated NOT LIKE "%?%" AND f.date_calculated  <> "";
-- Correct  31rd of apral, june, september, november
UPDATE Fungi f SET date_day = "30" WHERE (f.date_month IN ("4", "6", "9", "11")  AND CAST(f.date_day as UNSIGNED) = 31);

-- insert remainder with null dates
INSERT INTO Observation (
    _id ,
	createdAt,
	updatedAt,
    observationDate,
	observationDateAccuracy,
    locality_id,
    primaryuser_id,	
	verbatimLeg,
    ecologynote ,
    decimalLatitude ,
    decimalLongitude ,
    accuracy,
    atlasUUID, 
    fieldnumber,
    herbarium ,	
	note,
	noteInternal,
	dataSource
) select f.AtlasLNR, 
CONCAT( SUBSTRING(f.creation_date, 7, 4), SUBSTRING(f.creation_date, 4, 2), SUBSTRING(f.creation_date, 1, 2)),
CONCAT( SUBSTRING(f.modification_date, 7, 4), SUBSTRING(f.modification_date, 4, 2), SUBSTRING(f.modification_date, 1, 2)),  
'0000-00-00',
'invalid',
f.AtlasLocID,
u._id,
f.Leg,
f.AtlasEcoNote,
f.AtlasUserLati,
f.AtlasUserLong,
f.AtlasUserPrec ,
f.AtlasUUID,
f.CollNr,
f.Herbarium,
f.Bemaerkn,
f.BemaerknIntern,
f.input_of_data
FROM Fungi f LEFT JOIN Users u ON f.AtlasLegInit = u.initialer WHERE f.AtlasLNR NOT IN (select _id from Observation) AND ((f.date_calculated  LIKE "%?%" OR f.date_calculated  = "") AND (f.date_year= "0"  AND f.date_month = "0" AND f.date_day = "0") OR f.date_year NOT REGEXP '^[[:digit:]]{4}$'); 

-- Special case for two obs from feb. 1867 

INSERT INTO Observation (
    _id ,
	createdAt,
	updatedAt,
    observationDate,
	observationDateAccuracy,
    locality_id,
    primaryuser_id,	
	verbatimLeg,
    ecologynote ,
    decimalLatitude ,
    decimalLongitude ,
    accuracy,
    atlasUUID, 
    fieldnumber,
    herbarium ,	
	note,
	noteInternal,
	dataSource
) select f.AtlasLNR, 
CONCAT( SUBSTRING(f.creation_date, 7, 4), SUBSTRING(f.creation_date, 4, 2), SUBSTRING(f.creation_date, 1, 2)),
CONCAT( SUBSTRING(f.modification_date, 7, 4), SUBSTRING(f.modification_date, 4, 2), SUBSTRING(f.modification_date, 1, 2)),  
CONCAT( f.date_year,"-",f.date_month, "-00"),
'month',
f.AtlasLocID,
u._id,
f.Leg,
f.AtlasEcoNote,
f.AtlasUserLati,
f.AtlasUserLong,
f.AtlasUserPrec ,
f.AtlasUUID,
f.CollNr,
f.Herbarium,
f.Bemaerkn,
f.BemaerknIntern,
f.input_of_data
FROM Fungi f LEFT JOIN Users u ON f.AtlasLegInit = u.initialer WHERE f.AtlasLNR NOT IN (select _id from Observation) AND (f.date_calculated  LIKE "%?%" OR f.date_calculated  = "") AND f.date_year = "1867"  AND f.date_month = "2" AND  CAST(f.date_day AS UNSIGNED) > 28;