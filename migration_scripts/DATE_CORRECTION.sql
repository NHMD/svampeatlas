-- Husk indekser på vegetationstype og substrat samt associated organism!!!

UPDATE Observation SET observationDate = DATE_ADD(observationDate, INTERVAL 1 DAY) WHERE observationDate LIKE "%22:00:00" ;
ALTER TABLE `Observation` CHANGE `observationDate` `observationDate` DATE;