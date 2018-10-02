CREATE TABLE DnaSequence (
	_id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	observation_id int(11) NOT NULL,
	user_id int(11),
	createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	sequence TEXT NOT NULL,
	marker VARCHAR(55) NOT NULL,
	geneticAccessionNumber VARCHAR(55) DEFAULT NULL,
	FOREIGN KEY (observation_id) REFERENCES Observation (_id),
	FOREIGN KEY  (user_id) REFERENCES Users (_id)	
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;