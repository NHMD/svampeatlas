CREATE TABLE ObservationEvents (
`_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `createdAt` timestamp NOT NULL ,
  `observation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `eventType` ENUM( 'DETERMINATION_ADDED', 'DETERMINATION_APPROVED', 'DETERMINATION_EXPERT_APPROVED', 'COMMENT_ADDED' ) NOT NULL,
  `determination_id` int(11) DEFAULT NULL,
  FOREIGN KEY (observation_id) REFERENCES Observation(_id),
   FOREIGN KEY (user_id) REFERENCES Users(_id),
   FOREIGN KEY (determination_id) REFERENCES Determination(_id)  
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;


CREATE TABLE ObservationEventMentions (
	`observationevent_id` int(11) NOT NULL,
	`user_id` int(11) NOT NULL,
	PRIMARY KEY(observationevent_id, user_id),
    FOREIGN KEY (observationevent_id) REFERENCES ObservationEvents(_id),
     FOREIGN KEY (user_id) REFERENCES Users(_id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE ObservationEventDeterminations (
	`observationevent_id` int(11) NOT NULL,
	`determination_id` int(11) NOT NULL,
	PRIMARY KEY(observationevent_id, determination_id),
    FOREIGN KEY (observationevent_id) REFERENCES ObservationEvents(_id),
     FOREIGN KEY (determination_id) REFERENCES Determination(_id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;