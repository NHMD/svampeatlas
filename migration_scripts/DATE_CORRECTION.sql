-- Husk indekser på vegetationstype og substrat samt associated organism!!!

UPDATE Observation SET observationDate = DATE_ADD(observationDate, INTERVAL 1 DAY) where TIME(observationDate) = '22:00:00';

ALTER TABLE `Observation` CHANGE `observationDate` `observationDate` DATE;

ALTER table Observation ADD COLUMN os VARCHAR(64), ADD COLUMN browser VARCHAR(64);

SELECT * from TaxonRedListStatus where `year` = 2009 AND status IS NULL  and verbatimStatus <> "" AND verbatimStatus is not null;

UPDATE TaxonRedListData SET status="EN" where `year` = 2009 AND status IS NULL  and verbatimStatus = "EN";
UPDATE TaxonRedListData SET status="CR" where `year` = 2009 AND status IS NULL  and verbatimStatus = "CR";
UPDATE TaxonRedListData SET status="VU" where `year` = 2009 AND status IS NULL  and verbatimStatus = "VU";
UPDATE TaxonRedListData SET status="NT" where `year` = 2009 AND status IS NULL  and verbatimStatus LIKE "NT%";