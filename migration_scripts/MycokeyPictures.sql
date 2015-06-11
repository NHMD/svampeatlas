CREATE TABLE MycoKeyPictures (
_id varchar(255),
path varchar(255)
) ENGINE = InnoDB DEFAULT CHARSET= UTF8;

-- import csv from filemaker (DkIndexNumber, MycoKeyHtmlReference)

UPDATE MycoKeyPictures SET _id= NULL where _id = "";

ALTER TABLE MycoKeyPictures MODIFY COLUMN _id INT(11);
ALTER TABLE MycoKeyPictures ADD FULLTEXT KEY `path` (`path`), ADD KEY `_id` (`_id`);

DELETE FROM MycoKeyPictures WHERE path = "";


DROP FUNCTION IF EXISTS alphas; 
DELIMITER | 
CREATE FUNCTION alphas( str VARCHAR(255) ) RETURNS VARCHAR(255) 
BEGIN 
  DECLARE i, len SMALLINT DEFAULT 1; 
  DECLARE ret VARCHAR(255) DEFAULT ''; 
  DECLARE c CHAR(1); 
  SET len = CHAR_LENGTH( str ); 
  REPEAT 
    BEGIN 
      SET c = MID( str, i, 1 ); 
      IF c REGEXP '[[:alpha:]]' THEN 
        SET ret=CONCAT(ret,c); 
      END IF; 
      SET i = i + 1; 
    END; 
  UNTIL i > len END REPEAT; 
  RETURN ret; 
END | 
DELIMITER ; 






UPDATE MycoKeyPictures p1, MycoKeyPictures p2 SET p2._id = p1._id where p1._id IS NOT NULL AND p2._id IS NULL AND SUBSTRING_INDEX(p1.path, ":", 4) = SUBSTRING_INDEX(p2.path, ":", 4) AND alphas(p1.path) = alphas(p2.path);

SELECT * from MycoKeyPictures p1, MycoKeyPictures p2  where p1._id=11069 AND SUBSTRING_INDEX(p1.path, ":", 4) = SUBSTRING_INDEX(p2.path, ":", 4) AND alphas(p1.path) = alphas(p2.path);


CREATE TABLE MycoKeyAttributes (
collectionInformation VARCHAR(255) ,
copyrightString VARCHAR(255) ,
Country VARCHAR(255) ,
illustrator VARCHAR(255) ,
IndexFungorumID VARCHAR(255) ,
MycoKeyHtmlReference VARCHAR(255) ,
Number VARCHAR(255) 
)ENGINE = InnoDB DEFAULT CHARSET= UTF8;

-- import csv from filemaker MycokeyPictures all attrs

ALTER TABLE MycoKeyAttributes MODIFY COLUMN IndexFungorumID INT(11);
ALTER TABLE MycoKeyAttributes ADD FULLTEXT KEY `MycoKeyHtmlReference` (`MycoKeyHtmlReference`), ADD KEY `IndexFungorumID` (`IndexFungorumID`);

