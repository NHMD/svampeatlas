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
	observation_id INT(11) NOT NULL,
	area_id INT(11) NOT NULL,
	createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (area_id, observation_id)
) ENGINE = InnoDB;

ALTER TABLE `ObservationAreas`
ADD CONSTRAINT `observationarea_ibfk_1` FOREIGN KEY (area_id) REFERENCES `Areas` (_id),
ADD CONSTRAINT `observationarea_ibfk_2` FOREIGN KEY (observation_id) REFERENCES `Observation` (_id);




SELECT @geom := `geom` from Observation where _id = 9188571;


SELECT a._id FROM Areas a,  WHERE ST_Contains(a.geom, (SELECT geom from Observation WHERE _id=9188571));


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
DROP TRIGGER IF EXISTS area_insert_trigger//
CREATE  TRIGGER area_insert_trigger
    AFTER INSERT ON `Observation`
    FOR EACH ROW

BEGIN
    CALL observation_to_area_mapping(NEW._id);
END//
DELIMITER ;

DELIMITER //
DROP TRIGGER IF EXISTS area_update_trigger//
CREATE  TRIGGER area_update_trigger
    AFTER UPDATE ON `Observation`
    FOR EACH ROW

BEGIN
	if (NEW.decimalLatitude <=> OLD.decimalLatitude OR  NEW.decimalLongitude <=> OLD.decimalLongitude) THEN
    CALL observation_to_area_mapping(NEW._id);
END//
DELIMITER ;




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
CREATE EVENT `observation_to_area_mapping` ON SCHEDULE EVERY 1 DAY STARTS '2017-03-22 03:45:00' DO BEGIN
CALL map_all_observations_to_areas();
END$$

DELIMITER ;

