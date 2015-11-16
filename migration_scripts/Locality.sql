 

CREATE TABLE IF NOT EXISTS Locality (
  _id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  decimalLatitude DECIMAL(10, 8) NOT NULL,
  decimalLongitude DECIMAL(11, 8) NOT NULL,
  accuracy INT(11),
  utm_northing INT(11) ,
  utm_easting INT(11),
  utm10 VARCHAR(5),
  kommune VARCHAR(55),
  source VARCHAR(128),
  description TEXT,
  moderator VARCHAR(55),
  include TINYINT(1) NOT NULL,
  mainlocality TINYINT(1) NOT NULL
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

UPDATE GazFusion set include=0 where include="";
UPDATE GazFusion set usikkerhed=0 where usikkerhed="";
UPDATE GazFusion set include=0 where hovedlokalitet="";

insert into Locality ( _id,  name, decimalLatitude, decimalLongitude, accuracy, utm_northing, utm_easting, utm10, kommune,source, description, moderator, include, mainlocality) 
	select LocID, LocName, GoogleLat, GoogleLong, usikkerhed, Northing, Easting, UTM10, Kommune, Source, LocDescr, moderator, include, hovedlokalitet FROM GazFusion;