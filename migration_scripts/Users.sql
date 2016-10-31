ALTER TABLE `Users` ADD `preferred_language` ENUM('dk','en') NOT NULL DEFAULT 'dk' ;
ALTER TABLE `Users` ADD `photopermission` TINYINT(2) NOT NULL DEFAULT 0 ;