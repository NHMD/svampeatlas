CREATE TABLE IF NOT EXISTS `ObservationLog` (
`_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL ,
  `updatedAt` timestamp NOT NULL,
  `oldvalues` text DEFAULT NULL,
  `observation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- ON SERVER MySQL 5.7 supports JSON:

CREATE TABLE IF NOT EXISTS `ObservationLog` (
`_id` int(11) NOT NULL PRIMARY KEY,
  `createdAt` timestamp NOT NULL ,
  `updatedAt` timestamp NOT NULL,
  `oldvalues` JSON,
  `observation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

ALTER TABLE `ObservationLog` CHANGE `_id` `_id` INT(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `ObservationLog`
 ADD PRIMARY KEY (`_id`), ADD KEY `observation_id` (`observation_id`), ADD KEY `user_id` (`user_id`);
 
 ALTER TABLE `ObservationLog`
 ADD CONSTRAINT `observationlog_ibfk_1` FOREIGN KEY (`observation_id`) REFERENCES `Observation` (`_id`),
 ADD CONSTRAINT `observationlog_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`);