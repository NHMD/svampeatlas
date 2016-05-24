CREATE TABLE PicBase (
AtlasRecID VARCHAR(255),
CreationDate VARCHAR(255),
CreationDateExact  VARCHAR(255),
D  VARCHAR(255),
Foto_vises_ikke  VARCHAR(255),
M VARCHAR(255),
PicID VARCHAR(255),
X VARCHAR(255),
Y VARCHAR(255)) ENGINE = InnoDB DEFAULT CHARSET = UTF8;


LOAD DATA INFILE "/Users/thomasjeppesen/svampeatlas/exports/PicBase.csv" INTO TABLE PicBase
FIELDS TERMINATED BY ',' 
            ENCLOSED BY '"'
    LINES  TERMINATED BY '\r'; -- or \r\n;

	LOAD DATA INFILE "/Users/thomasjeppesen/svampeatlas/MIGRATION_FINAL/PicBase.csv" INTO TABLE PicBase
	FIELDS TERMINATED BY ',' 
	            ENCLOSED BY '"'
	    LINES  TERMINATED BY '\r'; -- or \r\n;


-- import data then:
UPDATE PicBase set Foto_vises_ikke = 0 where Foto_vises_ikke ="";

CREATE TABLE ObservationImages (
_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
observation_id INT(11) NOT NULL,
hide TINYINT(1),
name VARCHAR(255),
FOREIGN KEY (observation_id) REFERENCES Observation (_id)
) ENGINE = InnoDB DEFAULT CHARSET = UTF8;


select PicID, COUNT(*) from PicBase GROUP BY PicID having COUNT(*) > 1;


ALTER IGNORE TABLE PicBase
ADD UNIQUE INDEX (PicID, AtlasRecID);

DELETE FROM PicBase where PicID LIKE "%http://www.svampe.dk/atlas/%";

DELETE FROM PicBase where AtlasRecID ="TB2010-112462";
INSERT INTO `PicBase` (`AtlasRecID`, `CreationDate`, `CreationDateExact`, `D`, `Foto_vises_ikke`, `M`, `PicID`, `X`, `Y`) VALUES
('TB2010-112462', '10/09/2010', '10/09/2010 7:55:21', '10', '0', '9', 'TB2010PIC72897372', '', '2010');


INSERT INTO ObservationImages (createdAt, observation_id, hide, name) SELECT  CONCAT(SUBSTRING_INDEX(CreationDate, "/", -1), "-",SUBSTRING_INDEX(SUBSTRING_INDEX(CreationDate, "/", 2), "/", -1),"-", SUBSTRING_INDEX(CreationDate, "/", 1)," ", SUBSTRING_INDEX(CreationDateExact, " ", -1) ) , SUBSTRING_INDEX(AtlasRecID, "-", -1), Foto_vises_ikke, PicID FROM PicBase p, Fungi f WHERE f.AtlasIDnummer = p.AtlasRecID;


alter table ObservationImages add column user_id INT(11);
update ObservationImages o, Observation ob set o.user_id=ob.primaryuser_id where o.observation_id = ob._id;
SELECT COUNT(*) FROM PicBase where AtlasRecID NOT IN 
