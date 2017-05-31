-- MySQL dump 10.13  Distrib 5.7.17, for Linux (x86_64)
--
-- Host: localhost    Database: svampeatlas
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AreaStatistics`
--

DROP TABLE IF EXISTS `AreaStatistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AreaStatistics` (
  `area_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `num_users` int(11) DEFAULT NULL,
  `num_obs` int(11) DEFAULT NULL,
  `num_days` int(11) DEFAULT NULL,
  `num_years` int(11) DEFAULT NULL,
  `num_species` int(11) DEFAULT NULL,
  PRIMARY KEY (`area_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Areas`
--

DROP TABLE IF EXISTS `Areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Areas` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `verbatim_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `geom` geometry NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=770 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER area_insert_trigger
    AFTER INSERT ON `Areas`
    FOR EACH ROW

BEGIN
    CALL area_to_observation_mapping(NEW._id);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER area_update_trigger
    AFTER UPDATE ON `Areas`
    FOR EACH ROW

BEGIN
    CALL area_to_observation_mapping(NEW._id);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `CharacterGroup`
--

DROP TABLE IF EXISTS `CharacterGroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CharacterGroup` (
  `CharacterGroupID` int(11) NOT NULL,
  `Name` varchar(80) CHARACTER SET utf8 NOT NULL,
  `Full text UK` varchar(80) CHARACTER SET utf8 NOT NULL,
  `Start text UK` varchar(80) CHARACTER SET utf8 NOT NULL,
  `Full text DK` varchar(80) CHARACTER SET utf8 NOT NULL,
  `Start text DK` varchar(80) CHARACTER SET utf8 NOT NULL,
  `Sort` int(11) NOT NULL,
  `xxx` tinyint(1) NOT NULL,
  `CharacterSuperGroupID` int(11) NOT NULL,
  `Start description UK` varchar(255) CHARACTER SET utf8 NOT NULL,
  `Start description DK` varchar(255) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `CharacterView`
--

DROP TABLE IF EXISTS `CharacterView`;
/*!50001 DROP VIEW IF EXISTS `CharacterView`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `CharacterView` AS SELECT 
 1 AS `taxon_id`,
 1 AS `RealValueMin`,
 1 AS `RealValueMax`,
 1 AS `Type`,
 1 AS `Unit`,
 1 AS `CharacterID`,
 1 AS `description UK`,
 1 AS `description DK`,
 1 AS `Short text UK`,
 1 AS `Short text DK`,
 1 AS `Name`,
 1 AS `CharacterGroup`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `CharacterView2`
--

DROP TABLE IF EXISTS `CharacterView2`;
/*!50001 DROP VIEW IF EXISTS `CharacterView2`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `CharacterView2` AS SELECT 
 1 AS `CharacterID`,
 1 AS `Type`,
 1 AS `Unit`,
 1 AS `description UK`,
 1 AS `description DK`,
 1 AS `Short text UK`,
 1 AS `Short text DK`,
 1 AS `Name`,
 1 AS `CharacterGroup`,
 1 AS `Group Full text UK`,
 1 AS `Group Full text DK`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `Characters`
--

DROP TABLE IF EXISTS `Characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Characters` (
  `Name` varchar(80) NOT NULL,
  `Old name` varchar(80) NOT NULL,
  `CharacterID` int(11) NOT NULL,
  `Type` varchar(5) NOT NULL,
  `CharacterGroup` int(11) DEFAULT NULL,
  `description UK` varchar(80) NOT NULL,
  `Short text UK` varchar(80) NOT NULL,
  `description DK` varchar(80) NOT NULL,
  `Short text DK` varchar(80) NOT NULL,
  `UsingProbability` tinyint(1) NOT NULL,
  `TableID` int(11) NOT NULL,
  `FieldID` int(11) NOT NULL,
  `OnlyProbabilitySearch` tinyint(1) NOT NULL,
  `Sort` int(11) NOT NULL,
  `Unit` varchar(10) NOT NULL,
  `Omit in analysis` tinyint(1) NOT NULL,
  `SpecialCharacter` tinyint(1) NOT NULL,
  `MainCharacterReference` int(11) NOT NULL,
  `Omit in description` tinyint(1) NOT NULL,
  PRIMARY KEY (`CharacterID`),
  KEY `CharacterGroup` (`CharacterGroup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `CurrentRedListStatus`
--

DROP TABLE IF EXISTS `CurrentRedListStatus`;
/*!50001 DROP VIEW IF EXISTS `CurrentRedListStatus`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `CurrentRedListStatus` AS SELECT 
 1 AS `taxon_id`,
 1 AS `status`,
 1 AS `year`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `Determination`
--

DROP TABLE IF EXISTS `Determination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Determination` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `observation_id` int(11) NOT NULL,
  `taxon_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `confidence` enum('sikker','sandsynlig','mulig') DEFAULT NULL,
  `score` int(11) DEFAULT '0',
  `validation` enum('Godkendt','Gammelvali','Valideres','Afventer','Afvist','Slettes') DEFAULT NULL,
  `notes` text,
  `validatorremarks` varchar(255) DEFAULT NULL,
  `validator_id` int(11) DEFAULT NULL,
  `verbatimdeterminator` varchar(255) DEFAULT NULL,
  `createdByUser` int(11) DEFAULT NULL,
  `baseScore` int(11) DEFAULT '0',
  PRIMARY KEY (`_id`),
  UNIQUE KEY `observation_id_2` (`observation_id`,`taxon_id`),
  KEY `observation_id` (`observation_id`),
  KEY `user_id` (`user_id`),
  KEY `validator_id` (`validator_id`),
  KEY `verbatimdeterminator` (`verbatimdeterminator`),
  KEY `validation` (`validation`),
  KEY `taxon_id` (`taxon_id`),
  KEY `fk_createdbyuser_id` (`createdByUser`),
  KEY `score` (`score`),
  KEY `createdAt` (`createdAt`),
  CONSTRAINT `determination_ibfk_1` FOREIGN KEY (`observation_id`) REFERENCES `Observation` (`_id`),
  CONSTRAINT `determination_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`),
  CONSTRAINT `determination_ibfk_4` FOREIGN KEY (`validator_id`) REFERENCES `Users` (`_id`),
  CONSTRAINT `determination_ibfk_5` FOREIGN KEY (`taxon_id`) REFERENCES `Taxon` (`_id`),
  CONSTRAINT `fk_createdbyuser_id` FOREIGN KEY (`createdByUser`) REFERENCES `Users` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5560671 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `DeterminationLog`
--

DROP TABLE IF EXISTS `DeterminationLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DeterminationLog` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `logObject` TEXT DEFAULT NULL,
  `observation_id` int(11) NOT NULL,
  `determination_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `eventType` varchar(255) NOT NULL,
  PRIMARY KEY (`_id`),
  KEY `DeterminationLog_ibfk_2` (`user_id`),
  KEY `DeterminationLog_ibfk_3` (`determination_id`),
  KEY `DeterminationLog_ibfk_4` (`createdAt`),
  CONSTRAINT `DeterminationLog_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10939 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `DeterminationView`
--

DROP TABLE IF EXISTS `DeterminationView`;
/*!50001 DROP VIEW IF EXISTS `DeterminationView`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `DeterminationView` AS SELECT 
 1 AS `Determination_id`,
 1 AS `Determination_createdAt`,
 1 AS `Determination_updatedAt`,
 1 AS `Determination_observation_id`,
 1 AS `Determination_taxon_id`,
 1 AS `Determination_user_id`,
 1 AS `Determination_confidence`,
 1 AS `Determination_score`,
 1 AS `Determination_validation`,
 1 AS `Determination_notes`,
 1 AS `Determination_validatorremarks`,
 1 AS `Determination_validator_id`,
 1 AS `Determination_verbatimdeterminator`,
 1 AS `Taxon_id`,
 1 AS `Taxon_createdAt`,
 1 AS `Taxon_updatedAt`,
 1 AS `Taxon_Path`,
 1 AS `Taxon_SystematicPath`,
 1 AS `Taxon_Version`,
 1 AS `Taxon_FullName`,
 1 AS `Taxon_GUID`,
 1 AS `Taxon_FunIndexTypificationNumber`,
 1 AS `Taxon_FunIndexCurrUseNumber`,
 1 AS `Taxon_FunIndexNumber`,
 1 AS `Taxon_RankID`,
 1 AS `Taxon_RankName`,
 1 AS `Taxon_TaxonName`,
 1 AS `Taxon_Author`,
 1 AS `Taxon_vernacularname_dk`,
 1 AS `Taxon_parent_id`,
 1 AS `Taxon_accepted_id`,
 1 AS `Recorded_as_FullName`,
 1 AS `Recorded_as_id`,
 1 AS `Taxon_redlist_status`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `DeterminationView2`
--

DROP TABLE IF EXISTS `DeterminationView2`;
/*!50001 DROP VIEW IF EXISTS `DeterminationView2`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `DeterminationView2` AS SELECT 
 1 AS `Determination_id`,
 1 AS `Determination_createdAt`,
 1 AS `Determination_updatedAt`,
 1 AS `Determination_observation_id`,
 1 AS `Determination_taxon_id`,
 1 AS `Determination_user_id`,
 1 AS `Determination_confidence`,
 1 AS `Determination_score`,
 1 AS `Determination_validation`,
 1 AS `Determination_notes`,
 1 AS `Determination_validatorremarks`,
 1 AS `Determination_validator_id`,
 1 AS `Determination_verbatimdeterminator`,
 1 AS `Taxon_id`,
 1 AS `Taxon_createdAt`,
 1 AS `Taxon_updatedAt`,
 1 AS `Taxon_Path`,
 1 AS `Taxon_SystematicPath`,
 1 AS `Taxon_Version`,
 1 AS `Taxon_FullName`,
 1 AS `Taxon_GUID`,
 1 AS `Taxon_FunIndexTypificationNumber`,
 1 AS `Taxon_FunIndexCurrUseNumber`,
 1 AS `Taxon_FunIndexNumber`,
 1 AS `Taxon_RankID`,
 1 AS `Taxon_RankName`,
 1 AS `Taxon_TaxonName`,
 1 AS `Taxon_Author`,
 1 AS `Taxon_vernacularname_dk`,
 1 AS `Taxon_parent_id`,
 1 AS `Taxon_accepted_id`,
 1 AS `Taxon_morphogroup_id`,
 1 AS `Recorded_as_FullName`,
 1 AS `Recorded_as_id`,
 1 AS `Taxon_redlist_status`,
 1 AS `mycorrhizal`,
 1 AS `lichenized`,
 1 AS `parasite`,
 1 AS `saprobe`,
 1 AS `on_lichens`,
 1 AS `on_wood`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `DeterminationVotes`
--

DROP TABLE IF EXISTS `DeterminationVotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DeterminationVotes` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `determination_id` int(11) NOT NULL,
  `observation_id` int(11) NOT NULL,
  `score` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`_id`),
  UNIQUE KEY `user_id` (`user_id`,`determination_id`),
  KEY `determination_id` (`determination_id`),
  KEY `observation_id` (`observation_id`),
  CONSTRAINT `DeterminationVotes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`),
  CONSTRAINT `DeterminationVotes_ibfk_2` FOREIGN KEY (`determination_id`) REFERENCES `Determination` (`_id`),
  CONSTRAINT `DeterminationVotes_ibfk_3` FOREIGN KEY (`observation_id`) REFERENCES `Observation` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3838 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ErnaeringStrategi`
--

DROP TABLE IF EXISTS `ErnaeringStrategi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ErnaeringStrategi` (
  `_id` int(4) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `GenusCharacters`
--

DROP TABLE IF EXISTS `GenusCharacters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GenusCharacters` (
  `Character` int(11) NOT NULL,
  `xxxx` int(11) NOT NULL,
  `BoolValue` tinyint(1) NOT NULL,
  `RealValueMin` double NOT NULL,
  `RealValueMax` double NOT NULL,
  `Probability` double NOT NULL,
  `mark` tinyint(1) NOT NULL,
  `CodedForSpecies` tinyint(1) NOT NULL,
  `check` tinyint(1) NOT NULL,
  `GenusID` int(11) NOT NULL,
  `taxon_id` int(11) NOT NULL,
  PRIMARY KEY (`taxon_id`,`Character`),
  KEY `Character` (`Character`),
  KEY `GenusID` (`GenusID`),
  KEY `RealValueMax` (`RealValueMax`),
  KEY `RealValueMin` (`RealValueMin`),
  KEY `taxon_id` (`taxon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `GeoNames`
--

DROP TABLE IF EXISTS `GeoNames`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GeoNames` (
  `geonameId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `adminName1` varchar(255) NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lng` decimal(11,8) NOT NULL,
  `countryName` varchar(255) DEFAULT NULL,
  `countryCode` varchar(10) DEFAULT NULL,
  `fcodeName` varchar(255) DEFAULT NULL,
  `fclName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`geonameId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Locality`
--

DROP TABLE IF EXISTS `Locality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Locality` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `decimalLatitude` decimal(10,8) NOT NULL,
  `decimalLongitude` decimal(11,8) NOT NULL,
  `accuracy` int(11) DEFAULT NULL,
  `utm_northing` int(11) DEFAULT NULL,
  `utm_easting` int(11) DEFAULT NULL,
  `utm10` varchar(5) DEFAULT NULL,
  `kommune` varchar(55) DEFAULT NULL,
  `source` varchar(128) DEFAULT NULL,
  `description` text,
  `moderator` varchar(55) DEFAULT NULL,
  `include` tinyint(1) NOT NULL,
  `mainlocality` tinyint(1) NOT NULL,
  `probability` int(11) NOT NULL DEFAULT '0',
  `municipality_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`_id`),
  KEY `name` (`name`),
  KEY `probability` (`probability`),
  KEY `municipality_id` (`municipality_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29997 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Localityprobability`
--



--
-- Table structure for table `MorphoGroup`
--

DROP TABLE IF EXISTS `MorphoGroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MorphoGroup` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `name_dk` varchar(520) DEFAULT NULL,
  `name_uk` varchar(520) DEFAULT NULL,
  `image` varchar(520) DEFAULT NULL,
  `notes` text,
  `createdbyuser_id` int(11) NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Naturtyper`
--

DROP TABLE IF EXISTS `Naturtyper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Naturtyper` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `verbatimId` char(1) NOT NULL,
  `name` varchar(64) NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Observation`
--

DROP TABLE IF EXISTS `Observation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Observation` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `observationDate` date DEFAULT NULL,
  `observationDateAccuracy` enum('day','month','year','invalid') NOT NULL DEFAULT 'day',
  `locality_id` int(11) DEFAULT NULL,
  `verbatimLocality` varchar(1020) DEFAULT NULL,
  `primaryuser_id` int(11) DEFAULT NULL,
  `verbatimLeg` varchar(255) DEFAULT NULL,
  `primarydetermination_id` int(11) DEFAULT NULL,
  `primaryassociatedorganism_id` int(11) DEFAULT NULL,
  `vegetationtype_id` int(11) DEFAULT NULL,
  `substrate_id` int(11) DEFAULT NULL,
  `ecologynote` varchar(1020) DEFAULT NULL,
  `decimalLatitude` double NOT NULL,
  `decimalLongitude` double NOT NULL,
  `accuracy` int(11) DEFAULT NULL,
  `atlasUUID` char(43) DEFAULT NULL,
  `fieldnumber` varchar(255) DEFAULT NULL,
  `herbarium` varchar(55) DEFAULT NULL,
  `note` text,
  `noteInternal` varchar(255) DEFAULT NULL,
  `dataSource` varchar(255) DEFAULT NULL,
  `geom` point NOT NULL,
  `geonameId` int(11) DEFAULT NULL,
  `os` varchar(64) DEFAULT NULL,
  `browser` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`_id`),
  KEY `primaryuser_id` (`primaryuser_id`),
  KEY `locality_id` (`locality_id`),
  KEY `observationDate` (`observationDate`),
 
  KEY `observation_ibfk_3` (`primarydetermination_id`),
  KEY `observation_ibfk_4` (`vegetationtype_id`),
  KEY `observation_ibfk_5` (`geonameId`),
  KEY `verbatimLeg` (`verbatimLeg`),
  KEY `dataSource` (`dataSource`),
  KEY `createdAt` (`createdAt`),
  CONSTRAINT `observation_ibfk_1` FOREIGN KEY (`primaryuser_id`) REFERENCES `Users` (`_id`),
  CONSTRAINT `observation_ibfk_2` FOREIGN KEY (`locality_id`) REFERENCES `Locality` (`_id`),
  CONSTRAINT `observation_ibfk_3` FOREIGN KEY (`primarydetermination_id`) REFERENCES `Determination` (`_id`),
  CONSTRAINT `observation_ibfk_4` FOREIGN KEY (`vegetationtype_id`) REFERENCES `VegetationType` (`_id`),
  CONSTRAINT `observation_ibfk_5` FOREIGN KEY (`geonameId`) REFERENCES `GeoNames` (`geonameId`)
) ENGINE=InnoDB AUTO_INCREMENT=9193260 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER observation_insert_trigger
    AFTER INSERT ON `Observation`
    FOR EACH ROW

BEGIN
    CALL observation_to_area_mapping(NEW._id);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER observation_update_trigger
    AFTER UPDATE ON `Observation`
    FOR EACH ROW
BEGIN
CALL observation_to_area_mapping(NEW._id);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `ObservationAreas`
--

DROP TABLE IF EXISTS `ObservationAreas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ObservationAreas` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `observation_id` int(11) NOT NULL,
  `area_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `observationarea_unq_1` (`area_id`,`observation_id`),
  KEY `observationarea_ibfk_2` (`observation_id`),
  CONSTRAINT `observationarea_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `Areas` (`_id`),
  CONSTRAINT `observationarea_ibfk_2` FOREIGN KEY (`observation_id`) REFERENCES `Observation` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1795755 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ObservationForum`
--

DROP TABLE IF EXISTS `ObservationForum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ObservationForum` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `observation_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_danish_ci NOT NULL,
  PRIMARY KEY (`_id`),
  KEY `observation_id` (`observation_id`),
  KEY `user_id` (`user_id`),
  KEY `createdAt` (`createdAt`),
  CONSTRAINT `observationforum_ibfk_1` FOREIGN KEY (`observation_id`) REFERENCES `Observation` (`_id`),
  CONSTRAINT `observationforum_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=262823 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ObservationImages`
--

DROP TABLE IF EXISTS `ObservationImages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ObservationImages` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `observation_id` int(11) NOT NULL,
  `hide` tinyint(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`_id`),
  KEY `observation_id` (`observation_id`),
  KEY `createdAt` (`createdAt`),
  CONSTRAINT `observationimages_ibfk_1` FOREIGN KEY (`observation_id`) REFERENCES `Observation` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=117887 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ObservationLog`
--

DROP TABLE IF EXISTS `ObservationLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ObservationLog` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL,
  `updatedAt` timestamp NOT NULL,
  `oldvalues` text,
  `observation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `eventname` varchar(255) NOT NULL DEFAULT 'Updated fields',
  `description` varchar(1020) DEFAULT NULL,
  PRIMARY KEY (`_id`),
  KEY `observationlog_ibfk_1` (`observation_id`),
  KEY `observationlog_ibfk_2` (`user_id`),
  CONSTRAINT `observationlog_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32055 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ObservationPlantTaxon`
--

DROP TABLE IF EXISTS `ObservationPlantTaxon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ObservationPlantTaxon` (
  `planttaxon_id` int(11) NOT NULL,
  `observation_id` int(11) NOT NULL,
  PRIMARY KEY (`planttaxon_id`,`observation_id`),
  KEY `observation_id` (`observation_id`),
  CONSTRAINT `observationplanttaxon_ibfk_1` FOREIGN KEY (`planttaxon_id`) REFERENCES `PlantTaxon` (`_id`),
  CONSTRAINT `observationplanttaxon_ibfk_2` FOREIGN KEY (`observation_id`) REFERENCES `Observation` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ObservationUsers`
--

DROP TABLE IF EXISTS `ObservationUsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ObservationUsers` (
  `user_id` int(11) NOT NULL,
  `observation_id` int(11) NOT NULL,
  KEY `observationusers_ibfk_1` (`user_id`),
  KEY `observationusers_ibfk_2` (`observation_id`),
  CONSTRAINT `observationusers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`),
  CONSTRAINT `observationusers_ibfk_2` FOREIGN KEY (`observation_id`) REFERENCES `Observation` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PlantTaxon`
--

DROP TABLE IF EXISTS `PlantTaxon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PlantTaxon` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `DKname` varchar(255) DEFAULT NULL,
  `DKandLatinName` varchar(255) NOT NULL,
  `DKCode` varchar(11) DEFAULT NULL,
  `Ectomycorrhizal` varchar(11) DEFAULT NULL,
  `Genus` tinyint(1) DEFAULT NULL,
  `LatinName` varchar(255) NOT NULL,
  `LatinCode` varchar(11) DEFAULT NULL,
  `WoodySubstrate` varchar(11) DEFAULT NULL,
  `accepted_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `gbiftaxon_id` int(11) NOT NULL COMMENT 'refers to GBIF nubKey',
  `defaultlist` tinyint(1) NOT NULL DEFAULT '0',
  `probability` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`_id`),
  KEY `DKname` (`DKname`),
  KEY `DKandLatinName` (`DKandLatinName`),
  KEY `LatinName` (`LatinName`),
  KEY `defaultlist` (`defaultlist`),
  KEY `probability` (`probability`)
) ENGINE=InnoDB AUTO_INCREMENT=8337 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PlantTaxonprobability`
--



--
-- Table structure for table `RedListEditions`
--

DROP TABLE IF EXISTS `RedListEditions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RedListEditions` (
  `year` int(4) NOT NULL,
  `authors` varchar(255) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Role` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SimilarTaxa`
--

DROP TABLE IF EXISTS `SimilarTaxa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SimilarTaxa` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `createdbyuser_id` int(11) DEFAULT NULL,
  `taxon1_id` int(11) DEFAULT NULL,
  `taxon2_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`_id`),
  KEY `taxon1_id` (`taxon1_id`),
  KEY `taxon2_id` (`taxon2_id`),
  KEY `createdbyuser_id` (`createdbyuser_id`),
  CONSTRAINT `SimilarTaxa_ibfk_1` FOREIGN KEY (`taxon1_id`) REFERENCES `Taxon` (`_id`),
  CONSTRAINT `SimilarTaxa_ibfk_2` FOREIGN KEY (`taxon2_id`) REFERENCES `Taxon` (`_id`),
  CONSTRAINT `SimilarTaxa_ibfk_3` FOREIGN KEY (`createdbyuser_id`) REFERENCES `Users` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Storedsearch`
--

DROP TABLE IF EXISTS `Storedsearch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Storedsearch` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `search` text NOT NULL,
  PRIMARY KEY (`_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Storedsearch_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Substrate`
--

DROP TABLE IF EXISTS `Substrate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Substrate` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `name_uk` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `hide` tinyint(2) NOT NULL DEFAULT '0',
  `group_dk` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `group_uk` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Taxon`
--

DROP TABLE IF EXISTS `Taxon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Taxon` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `Path` varchar(255) DEFAULT NULL COMMENT 'Text index for subtree querying',
  `SystematicPath` varchar(255) DEFAULT NULL COMMENT 'Systematic path from Index Fungorum or MycoBank',
  `Version` int(11) DEFAULT NULL,
  `FullName` varchar(255) DEFAULT NULL COMMENT 'FuldeNavnFraFUN in FileMaker',
  `GUID` varchar(128) DEFAULT NULL,
  `FunIndexTypificationNumber` int(11) NOT NULL DEFAULT '0',
  `FunIndexCurrUseNumber` int(11) DEFAULT NULL,
  `FunIndexNumber` int(11) DEFAULT NULL,
  `RankID` int(11) NOT NULL,
  `RankName` varchar(128) DEFAULT NULL COMMENT 'taxonomic_rank in FileMaker',
  `TaxonName` varchar(128) NOT NULL,
  `Author` varchar(1024) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `accepted_id` int(11) DEFAULT NULL,
  `vernacularname_dk_id` int(11) DEFAULT NULL,
  `probability` int(11) NOT NULL DEFAULT '0',
  `morphogroup_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `Path_2` (`Path`),
  UNIQUE KEY `Path` (`Path`),
  KEY `RankName` (`RankName`),
  KEY `TaxonName` (`TaxonName`),
  KEY `parent_id` (`parent_id`),
  KEY `accepted_id` (`accepted_id`),
  KEY `FullName` (`FullName`),
  KEY `SystematicPath` (`SystematicPath`),
  KEY `probability` (`probability`),
  KEY `fk_morphogroup_id` (`morphogroup_id`),
  CONSTRAINT `fk_morphogroup_id` FOREIGN KEY (`morphogroup_id`) REFERENCES `MorphoGroup` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=67656 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaxonAttributes`
--

DROP TABLE IF EXISTS `TaxonAttributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TaxonAttributes` (
  `taxon_id` int(11) NOT NULL COMMENT 'DkIndexNumber in FileMaker',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `diagnose` text COMMENT 'diagnose in FileMaker',
  `forvekslingsmuligheder` text,
  `beskrivelse` text,
  `oekologi` text COMMENT 'AtlasOekologi in FileMaker',
  `bemaerkning` text COMMENT 'atlasBem_rkning in FileMaker',
  `foersteFundIDK` int(4) DEFAULT NULL,
  `foersteReferenceForDK` int(4) DEFAULT NULL,
  `PresentInDK` bit(1) NOT NULL DEFAULT b'0',
  `DK_reference` text,
  `MycoKeyIDDKWebLink` varchar(255) DEFAULT NULL,
  `internalNote` text COMMENT 'note_internal in FileMaker',
  `DKnavn` varchar(255) DEFAULT NULL,
  `vernacular_name_DE` varchar(255) DEFAULT NULL,
  `vernacular_name_Fi` varchar(255) DEFAULT NULL,
  `vernacular_name_FR` varchar(255) DEFAULT NULL,
  `vernacular_name_GB` varchar(255) DEFAULT NULL,
  `vernacular_name_NL` varchar(255) DEFAULT NULL,
  `vernacular_name_NO` varchar(255) DEFAULT NULL,
  `vernacular_name_SE` varchar(255) DEFAULT NULL,
  `spiselighedsrapport` varchar(255) DEFAULT NULL,
  `BeskrivelseUK` text,
  `bogtekst_faenologi_udbredelse` text,
  `bogtekst_gyldendal` text,
  `bog_Gyldendal_art_medtages` tinyint(1) NOT NULL DEFAULT '0',
  `Bogtekst_stor_art` tinyint(1) NOT NULL DEFAULT '0',
  `bog_gyldendal_korrekturlaest` tinyint(1) NOT NULL DEFAULT '0',
  `valideringskrav` tinyint(2) DEFAULT '2',
  `valideringsrapport` text,
  `basionym_described` int(5) DEFAULT '0',
  `fn_temperate` varchar(255) DEFAULT NULL,
  `fn_hemiboreal` varchar(255) DEFAULT NULL,
  `fn_boreal` varchar(255) DEFAULT NULL,
  `fn_subarctic_alpine` varchar(255) DEFAULT NULL,
  `fn_arctic_alpine` varchar(255) DEFAULT NULL,
  `fn_comment` varchar(255) DEFAULT NULL,
  `North_of_DK` varchar(255) DEFAULT NULL,
  `South_of_DK` varchar(255) DEFAULT NULL,
  `West_of_DK` varchar(255) DEFAULT NULL,
  `East_of_DK` varchar(255) DEFAULT NULL,
  `atlasart` tinyint(2) DEFAULT '0',
  PRIMARY KEY (`taxon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaxonDKnames`
--

DROP TABLE IF EXISTS `TaxonDKnames`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TaxonDKnames` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `taxon_id` int(11) NOT NULL,
  `vernacularname_dk` varchar(255) NOT NULL,
  `appliedLatinName` varchar(255) NOT NULL,
  `source` varchar(255) DEFAULT NULL,
  `note` varchar(510) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `taxon_id` (`taxon_id`,`vernacularname_dk`),
  CONSTRAINT `taxondknames_ibfk_1` FOREIGN KEY (`taxon_id`) REFERENCES `Taxon` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5459 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaxonErnaeringStrategi`
--

DROP TABLE IF EXISTS `TaxonErnaeringStrategi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TaxonErnaeringStrategi` (
  `ernaeringsstrategi_id` int(3) NOT NULL,
  `taxon_id` int(11) NOT NULL,
  PRIMARY KEY (`ernaeringsstrategi_id`,`taxon_id`),
  KEY `taxon_id` (`taxon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaxonImages`
--

DROP TABLE IF EXISTS `TaxonImages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TaxonImages` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `taxon_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `thumburi` varchar(255) NOT NULL,
  `uri` varchar(255) NOT NULL,
  `photographer` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `collectionNumber` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`_id`),
  KEY `taxon_id` (`taxon_id`),
  CONSTRAINT `taxonimages_ibfk_1` FOREIGN KEY (`taxon_id`) REFERENCES `Taxon` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9129 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaxonLog`
--

DROP TABLE IF EXISTS `TaxonLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TaxonLog` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  `eventname` varchar(255) NOT NULL,
  `description` varchar(1020) DEFAULT NULL,
  `taxon_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`_id`),
  KEY `taxon_id` (`taxon_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `taxonlog_ibfk_1` FOREIGN KEY (`taxon_id`) REFERENCES `Taxon` (`_id`),
  CONSTRAINT `taxonlog_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20180 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaxonNaturtype`
--

DROP TABLE IF EXISTS `TaxonNaturtype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TaxonNaturtype` (
  `naturtype_id` int(11) NOT NULL,
  `taxon_id` int(11) NOT NULL,
  PRIMARY KEY (`naturtype_id`,`taxon_id`),
  KEY `taxon_id` (`taxon_id`),
  CONSTRAINT `taxonnaturtype_ibfk_1` FOREIGN KEY (`naturtype_id`) REFERENCES `Naturtyper` (`_id`),
  CONSTRAINT `taxonnaturtype_ibfk_2` FOREIGN KEY (`taxon_id`) REFERENCES `Taxon` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaxonRanks`
--

DROP TABLE IF EXISTS `TaxonRanks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TaxonRanks` (
  `_id` int(2) NOT NULL AUTO_INCREMENT,
  `RankName` varchar(128) CHARACTER SET utf8 DEFAULT NULL COMMENT 'taxonomic_rank in FileMaker',
  `RankID` int(11) NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaxonRedListData`
--

DROP TABLE IF EXISTS `TaxonRedListData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TaxonRedListData` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `taxon_id` int(11) NOT NULL,
  `Artstilbagegang` int(11) DEFAULT NULL,
  `Status` enum('LC','NT','VU','EN','CR','RE','DD','NA','NE') DEFAULT NULL,
  `VerbatimStatus` varchar(255) DEFAULT NULL,
  `year` int(4) NOT NULL,
  `StatusDK` enum('DK','Rare','Vulnerable','Endangered','Observation','extinct','New') DEFAULT NULL,
  `StatusTal` int(11) DEFAULT NULL,
  `Roedlisteansvarlig` varchar(255) DEFAULT NULL,
  `roedlisteBestandsstoerrelse` int(11) DEFAULT NULL,
  `roedlisteBestandsstoerrelseAar` varchar(11) DEFAULT NULL,
  `roedlisteBestandsstoerrelseBem` text,
  `roedlisteBestandsudvikling` text,
  `roedlisteGenerationsinterval` int(4) DEFAULT NULL,
  `roedlisteGenerationstid` int(4) DEFAULT NULL,
  `roedlisteGruppe` enum('Barksvampe','Bladhatte','Bugsvampe','Bægersvampe','Bævresvampe','Kantareller og Trompetsvampe','Kernesvampe','Kølle- og Koralsvampe','Pigsvampe','Poresvampe','Rørhatte','Skivesvampe','Skørhatte og Mælkehatte','Trøfler','Vedboende pigsvampe') DEFAULT NULL,
  `roedlisteID` int(4) DEFAULT NULL,
  `roedlisteIndivider` int(4) DEFAULT NULL,
  `roedlisteLevesteder` varchar(255) DEFAULT NULL,
  `roedlisteNationalStatus` text,
  `roedlisteNationalStatusClean` text,
  `roedlisteNegativePaavirknBem` varchar(255) DEFAULT NULL,
  `roedlisteNegativePaavirkninger` varchar(255) DEFAULT NULL,
  `roedlisteNomenkaltur` varchar(11) DEFAULT NULL,
  `roedlisteUdbredelsesareal` int(4) DEFAULT NULL,
  `Roedlistevurdering` text,
  `NationalRoedlistekatogeri` varchar(11) DEFAULT NULL,
  `Udbredelse` text,
  `Litteratur` text,
  `Litteratur_DMU` varchar(255) DEFAULT NULL,
  `Kriterier` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `taxon_id` (`taxon_id`,`year`),
  KEY `year` (`year`),
  CONSTRAINT `taxonredlistdata_ibfk_1` FOREIGN KEY (`year`) REFERENCES `RedListEditions` (`year`)
) ENGINE=InnoDB AUTO_INCREMENT=13345 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaxonSpeciesHypothesis`
--

DROP TABLE IF EXISTS `TaxonSpeciesHypothesis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TaxonSpeciesHypothesis` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `taxon_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `specieshypothesis` varchar(255) NOT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `taxon_id` (`taxon_id`,`specieshypothesis`),
  CONSTRAINT `TaxonSpeciesHypothesis_ibfk_1` FOREIGN KEY (`taxon_id`) REFERENCES `Taxon` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaxonStatistics`
--

DROP TABLE IF EXISTS `TaxonStatistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TaxonStatistics` (
  `taxon_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `accepted_count` int(11) DEFAULT '0',
  `total_count` int(11) DEFAULT '0',
  `accepted_count_before_atlas` int(11) DEFAULT '0',
  `accepted_count_during_atlas` int(11) DEFAULT '0',
  `accepted_count_after_atlas` int(11) DEFAULT '0',
  `last_accepted_record` datetime DEFAULT NULL,
  `first_accepted_record` datetime DEFAULT NULL,
  PRIMARY KEY (`taxon_id`),
  KEY `accepted_count` (`accepted_count`),
  KEY `total_count` (`total_count`),
  KEY `accepted_count_before_atlas` (`accepted_count_before_atlas`),
  KEY `accepted_count_during_atlas` (`accepted_count_during_atlas`),
  KEY `accepted_count_after_atlas` (`accepted_count_after_atlas`),
  KEY `last_accepted_record` (`last_accepted_record`),
  KEY `first_accepted_record` (`first_accepted_record`),
  CONSTRAINT `TaxonStatistics_ibfk_1` FOREIGN KEY (`taxon_id`) REFERENCES `Taxon` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaxonTagDescriptions`
--

DROP TABLE IF EXISTS `TaxonTagDescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TaxonTagDescriptions` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tagname` varchar(255) DEFAULT NULL,
  `tagowner` int(11) NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaxonTags`
--

DROP TABLE IF EXISTS `TaxonTags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TaxonTags` (
  `tag_id` int(11) NOT NULL,
  `taxon_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tag_id`,`taxon_id`),
  KEY `taxon_id` (`taxon_id`),
  CONSTRAINT `taxontags_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `TaxonTagDescriptions` (`_id`) ON DELETE CASCADE,
  CONSTRAINT `taxontags_ibfk_2` FOREIGN KEY (`taxon_id`) REFERENCES `Taxon` (`_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `TaxonomyTagView`
--

DROP TABLE IF EXISTS `TaxonomyTagView`;
/*!50001 DROP VIEW IF EXISTS `TaxonomyTagView`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `TaxonomyTagView` AS SELECT 
 1 AS `taxon_id`,
 1 AS `tag_id`,
 1 AS `tagname`,
 1 AS `tagowner`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `Taxonprobability`
--

DROP TABLE IF EXISTS `Taxonprobability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Taxonprobability` (
  `_id` int(11) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `probability` int(11) NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Things`
--



--
-- Table structure for table `UserMorphoGroupImpact`
--

DROP TABLE IF EXISTS `UserMorphoGroupImpact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserMorphoGroupImpact` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `updatedByUser` int(11) DEFAULT NULL,
  `morphogroup_id` int(11) NOT NULL,
  `impact` int(5) DEFAULT '1',
  `min_impact` int(5) DEFAULT '1',
  `max_impact` int(5) DEFAULT '100',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `user_id` (`user_id`,`morphogroup_id`),
  KEY `morphogroup_id` (`morphogroup_id`),
  CONSTRAINT `usermorphogroupimpact_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`),
  CONSTRAINT `usermorphogroupimpact_ibfk_2` FOREIGN KEY (`morphogroup_id`) REFERENCES `MorphoGroup` (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=311652 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Userroles`
--

DROP TABLE IF EXISTS `Userroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Userroles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `userroles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`),
  CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `Role` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `facebook` mediumtext,
  `google` mediumtext,
  `Validation` tinyint(2) NOT NULL,
  `Initialer` varchar(64) NOT NULL,
  `preferred_language` enum('dk','en') NOT NULL DEFAULT 'dk',
  `photopermission` tinyint(2) NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `Initialer` (`Initialer`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1828 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `VegetationType`
--

DROP TABLE IF EXISTS `VegetationType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `VegetationType` (
  `_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(46) DEFAULT NULL,
  `name_uk` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;





--
-- Final view structure for view `CharacterView`
--

/*!50001 DROP VIEW IF EXISTS `CharacterView`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `CharacterView` AS select `g`.`taxon_id` AS `taxon_id`,`g`.`RealValueMin` AS `RealValueMin`,`g`.`RealValueMax` AS `RealValueMax`,`c`.`Type` AS `Type`,`c`.`Unit` AS `Unit`,`c`.`CharacterID` AS `CharacterID`,`c`.`description UK` AS `description UK`,`c`.`description DK` AS `description DK`,`c`.`Short text UK` AS `Short text UK`,`c`.`Short text DK` AS `Short text DK`,`c`.`Name` AS `Name`,`c`.`CharacterGroup` AS `CharacterGroup` from (`Characters` `c` join `GenusCharacters` `g` on((`c`.`CharacterID` = `g`.`Character`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `CharacterView2`
--

/*!50001 DROP VIEW IF EXISTS `CharacterView2`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `CharacterView2` AS select `c`.`CharacterID` AS `CharacterID`,`c`.`Type` AS `Type`,`c`.`Unit` AS `Unit`,`c`.`description UK` AS `description UK`,`c`.`description DK` AS `description DK`,`c`.`Short text UK` AS `Short text UK`,`c`.`Short text DK` AS `Short text DK`,`c`.`Name` AS `Name`,`c`.`CharacterGroup` AS `CharacterGroup`,`cg`.`Full text UK` AS `Group Full text UK`,`cg`.`Full text DK` AS `Group Full text DK` from (`Characters` `c` join `CharacterGroup` `cg` on((`c`.`CharacterGroup` = `cg`.`CharacterGroupID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `CurrentRedListStatus`
--

/*!50001 DROP VIEW IF EXISTS `CurrentRedListStatus`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `CurrentRedListStatus` AS select `TaxonRedListData`.`taxon_id` AS `taxon_id`,`TaxonRedListData`.`Status` AS `status`,`TaxonRedListData`.`year` AS `year` from `TaxonRedListData` where (`TaxonRedListData`.`year` = (select max(`TaxonRedListData`.`year`) from `TaxonRedListData`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `DeterminationView`
--

/*!50001 DROP VIEW IF EXISTS `DeterminationView`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `DeterminationView` AS select `d`.`_id` AS `Determination_id`,`d`.`createdAt` AS `Determination_createdAt`,`d`.`updatedAt` AS `Determination_updatedAt`,`d`.`observation_id` AS `Determination_observation_id`,`d`.`taxon_id` AS `Determination_taxon_id`,`d`.`user_id` AS `Determination_user_id`,`d`.`confidence` AS `Determination_confidence`,`d`.`score` AS `Determination_score`,`d`.`validation` AS `Determination_validation`,`d`.`notes` AS `Determination_notes`,`d`.`validatorremarks` AS `Determination_validatorremarks`,`d`.`validator_id` AS `Determination_validator_id`,`d`.`verbatimdeterminator` AS `Determination_verbatimdeterminator`,`t`.`_id` AS `Taxon_id`,`t`.`createdAt` AS `Taxon_createdAt`,`t`.`updatedAt` AS `Taxon_updatedAt`,`t`.`Path` AS `Taxon_Path`,`t`.`SystematicPath` AS `Taxon_SystematicPath`,`t`.`Version` AS `Taxon_Version`,`t`.`FullName` AS `Taxon_FullName`,`t`.`GUID` AS `Taxon_GUID`,`t`.`FunIndexTypificationNumber` AS `Taxon_FunIndexTypificationNumber`,`t`.`FunIndexCurrUseNumber` AS `Taxon_FunIndexCurrUseNumber`,`t`.`FunIndexNumber` AS `Taxon_FunIndexNumber`,`t`.`RankID` AS `Taxon_RankID`,`t`.`RankName` AS `Taxon_RankName`,`t`.`TaxonName` AS `Taxon_TaxonName`,`t`.`Author` AS `Taxon_Author`,`n`.`vernacularname_dk` AS `Taxon_vernacularname_dk`,`t`.`parent_id` AS `Taxon_parent_id`,`t`.`accepted_id` AS `Taxon_accepted_id`,`t2`.`FullName` AS `Recorded_as_FullName`,`t2`.`_id` AS `Recorded_as_id`,`r`.`status` AS `Taxon_redlist_status` from ((((`Determination` `d` join `Taxon` `t2` on((`t2`.`_id` = `d`.`taxon_id`))) join `Taxon` `t` on((`t2`.`accepted_id` = `t`.`_id`))) left join `TaxonDKnames` `n` on((`t`.`vernacularname_dk_id` = `n`.`_id`))) left join `CurrentRedListStatus` `r` on((`r`.`taxon_id` = `t`.`_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `DeterminationView2`
--

/*!50001 DROP VIEW IF EXISTS `DeterminationView2`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `DeterminationView2` AS select `d`.`_id` AS `Determination_id`,`d`.`createdAt` AS `Determination_createdAt`,`d`.`updatedAt` AS `Determination_updatedAt`,`d`.`observation_id` AS `Determination_observation_id`,`d`.`taxon_id` AS `Determination_taxon_id`,`d`.`user_id` AS `Determination_user_id`,`d`.`confidence` AS `Determination_confidence`,`d`.`score` AS `Determination_score`,`d`.`validation` AS `Determination_validation`,`d`.`notes` AS `Determination_notes`,`d`.`validatorremarks` AS `Determination_validatorremarks`,`d`.`validator_id` AS `Determination_validator_id`,`d`.`verbatimdeterminator` AS `Determination_verbatimdeterminator`,`t`.`_id` AS `Taxon_id`,`t`.`createdAt` AS `Taxon_createdAt`,`t`.`updatedAt` AS `Taxon_updatedAt`,`t`.`Path` AS `Taxon_Path`,`t`.`SystematicPath` AS `Taxon_SystematicPath`,`t`.`Version` AS `Taxon_Version`,`t`.`FullName` AS `Taxon_FullName`,`t`.`GUID` AS `Taxon_GUID`,`t`.`FunIndexTypificationNumber` AS `Taxon_FunIndexTypificationNumber`,`t`.`FunIndexCurrUseNumber` AS `Taxon_FunIndexCurrUseNumber`,`t`.`FunIndexNumber` AS `Taxon_FunIndexNumber`,`t`.`RankID` AS `Taxon_RankID`,`t`.`RankName` AS `Taxon_RankName`,`t`.`TaxonName` AS `Taxon_TaxonName`,`t`.`Author` AS `Taxon_Author`,`n`.`vernacularname_dk` AS `Taxon_vernacularname_dk`,`t`.`parent_id` AS `Taxon_parent_id`,`t`.`accepted_id` AS `Taxon_accepted_id`,`t`.`morphogroup_id` AS `Taxon_morphogroup_id`,`t2`.`FullName` AS `Recorded_as_FullName`,`t2`.`_id` AS `Recorded_as_id`,`r`.`status` AS `Taxon_redlist_status`,(`cv1`.`CharacterID` is not null) AS `mycorrhizal`,(`cv2`.`CharacterID` is not null) AS `lichenized`,(`cv3`.`CharacterID` is not null) AS `parasite`,(`cv4`.`CharacterID` is not null) AS `saprobe`,(`cv5`.`CharacterID` is not null) AS `on_lichens`,(`cv6`.`CharacterID` is not null) AS `on_wood` from ((((((((((`Determination` `d` join `Taxon` `t2` on((`t2`.`_id` = `d`.`taxon_id`))) join `Taxon` `t` on((`t2`.`accepted_id` = `t`.`_id`))) left join `TaxonDKnames` `n` on((`t`.`vernacularname_dk_id` = `n`.`_id`))) left join `CharacterView` `cv1` on(((`t`.`_id` = `cv1`.`taxon_id`) and (`cv1`.`CharacterID` = 381)))) left join `CharacterView` `cv2` on(((`t`.`_id` = `cv2`.`taxon_id`) and (`cv2`.`CharacterID` = 380)))) left join `CharacterView` `cv3` on(((`t`.`_id` = `cv3`.`taxon_id`) and (`cv3`.`CharacterID` = 382)))) left join `CharacterView` `cv4` on(((`t`.`_id` = `cv4`.`taxon_id`) and (`cv4`.`CharacterID` = 385)))) left join `CharacterView` `cv5` on(((`t`.`_id` = `cv5`.`taxon_id`) and (`cv5`.`CharacterID` = 404)))) left join `CharacterView` `cv6` on(((`t`.`_id` = `cv6`.`taxon_id`) and (`cv6`.`CharacterID` = 412)))) left join `CurrentRedListStatus` `r` on((`r`.`taxon_id` = `t`.`_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `TaxonomyTagView`
--

/*!50001 DROP VIEW IF EXISTS `TaxonomyTagView`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `TaxonomyTagView` AS select `g`.`taxon_id` AS `taxon_id`,`g`.`tag_id` AS `tag_id`,`c`.`tagname` AS `tagname`,`c`.`tagowner` AS `tagowner` from (`TaxonTagDescriptions` `c` join `TaxonTags` `g` on((`g`.`tag_id` = `c`.`_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-24  9:21:24
