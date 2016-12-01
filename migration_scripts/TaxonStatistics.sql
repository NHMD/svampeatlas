
CREATE TABLE TaxonStatistics (
taxon_id INT(11) NOT NULL PRIMARY KEY,
createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt datetime DEFAULT NULL,
accepted_count INT(11) DEFAULT 0,
total_count INT(11) DEFAULT 0,
accepted_count_before_atlas INT(11) DEFAULT 0,
accepted_count_during_atlas INT(11) DEFAULT 0,
accepted_count_after_atlas INT(11) DEFAULT 0,
last_accepted_record datetime DEFAULT NULL,
first_accepted_record datetime DEFAULT NULL
) ENGINE = InnoDB;

ALTER TABLE TaxonStatistics ADD FOREIGN KEY `taxon_id` (`taxon_id`) references Taxon(_id);


-- queries
-- total  
  INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, total_count) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt, COUNT(*) as total FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id AND o.locality_id IS NOT NULL GROUP BY ta._id) a
  ON DUPLICATE KEY UPDATE updatedAt=NOW(), total_count=a.total;

-- accepted total
  INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, accepted_count) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt, COUNT(*) as total FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id  AND d.validation= "Godkendt" AND o.locality_id IS NOT NULL GROUP BY ta._id) a
  ON DUPLICATE KEY UPDATE updatedAt=NOW(), accepted_count=a.total;

-- før atlas 
  INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, accepted_count_before_atlas) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt, COUNT(*) as total FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id AND d.validation= "Godkendt" AND o.observationDate < '2009-03-01' AND o.locality_id IS NOT NULL GROUP BY ta._id) a
  ON DUPLICATE KEY UPDATE updatedAt=NOW(), accepted_count_before_atlas=a.total;
  
-- under atlas 
  INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, accepted_count_during_atlas) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt, COUNT(*) as total FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id AND d.validation= "Godkendt" AND o.observationDate > '2009-03-01' AND o.observationDate < '2014-01-01' AND o.locality_id IS NOT NULL GROUP BY ta._id) a
  ON DUPLICATE KEY UPDATE updatedAt=NOW(), accepted_count_during_atlas=a.total;
  
-- efter atlas 
  INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, accepted_count_after_atlas) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt, COUNT(*) as total FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id AND d.validation= "Godkendt" AND o.observationDate > '2013-12-31' AND o.locality_id IS NOT NULL GROUP BY ta._id) a
  ON DUPLICATE KEY UPDATE updatedAt=NOW(), accepted_count_after_atlas=a.total;
  
-- første fund
  INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, 	first_accepted_record) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt,  MIN(o.observationDate) AS mindate FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id AND d.validation= "Godkendt" AND o.locality_id IS NOT NULL GROUP BY ta._id) a
  ON DUPLICATE KEY UPDATE updatedAt=NOW(), 	first_accepted_record=a.mindate;
  
  
 -- seneste fund
   INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, 	last_accepted_record) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt,  MAX(o.observationDate) AS maxdate FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id AND d.validation= "Godkendt" AND o.locality_id IS NOT NULL GROUP BY ta._id) a
   ON DUPLICATE KEY UPDATE updatedAt=NOW(), 	last_accepted_record=a.maxdate;
 


