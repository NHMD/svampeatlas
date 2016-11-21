CREATE TABLE IF NOT EXISTS Observation (
  _id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime DEFAULT NULL,
  observationDate datetime NOT NULL,
  observationDateAccuracy ENUM('day', 'month', 'year', 'invalid') NOT NULL DEFAULT 'day',
  locality_id INT(11),
  verbatimLocality VARCHAR(1020),
  primaryuser_id INT(11),
  verbatimLeg VARCHAR(255),
  primarydetermination_id INT(11),
  primaryassociatedorganism_id INT(11) ,
  vegetationtype_id INT(11),
  substrate_id INT(11),
  ecologynote VARCHAR(1020),
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

UPDATE Fungi SET  AtlasUserLati = 0  WHERE AtlasUserLati = "";
UPDATE Fungi SET  AtlasUserLong = 0  WHERE AtlasUserLong = "";
-- fix invalid lat longs
UPDATE Fungi SET  AtlasUserLati = REPLACE(AtlasUserLatiNum, ',', '.')  WHERE AtlasUserLati = 0 AND AtlasUserLatiNum LIKE "%,%";
UPDATE Fungi SET  AtlasUserLong = REPLACE(AtlasUserLongNum, ',', '.')  WHERE AtlasUserLong = 0 AND AtlasUserLongNum LIKE "%,%";;

select * from Fungi where CAST(AtlasUserLati as DECIMAL(10, 8)) IS NULL
lat DECIMAL(10, 8) NOT NULL, lng DECIMAL(11, 8) NOT NULL


select AtlasLNR, AtlasUserLati from Fungi where AtlasUserLati REGEXP '[:alpha:]'
select AtlasLNR, AtlasUserLati from Fungi where AtlasUserLati REGEXP '[:space:]';
select AtlasLNR, AtlasUserLati from Fungi where AtlasUserLati REGEXP '[^[:digit:].]';

select AtlasLNR, AtlasUserLong from Fungi where AtlasUserLong REGEXP '[^[:digit:].]';

UPDATE Fungi SET  AtlasUserLati = REPLACE(AtlasUserLatiNum, ',', '.')  WHERE AtlasUserLati REGEXP '[^[:digit:].]' AND AtlasUserLatiNum LIKE "%,%";
UPDATE Fungi SET  AtlasUserLati = 0  WHERE AtlasUserLati REGEXP '[^[:digit:].]';

select AtlasLNR, AtlasUserLong from Fungi where AtlasUserLong REGEXP '[^[:digit:].]';
UPDATE Fungi SET  AtlasUserLong = REPLACE(AtlasUserLongNum, ',', '.')  WHERE AtlasUserLong REGEXP '[^[:digit:].]' AND AtlasUserLongNum LIKE "%,%";
UPDATE Fungi SET  AtlasUserLong = 0  WHERE AtlasUserLong REGEXP '[^[:digit:].]';


UPDATE Fungi SET AtlasUserLati = SUBSTRING_INDEX(AtlasUserLati, "&", 1) WHERE AtlasUserLati LIKE "%&%";
UPDATE Fungi SET AtlasUserLati = SUBSTRING_INDEX(AtlasUserLati, "p", 1) WHERE AtlasUserLati LIKE "%p%";

select AtlasLNR, AtlasUserLati, SUBSTRING_INDEX(AtlasUserLati, "&", 1) from Fungi where AtlasLNR = 737908;

UPDATE Fungi set AtlasLocID =1 WHERE AtlasLocID ="";
-- UPDATE Fungi f, Fungi_RAW r set f.AtlasUserLati = r.AtlasUserLati WHERE f.AtlasLNR = r.AtlasLNR;



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
-- UPDATE Fungi f, Fungi_RAW r set f.creation_date = r.creation_date WHERE f.AtlasLNR = r.AtlasLNR;

UPDATE Fungi set date_day = 0 WHERE date_day ="";
UPDATE Fungi set date_month = 0 WHERE date_month ="";
UPDATE Fungi set date_year = 0 WHERE date_year ="";

ALTER TABLE Fungi MODIFY date_day INT(11), MODIFY date_month INT(11), MODIFY date_year INT(11);
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

-- Convert lat lons to POINTs

CREATE TABLE ObservationPoint (
	observation_id INT(11) primary key not null,
	p POINT NOT NULL
 ) ENGINE= MyISAM;
ALTER TABLE ObservationPoint ADD SPATIAL INDEX (p);
ALTER TABLE Observation ADD SPATIAL INDEX (geom);
insert into ObservationPoint SELECT _id, GeomFromText(CONCAT('POINT(',decimalLongitude,' ',decimalLatitude, ')')) FROM Observation;

	ALTER TABLE Observation ADD COLUMN p POINT ;
	UPDATE Observation o, ObservationPoint p SET o.p=p.p WHERE p.observation_id = o._id;

UPDATE Observation SET geom = GeomFromText(CONCAT('POINT(',decimalLongitude,' ',decimalLatitude, ')'));

---------------
--- Substrate and VegType
---------------
-- show all unmapped substrate
SELECT Substrate, count(*) from Fungi f, Observation o WHERE f.Substrate <> "" AND o._id = f.AtlasLNR AND o.substrate_id IS NULL GROUP BY Substrate ORDER BY count(*) DESC

SELECT Substrate, count(*) from Fungi f WHERE f.Substrate <> ""  AND f.Substrate NOT IN (SELECT distinct name FROM Substrate) GROUP BY Substrate ORDER BY count(*) DESC

-- alt der kan mappes til jord
UPDATE Observation o, Fungi f, Substrate s SET o.substrate_id=s._id WHERE o._id=f.AtlasLNR AND f.Substrate = s.name;

UPDATE Observation o, Fungi f SET o.substrate_id=1 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate = "on soil";

UPDATE Observation o, Fungi f SET o.substrate_id=1 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%on soil%";

UPDATE Observation o, Fungi f SET o.substrate_id=1 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%på jord%";

UPDATE Observation o, Fungi f SET o.substrate_id=1 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%jord%";

UPDATE Observation o, Fungi f SET o.substrate_id=1 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%soil%";

-- alt der kan mappes til ved

UPDATE Observation o, Fungi f SET o.substrate_id=4 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%on wood%";
UPDATE Observation o, Fungi f SET o.substrate_id=4 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%wood%";
UPDATE Observation o, Fungi f SET o.substrate_id=4 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%på ved%";

-- alt der kan mappes til brandplet

UPDATE Observation o, Fungi f SET o.substrate_id=16 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%brandplet%";
UPDATE Observation o, Fungi f SET o.substrate_id=16 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%burned ground%";
-- alt der kan mappes til nåle /blade
UPDATE Observation o, Fungi f SET o.substrate_id=2 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%needles%";
UPDATE Observation o, Fungi f SET o.substrate_id=2 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%leaves%";

-- alt der kan mappes til kogler
UPDATE Observation o, Fungi f SET o.substrate_id=7 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%cones%";
UPDATE Observation o, Fungi f SET o.substrate_id=7 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%kogler%";
UPDATE Observation o, Fungi f SET o.substrate_id=7 WHERE o._id=f.AtlasLNR  AND f.Substrate LIKE "%cones%";
UPDATE Observation o, Fungi f SET o.substrate_id=7 WHERE o._id=f.AtlasLNR  AND f.Substrate LIKE "%kogler%";

-- alt der kan mappes til kogler
UPDATE Observation o, Fungi f SET o.substrate_id=12 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%ekskrementer%";
--UPDATE Observation o, Fungi f SET o.substrate_id=12 WHERE o._id=f.AtlasLNR AND  o.substrate_id IS NULL AND f.Substrate LIKE "%kogler%";

-- Extract associatedOrganism where these are placed in substrate.....
ALTER TABLE `Fungi` CHANGE `Substrate` `Substrate` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;

UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = p.LatinName;
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = p.DKname;
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = p.DKandLatinName;

UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("on ",p.LatinName);

UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("on soil under ",p.LatinName);

UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("with ",p.LatinName);

UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("under ",p.LatinName);
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("under ",p.LatinName, " (",p.DKname,")");

UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("på ved fra ",p.LatinName);
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("på ",p.LatinName);
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("på ",p.DKname);
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("på ",p.DKandLatinName);
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("på ved fra ",p.DKandLatinName);


UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("on leaves of ",p.LatinName);

UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("on needles of ",p.LatinName);
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("on wood of ",p.LatinName);
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = CONCAT("on cones of ",p.LatinName);

UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = "on deciduous wood" AND p.LatinName ="løvtræ";
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = "på ved fra løvtræer" AND p.LatinName ="løvtræ";
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate = "on wood of deciduous trees" AND p.LatinName ="løvtræ";
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate LIKE "%deciduous%" AND p.LatinName ="løvtræ";

UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.Substrate LIKE "%coniferous%" AND p.LatinName ="nåletræ";


-- Smid substrat in i ecologynote hvor dette ikke kan mappes:

UPDATE Fungi f, Observation o SET o.ecologynote = CONCAT(o.ecologynote, " [Substrat: ",f.Substrate, "]") WHERE f.Substrate <> "" AND f.Substrate NOT IN (select distinct name from Substrate) AND o._id = f.AtlasLNR AND o.ecologynote <> "";
UPDATE Fungi f, Observation o SET o.ecologynote = CONCAT("[Substrat: ",f.Substrate, "]") WHERE f.Substrate <> "" AND f.Substrate NOT IN (select distinct name from Substrate) AND o._id = f.AtlasLNR AND o.ecologynote = "";

##################################################################### 18.5.2016
-- VegType
SELECT VegType, count(*) from Fungi f, Observation o WHERE f.VegType <> "" AND o._id = f.AtlasLNR AND o.vegetationtype_id IS NULL GROUP BY VegType ORDER BY count(*) DESC

SELECT VegType, count(*) from Fungi f WHERE f.VegType <> ""  AND f.VegType NOT IN (SELECT distinct name FROM VegetationType) GROUP BY VegType ORDER BY count(*) DESC

UPDATE Observation o, Fungi f, VegetationType v SET o.vegetationtype_id = v._id where o._id=f.AtlasLNR AND f.VegType = v.name;

-- Smid VegType in i ecologynote hvor dette ikke kan mappes:

UPDATE Fungi f, Observation o SET o.ecologynote = CONCAT(o.ecologynote, " [Vegetation type: ",f.VegType, "]") WHERE f.VegType <> "" AND f.VegType NOT IN (select distinct name from VegetationType) AND o._id = f.AtlasLNR AND o.ecologynote <> "";
UPDATE Fungi f, Observation o SET o.ecologynote = CONCAT("[Vegetation type: ",f.VegType, "]") WHERE f.VegType <> "" AND f.VegType NOT IN (select distinct name from VegetationType) AND o._id = f.AtlasLNR AND o.ecologynote = "";



ALTER TABLE `Fungi` CHANGE `VegType` `VegType` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;


UPDATE Fungi f, Observation o SET o.ecologynote = f.AtlasEcoNote where f.AtlasLNR = o._id;

UPDATE Observation o, Fungi f SET o.vegetationtype_id=10 WHERE o._id=f.AtlasLNR AND  o.vegetationtype_id IS NULL AND f.VegType LIKE "%kyst- og overdrevskrat%";

UPDATE Observation o, Fungi f SET o.vegetationtype_id=6 WHERE o._id=f.AtlasLNR AND  o.vegetationtype_id IS NULL AND f.VegType = "blandskov";
UPDATE Observation o, Fungi f SET o.vegetationtype_id=6 WHERE o._id=f.AtlasLNR AND  o.vegetationtype_id IS NULL AND f.VegType = "nåleskov og løvskov";
UPDATE Observation o, Fungi f SET o.vegetationtype_id=1 WHERE o._id=f.AtlasLNR AND  o.vegetationtype_id IS NULL AND f.VegType = "Bøgeskov";

UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.VegType = "Bøgeskov" AND p.LatinName="Fagus";

UPDATE Observation o, Fungi f SET o.vegetationtype_id=1 WHERE o._id=f.AtlasLNR AND  o.vegetationtype_id IS NULL AND f.VegType LIKE "%deciduous forest%";
UPDATE Observation o, Fungi f SET o.vegetationtype_id=4 WHERE o._id=f.AtlasLNR AND  o.vegetationtype_id IS NULL AND f.VegType = "under coniferous trees";

UPDATE Observation o, Fungi f SET o.vegetationtype_id=16 WHERE o._id=f.AtlasLNR AND  o.vegetationtype_id IS NULL AND f.VegType = "Overderv";
UPDATE Observation o, Fungi f SET o.vegetationtype_id=8 WHERE o._id=f.AtlasLNR AND  o.vegetationtype_id IS NULL AND f.VegType = "ellesump";
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.VegType = "ellesump" AND p.LatinName="Alnus";

UPDATE Observation o, Fungi f SET o.vegetationtype_id=27 WHERE o._id=f.AtlasLNR AND  o.vegetationtype_id IS NULL AND f.VegType = "Industriel habitat";

-- Extract associatedOrganism where these are placed in VegType.....
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.VegType = CONCAT("under ",p.LatinName);
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.VegType = CONCAT("under ",p.LatinName, " (",p.DKname,")");

UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.VegType = CONCAT("på ",p.DKname);
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.VegType = CONCAT("på ",p.LatinName, " (",p.DKname,")");

UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.VegType = p.LatinName;
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.VegType = p.DKname;
UPDATE Observation o, Fungi f, PlantTaxon p SET o.primaryassociatedorganism_id=p._id WHERE o.primaryassociatedorganism_id IS NULL AND o._id=f.AtlasLNR AND f.VegType = p.DKandLatinName;


ALTER TABLE Observation ADD COLUMN geonameId INT(11) default NULL;
ALTER TABLE `Observation`
ADD  FOREIGN KEY (`geonameId`) REFERENCES `GeoNames` (`geonameId`);

ALTER TABLE Observation ADD INDEX  (`dataSource`);