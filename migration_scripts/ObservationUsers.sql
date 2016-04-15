
CREATE TABLE ObservationUsers (
	user_id INT(11) NOT NULL,
	observation_id INT(11) NOT NULL,
	PRIMARY KEY (user_id, observation_id ),
	FOREIGN KEY (user_id) REFERENCES Users(_id),
	FOREIGN KEY (observation_id) REFERENCES Observation(_id)
) ENGINE = InnoDB DEFAULT CHARSET=UTF8;

INSERT INTO ObservationUsers SELECT primaryuser_id, _id FROM Observation WHERE primaryuser_id IS NOT NULL;