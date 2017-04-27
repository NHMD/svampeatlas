ALTER TABLE `Users` ADD `preferred_language` ENUM('dk','en') NOT NULL DEFAULT 'dk' ;
ALTER TABLE `Users` ADD `photopermission` TINYINT(2) NOT NULL DEFAULT 0 ;
ALTER TABLE `Users` ADD   `createdAt` TIMESTAMP NULL DEFAULT NULL;


INSERT INTO `svampeatlas`.`Role` (`_id`, `createdAt`, `updatedAt`, `name`) VALUES (NULL, CURRENT_TIMESTAMP, NULL, 'taxonimageadmin');

INSERT INTO `svampeatlas`.`Role` (`_id`, `createdAt`, `updatedAt`, `name`) VALUES (NULL, CURRENT_TIMESTAMP, NULL, 'downvotedetermination');