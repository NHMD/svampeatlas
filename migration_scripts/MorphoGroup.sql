CREATE TABLE MorphoGroup (
_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt datetime DEFAULT NULL,
name_dk VARCHAR(520),
name_uk VARCHAR(520),
image VARCHAR(520)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;



CREATE TABLE UserMorphoGroupImpact (
user_id INT(11) NOT NULL ,
morphogroup_id INT(11) NOT NULL ,
impact INT(5) DEFAULT 1,
base_impact INT(5) DEFAULT 1,
PRIMARY KEY (user_id, morphogroup_id),
FOREIGN KEY (user_id) REFERENCES Users(_id),
FOREIGN KEY (morphogroup_id) REFERENCES MorphoGroup(_id)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;



CREATE TABLE IF NOT EXISTS `UserMorphoGroupImpact` (
  `user_id` int(11) NOT NULL,
  `updatedByUser` int(11) DEFAULT NULL,
  `morphogroup_id` int(11) NOT NULL,
  `impact` int(5) DEFAULT '1',
  `min_impact` int(5) DEFAULT '1',
  `max_impact` int(5) DEFAULT '100',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (user_id, morphogroup_id),
  FOREIGN KEY (user_id) REFERENCES Users(_id),
  FOREIGN KEY (updatedByUser) REFERENCES Users(_id),
  FOREIGN KEY (morphogroup_id) REFERENCES MorphoGroup(_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;





ALTER TABLE Taxon ADD COLUMN morphogroup_id INT(11);
ALTER TABLE Taxon ADD CONSTRAINT fk_morphogroup_id FOREIGN KEY (morphogroup_id) REFERENCES MorphoGroup(_id);

-- testdata Cortinarius 
UPDATE Taxon t, Taxon t1 set t.morphogroup_id=1 WHERE t1._id=50471 AND t.Path LIKE CONCAT(t1.Path, "%");

-- testdata Lactarius s.lato
UPDATE Taxon t, Taxon t1 set t.morphogroup_id=2 WHERE t1._id=62369 AND t.Path LIKE CONCAT(t1.Path, "%");

UPDATE Taxon t, Taxon t1 set t.morphogroup_id=2 WHERE t1._id=66617 AND t.Path LIKE CONCAT(t1.Path, "%");


-- testdata Russula
UPDATE Taxon t, Taxon t1 set t.morphogroup_id=3 WHERE t1._id=51729 AND t.Path LIKE CONCAT(t1.Path, "%");

-- testdata boletaceae 60065 og suillaceae 60556

UPDATE Taxon t, Taxon t1 set t.morphogroup_id=4 WHERE t1._id=60065 AND t.Path LIKE CONCAT(t1.Path, "%");
UPDATE Taxon t, Taxon t1 set t.morphogroup_id=4 WHERE t1._id=60556 AND t.Path LIKE CONCAT(t1.Path, "%");

-- User impact
INSERT INTO UserMorphoGroupImpact (user_id, morphogroup_id, impact) 
SELECT u._id, a.morphogroup_id, CEIL((COUNT(distinct ta._id)/ a.totalCount * 100))
FROM
Determination d,Taxon t, Taxon ta, Users u, 
(SELECT morphogroup_id, COUNT(_id) as totalCount FROM Taxon t, TaxonAttributes ta WHERE ta.taxon_id=t._id AND t.accepted_id=t._id AND ta.PresentInDK = 1 AND t.morphogroup_id IS NOT NULL GROUP BY morphogroup_id) a
WHERE d.user_id=u._id AND d.taxon_id=t._id AND ta._id=t.accepted_id AND ta.morphogroup_id = a.morphogroup_id AND d.validation="Godkendt" GROUP BY u._id, a.morphogroup_id;


DELETE FROM UserMorphoGroupImpact;