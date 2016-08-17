-- Husk indekser på vegetationstype og substrat samt associated organism!!!

UPDATE Observation SET observationDate = DATE_ADD(observationDate, INTERVAL 1 DAY) WHERE observationDate LIKE "%22:00:00" ;
ALTER TABLE `Observation` CHANGE `observationDate` `observationDate` DATE;

ALTER table Observation ADD COLUMN os VARCHAR(64), ADD COLUMN browser VARCHAR(64);