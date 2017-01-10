
CREATE TABLE DeterminationVotes (
_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt datetime DEFAULT NULL,
user_id INT(11) NOT NULL,
determination_id INT(11) NOT NULL,
observation_id INT(11) NOT NULL,
score INT(11) NOT NULL DEFAULT 1,
FOREIGN KEY (user_id) REFERENCES Users(_id),
FOREIGN KEY (determination_id) REFERENCES Determination(_id),
FOREIGN KEY (observation_id) REFERENCES Observation(_id),
UNIQUE (user_id, determination_id)
 
) ENGINE = InnoDB;





