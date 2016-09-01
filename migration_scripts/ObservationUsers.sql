
CREATE TABLE ObservationUsers (
	user_id INT(11) NOT NULL,
	observation_id INT(11) NOT NULL,
	PRIMARY KEY (user_id, observation_id ),
	FOREIGN KEY (user_id) REFERENCES Users(_id),
	FOREIGN KEY (observation_id) REFERENCES Observation(_id)
) ENGINE = InnoDB DEFAULT CHARSET=UTF8;

INSERT INTO ObservationUsers SELECT primaryuser_id, _id FROM Observation WHERE primaryuser_id IS NOT NULL;

ALTER TABLE `Fungi` CHANGE `Leg` `Leg` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;

INSERT IGNORE INTO ObservationUsers SELECT u._id, f.AtlasLNR FROM Fungi f, Users u where u.name = SUBSTRING_INDEX(f.Leg, " og ", -1);
INSERT IGNORE INTO ObservationUsers SELECT u._id, f.AtlasLNR FROM Fungi f, Users u where u.name = SUBSTRING_INDEX(f.Leg, " & ", -1);
INSERT IGNORE INTO ObservationUsers SELECT u._id, f.AtlasLNR FROM Fungi f, Users u where u.name = SUBSTRING_INDEX(f.Leg, ", ", -1);


DELETE ObservationUsers FROM ObservationUsers NATURAL JOIN (select o._id as observation_id, u._id as user_id from Observation o JOIN Users u ON u._id=o.primaryuser_id AND o.verbatimLeg NOT LIKE CONCAT("%",u.name, "%") AND (SUBSTRING_INDEX(o.verbatimLeg, " ", 1) <>  SUBSTRING_INDEX(u.name, " ", 1) AND SUBSTRING_INDEX(o.verbatimLeg, " ", -1) <>  SUBSTRING_INDEX(u.name, " ", -1)) AND o.verbatimLeg NOT LIKE CONCAT("%",LEFT(u.name, 1), ". ", SUBSTRING_INDEX(u.name, " ", -1), "%") AND u.Initialer <> o.verbatimLeg) a;

INSERT IGNORE INTO ObservationUsers SELECT u._id as user_id, o._id as observation_id  FROM Observation o, Users u,  Users u2 where u2._id=o.primaryuser_id AND u2._id<> u._id AND o.verbatimLeg LIKE  CONCAT("%", u.name, "%"); 
INSERT IGNORE INTO ObservationUsers SELECT u._id as user_id, o._id as observation_id  FROM Observation o, Users u,  Users u2 where u2._id=o.primaryuser_id AND u2._id<> u._id AND o.verbatimLeg LIKE CONCAT("%",LEFT(u.name, 1), ". ", SUBSTRING_INDEX(u.name, " ", -1), "%"); 




