CREATE TABLE IF NOT EXISTS Observation (
  _id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime DEFAULT NULL,
  observationDate datetime NOT NULL,
  locality_id INT(11),
  primaryuser_id INT(11) NOT NULL,	
  primarydetermination_id INT(11) NOT NULL,
  decimalLatitude DECIMAL(10, 8) NOT NULL,
  decimalLongitude DECIMAL(11, 8) NOT NULL,
  atlasUUID CHAR(16), 
  FOREIGN KEY (primaryuser_id) REFERENCES User(_id),
  FOREIGN KEY (primarydetermination_id) REFERENCES Determination(_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE observation_user (
user_id INT(11) NOT NULL,
observation_id	INT(11) NOT NULL,
PRIMARY KEY (user_id, observation_id),
FOREIGN KEY (user_id) REFERENCES User(_id),
FOREIGN KEY (observation_id) REFERENCES Observation(_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;