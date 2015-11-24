CREATE TABLE IF NOT EXISTS Determination (
  _id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime DEFAULT NULL,
  observation_id int(11) NOT NULL ,
  taxon_id int(11) NOT NULL ,
  user_id int(11) NOT NULL ,
  score INT(11) DEFAULT 0, 
  validation ENUM( 'Godkendt', 'Gammelvali', 'Valideres', 'Afventer',  'Afvist',  'Slettes'  ),
  FOREIGN KEY (observation_id) REFERENCES Observation(_id),
  FOREIGN KEY (user_id) REFERENCES User(_id),
  FOREIGN KEY (taxon_id) REFERENCES Taxon(_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;