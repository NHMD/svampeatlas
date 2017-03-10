ALTER TABLE `Users` ADD `preferred_language` ENUM('dk','en') NOT NULL DEFAULT 'dk' ;
ALTER TABLE `Users` ADD `photopermission` TINYINT(2) NOT NULL DEFAULT 0 ;

INSERT INTO `svampeatlas`.`Role` (`_id`, `createdAt`, `updatedAt`, `name`) VALUES (NULL, CURRENT_TIMESTAMP, NULL, 'taxonimageadmin');

INSERT INTO `svampeatlas`.`Role` (`_id`, `createdAt`, `updatedAt`, `name`) VALUES (NULL, CURRENT_TIMESTAMP, NULL, 'downvotedetermination');