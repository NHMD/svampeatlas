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

-- import data then:
UPDATE PicBase set Foto_vises_ikke = 0 where Foto_vises_ikke ="";

CREATE TABLE ObservationImages (
_id INT(11) NOT NULL PRIMARY KEY,
createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
observation_id INT(11) NOT NULL,
hide TINYINT(1),
name VARCHAR(255),
FOREIGN KEY (observation_id) REFERENCES Observation (_id)
) ENGINE = InnoDB DEFAULT CHARSET = UTF8;

INSERT INTO ObservationImages SELECT SUBSTRING_INDEX(PicID, "PIC", -1), CONCAT(SUBSTRING_INDEX(CreationDate, "/", -1), "-",SUBSTRING_INDEX(SUBSTRING_INDEX(CreationDate, "/", 2), "/", -1),"-", SUBSTRING_INDEX(CreationDate, "/", 1) ) , SUBSTRING_INDEX(AtlasRecID, "-", -1), Foto_vises_ikke, PicID FROM PicBase p, Fungi f WHERE f.AtlasIDnummer = p.AtlasRecID;

SELECT COUNT(*) FROM PicBase where AtlasRecID NOT IN 
