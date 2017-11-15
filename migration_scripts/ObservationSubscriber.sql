CREATE TABLE ObservationSubscriber (
  `createdAt` timestamp NOT NULL ,
  `lastRead` timestamp NOT NULL,
  `observation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (user_id, observation_id),
  FOREIGN KEY (observation_id) REFERENCES Observation(_id),
   FOREIGN KEY (user_id) REFERENCES Users(_id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;