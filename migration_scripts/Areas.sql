DROP TABLE Areas;
CREATE TABLE Areas (
_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
user_id INT(11) DEFAULT NULL,
createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt datetime DEFAULT NULL,
verbatim_id VARCHAR(255) DEFAULT NULL,
name VARCHAR(255) NOT NULL,
type VARCHAR(255) NOT NULL,
geom GEOMETRY NOT NULL
) ENGINE = InnoDB;

ALTER TABLE Areas ADD SPATIAL KEY (geom);

CREATE TABLE ObservationAreas (
	_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	observation_id INT(11) NOT NULL,
	area_id INT(11) NOT NULL,
	createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

ALTER TABLE `ObservationAreas`
ADD CONSTRAINT `observationarea_unq_1` UNIQUE (area_id, observation_id),
ADD CONSTRAINT `observationarea_ibfk_1` FOREIGN KEY (area_id) REFERENCES `Areas` (_id),
ADD CONSTRAINT `observationarea_ibfk_2` FOREIGN KEY (observation_id) REFERENCES `Observation` (_id);





-- triggers for setting areas on new and updated observations

DELIMITER //
DROP PROCEDURE IF EXISTS observation_to_area_mapping//

CREATE PROCEDURE observation_to_area_mapping(IN table_row_id INT(11))
READS SQL DATA
BEGIN

DELETE FROM ObservationAreas WHERE observation_id = table_row_id;

INSERT INTO ObservationAreas (observation_id, area_id) SELECT table_row_id, a._id FROM Areas a  WHERE ST_Contains(a.geom, (SELECT geom from Observation WHERE _id=table_row_id));

END//
DELIMITER ;



DELIMITER //
DROP TRIGGER IF EXISTS observation_insert_trigger//
CREATE  TRIGGER observation_insert_trigger
    AFTER INSERT ON `Observation`
    FOR EACH ROW

BEGIN
    CALL observation_to_area_mapping(NEW._id);
END//
DELIMITER ;

DELIMITER //
DROP TRIGGER IF EXISTS observation_update_trigger//
CREATE  TRIGGER observation_update_trigger
    AFTER UPDATE ON `Observation`
    FOR EACH ROW
BEGIN
	CALL observation_to_area_mapping(NEW._id);
END//
DELIMITER ;


-- triggers for  mapping observations to new areas inserted

DELIMITER //
DROP PROCEDURE IF EXISTS area_to_observation_mapping//

CREATE PROCEDURE area_to_observation_mapping(IN table_row_id INT(11))
READS SQL DATA
BEGIN

DELETE FROM ObservationAreas WHERE area_id = table_row_id;
SELECT geom 
INTO @geom 
FROM Areas 
WHERE _id= table_row_id;
INSERT INTO ObservationAreas (observation_id, area_id) SELECT o._id, table_row_id FROM Observation o WHERE ST_Contains(@geom , o.geom);

END//
DELIMITER ;


DELIMITER //
DROP TRIGGER IF EXISTS area_insert_trigger//
CREATE  TRIGGER area_insert_trigger
    AFTER INSERT ON `Areas`
    FOR EACH ROW

BEGIN
    CALL area_to_observation_mapping(NEW._id);
END//
DELIMITER ;

DELIMITER //
DROP TRIGGER IF EXISTS area_update_trigger//
CREATE  TRIGGER area_update_trigger
    AFTER UPDATE ON `Areas`
    FOR EACH ROW

BEGIN
    CALL area_to_observation_mapping(NEW._id);
END//
DELIMITER ;





-- Procedure to map all observations to all areas

DELIMITER //
CREATE PROCEDURE map_all_observations_to_areas()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE x GEOMETRY;
  DECLARE b INT;
  DECLARE cur1 CURSOR FOR SELECT geom, _id FROM Areas;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur1;

  read_loop: LOOP
    FETCH cur1 INTO x, b;
    IF done THEN
      LEAVE read_loop;
    END IF;
    DELETE FROM ObservationAreas where area_id = b;
	INSERT INTO ObservationAreas (observation_id, area_id) SELECT o._id, b FROM Observation o  WHERE ST_Contains(x, o.geom);
  END LOOP;

  CLOSE cur1;
END//
DELIMITER ;


DELIMITER $$
--
-- Hændelser
--
CREATE EVENT `observation_to_area_mapping` ON SCHEDULE AT '2017-03-22 00:45:00' DO BEGIN
CALL map_all_observations_to_areas();
END$$

DELIMITER ;







CREATE TABLE AreaStatistics (
area_id INT(11) NOT NULL PRIMARY KEY,
createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
num_users INT(11) DEFAULT NULL,
num_obs INT(11) DEFAULT NULL,
num_days INT(11) DEFAULT NULL,
num_years INT(11) DEFAULT NULL,
num_species INT(11) DEFAULT NULL

) ENGINE = InnoDB;



DROP EVENT area_stats_daily;
delimiter |

CREATE EVENT area_stats_daily
    ON SCHEDULE
      EVERY 1 DAY
	  STARTS '2017-03-31 04:15:00'
    COMMENT 'Updates statistics'
    DO
      BEGIN
	  TRUNCATE AreaStatistics;
	  CALL updateAreaStistics();  
	  END |

delimiter ;  





DELIMITER //
DROP PROCEDURE IF EXISTS updateAreaStistics//

CREATE PROCEDURE updateAreaStistics()
READS SQL DATA
BEGIN
TRUNCATE AreaStatistics;
INSERT INTO AreaStatistics (area_id, num_species) SELECT a._id, COUNT(distinct ta._id) as count FROM Observation o, Determination d, Taxon t, Taxon ta, Areas a, ObservationAreas oa  WHERE  o._id = oa.observation_id AND a._id= oa.area_id AND o.primarydetermination_id = d._id AND d.taxon_id=t._id AND t.accepted_id=ta._id AND ta.RankID > 9950 AND (d.validation = 'Godkendt' OR d.score > 79) GROUP BY a._id ;  
INSERT INTO AreaStatistics (area_id, num_users) SELECT * FROM (SELECT a._id, COUNT(distinct o.primaryuser_id) as num_users FROM Observation o, Areas a, ObservationAreas oa WHERE o._id = oa.observation_id AND a._id= oa.area_id GROUP BY a._id) x ON DUPLICATE KEY UPDATE num_users= x.num_users;
INSERT INTO AreaStatistics (area_id, num_obs) SELECT * FROM (SELECT a._id, COUNT(distinct o._id) as num_obs FROM Observation o, Areas a, ObservationAreas oa WHERE o._id = oa.observation_id AND a._id= oa.area_id GROUP BY a._id) x ON DUPLICATE KEY UPDATE num_obs= x.num_obs;
INSERT INTO AreaStatistics (area_id, num_days) SELECT * FROM (SELECT a._id, COUNT(distinct o.observationDate) as num_days FROM Observation o, Areas a, ObservationAreas oa WHERE o._id = oa.observation_id AND a._id= oa.area_id GROUP BY a._id) x ON DUPLICATE KEY UPDATE num_days= x.num_days;
INSERT INTO AreaStatistics (area_id, num_years) SELECT * FROM (SELECT a._id, COUNT(distinct YEAR(o.observationDate)) as num_years FROM Observation o, Areas a, ObservationAreas oa WHERE o._id = oa.observation_id AND a._id= oa.area_id GROUP BY a._id) x ON DUPLICATE KEY UPDATE num_years= x.num_years;    
END//
DELIMITER ;



