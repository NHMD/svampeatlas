CREATE TABLE IF NOT EXISTS `DeterminationLog` (
`_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `logObject` JSON,
  `observation_id` int(11) NOT NULL,
  `determination_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `eventType` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Begrænsninger for dumpede tabeller
--

--
-- Indeks for tabel `DeterminationLog`
--
ALTER TABLE `DeterminationLog`
 ADD PRIMARY KEY (`_id`), ADD KEY `DeterminationLog_ibfk_2` (`user_id`), ADD KEY `DeterminationLog_ibfk_3` (`determination_id`), ADD KEY `DeterminationLog_ibfk_4` (`createdAt`);

--
-- Brug ikke AUTO_INCREMENT for slettede tabeller
--

--
-- Tilføj AUTO_INCREMENT i tabel `DeterminationLog`
--
ALTER TABLE `DeterminationLog`
MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Begrænsninger for dumpede tabeller
--

--
-- Begrænsninger for tabel `DeterminationLog`
--
ALTER TABLE `DeterminationLog`
ADD CONSTRAINT `DeterminationLog_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`);


CREATE TABLE DeterminationVotes (
_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt datetime DEFAULT NULL,
user_id INT(11) NOT NULL,
determination_id INT(11) NOT NULL,
observation_id INT(11) NOT NULL,
score INT(11) NOT NULL DEFAULT 1,
FOREIGN KEY (user_id) REFERENCES Users(_id),
FOREIGN KEY (determination_id) REFERENCES Determination(_id),
FOREIGN KEY (observation_id) REFERENCES Observation(_id),
UNIQUE (user_id, determination_id)
 
) ENGINE = InnoDB;

INSERT INTO `svampeatlas`.`Role` (`_id`, `createdAt`, `updatedAt`, `name`) VALUES (NULL, CURRENT_TIMESTAMP, NULL, 'downvotedetermination');
ALTER TABLE `Determination` ADD INDEX `score` (`score`);


CREATE TABLE IF NOT EXISTS `MorphoGroup` (
`_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `name_dk` varchar(520) DEFAULT NULL,
  `name_uk` varchar(520) DEFAULT NULL,
  `image` varchar(520) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdbyuser_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `MorphoGroup`
 ADD PRIMARY KEY (`_id`);


ALTER TABLE `MorphoGroup`
MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE IF NOT EXISTS `UserMorphoGroupImpact` (
`_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `updatedByUser` int(11) DEFAULT NULL,
  `morphogroup_id` int(11) NOT NULL,
  `impact` int(5) DEFAULT '1',
  `min_impact` int(5) DEFAULT '1',
  `max_impact` int(5) DEFAULT '100',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=944 DEFAULT CHARSET=utf8;

ALTER TABLE `UserMorphoGroupImpact`
 ADD PRIMARY KEY (`_id`), ADD UNIQUE KEY `user_id` (`user_id`,`morphogroup_id`), ADD KEY `morphogroup_id` (`morphogroup_id`);

 ALTER TABLE `UserMorphoGroupImpact`
 MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT

 ALTER TABLE `UserMorphoGroupImpact`
 ADD CONSTRAINT `usermorphogroupimpact_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`_id`),
 ADD CONSTRAINT `usermorphogroupimpact_ibfk_2` FOREIGN KEY (`morphogroup_id`) REFERENCES `MorphoGroup` (`_id`);




ALTER TABLE Taxon ADD COLUMN morphogroup_id INT(11) default NULL;
ALTER TABLE Taxon ADD CONSTRAINT fk_morphogroup_id FOREIGN KEY (morphogroup_id) REFERENCES MorphoGroup(_id);

INSERT INTO MorphoGroup (name_dk, createdbyuser_id) SELECT DISTINCT gruppe, 60 FROM kompetencegrupper;

UPDATE kompetencegrupper k, MorphoGroup m SET k.gruppe_id=m._id WHERE k.gruppe = m.name_dk;
-- UPDATE Taxon t, kompetencegrupper k SET t.morphogroup_id = k.gruppe_id WHERE t.FullName LIKE CONCAT( k.genus, "%") AND t.RankID > 4999;


UPDATE Taxon t, Taxon t1, kompetencegrupper k SET t.morphogroup_id = k.gruppe_id WHERE t1.FullName = k.genus AND t.Path LIKE CONCAT(t1.Path, "%");

-- User impact
INSERT INTO UserMorphoGroupImpact (user_id, morphogroup_id, impact) 
SELECT u._id, a.morphogroup_id, CEIL((COUNT(distinct ta._id)/ a.totalCount * 100))
FROM
Determination d,Taxon t, Taxon ta, Users u, 
(SELECT morphogroup_id, COUNT(_id) as totalCount FROM Taxon t, TaxonAttributes ta WHERE ta.taxon_id=t._id AND t.accepted_id=t._id AND ta.PresentInDK = 1 AND t.morphogroup_id IS NOT NULL GROUP BY morphogroup_id) a
WHERE d.user_id=u._id AND d.taxon_id=t._id AND ta._id=t.accepted_id AND ta.morphogroup_id = a.morphogroup_id AND (d.validation="Godkendt" OR d.score >= 80) GROUP BY u._id, a.morphogroup_id;


DELETE FROM UserMorphoGroupImpact;

-- detect unmapped DK taxa
select t._id, t.parent_id, p.RankName as parentrank, p.FullName as parentname, t.FullName as name,t.RankName as rank from Taxon t, Taxon p, TaxonAttributes ta where t._id= ta.taxon_id AND  ta.PresentInDK = 1 AND t.parent_id=p._id AND t.RankID > 9950 AND t.morphogroup_id IS NULL GROUP BY p._id ORDER BY p.FullName

DROP EVENT `stats_daily`;

DELIMITER $$
--
-- Hændelser
--
CREATE EVENT `stats_daily` ON SCHEDULE EVERY 1 DAY STARTS '2017-03-10 04:00:00' DO BEGIN
	 DELETE FROM TaxonStatistics;
	 INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, total_count) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt, COUNT(*) as total FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id AND o.locality_id IS NOT NULL GROUP BY ta._id) a
     ON DUPLICATE KEY UPDATE updatedAt=NOW(), total_count=a.total;
     INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, accepted_count) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt, COUNT(*) as total FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id  AND (d.validation= "Godkendt" OR d.score >= 80) AND o.locality_id IS NOT NULL GROUP BY ta._id) a
     ON DUPLICATE KEY UPDATE updatedAt=NOW(), accepted_count=a.total;
     INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, accepted_count_before_atlas) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt, COUNT(*) as total FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id AND (d.validation= "Godkendt" OR d.score >= 80) AND o.observationDate < '2009-03-01' AND o.locality_id IS NOT NULL GROUP BY ta._id) a
     ON DUPLICATE KEY UPDATE updatedAt=NOW(), accepted_count_before_atlas=a.total;
     INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, accepted_count_during_atlas) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt, COUNT(*) as total FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id AND (d.validation= "Godkendt" OR d.score >= 80) AND o.observationDate > '2009-03-01' AND o.observationDate < '2014-01-01' AND o.locality_id IS NOT NULL GROUP BY ta._id) a
     ON DUPLICATE KEY UPDATE updatedAt=NOW(), accepted_count_during_atlas=a.total;
     INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, accepted_count_after_atlas) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt, COUNT(*) as total FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id AND (d.validation= "Godkendt" OR d.score >= 80) AND o.observationDate > '2013-12-31' AND o.locality_id IS NOT NULL GROUP BY ta._id) a
     ON DUPLICATE KEY UPDATE updatedAt=NOW(), accepted_count_after_atlas=a.total;
     INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, first_accepted_record) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt,  MIN(o.observationDate) AS mindate FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id AND (d.validation= "Godkendt" OR d.score >= 80) AND o.locality_id IS NOT NULL GROUP BY ta._id) a
     ON DUPLICATE KEY UPDATE updatedAt=NOW(), first_accepted_record=a.mindate;
     INSERT INTO TaxonStatistics (taxon_id, createdAt, updatedAt, last_accepted_record) SELECT * FROM (SELECT ta._id, NOW() as createdAt, NOW() as updatedAt,  MAX(o.observationDate) AS maxdate FROM Observation o, Determination d, Taxon t, Taxon ta WHERE o.primarydetermination_id = d._id AND d.taxon_id = t._id AND t.accepted_id=ta._id AND (d.validation= "Godkendt" OR d.score >= 80) AND o.locality_id IS NOT NULL GROUP BY ta._id) a
     ON DUPLICATE KEY UPDATE updatedAt=NOW(), last_accepted_record=a.maxdate;


         END$$

DELIMITER ;

DELIMITER $$
--
-- Hændelser
--
CREATE EVENT `user_impact` ON SCHEDULE EVERY 1 DAY STARTS '2017-03-10 03:30:00' DO BEGIN
DELETE FROM UserMorphoGroupImpact;
INSERT INTO UserMorphoGroupImpact (user_id, morphogroup_id, impact) 
SELECT u._id, a.morphogroup_id, CEIL((COUNT(distinct ta._id)/ a.totalCount * 100))
FROM
Determination d,Taxon t, Taxon ta, Users u, 
(SELECT morphogroup_id, COUNT(_id) as totalCount FROM Taxon t, TaxonAttributes ta WHERE ta.taxon_id=t._id AND t.accepted_id=t._id AND ta.PresentInDK = 1 AND t.morphogroup_id IS NOT NULL GROUP BY morphogroup_id) a
WHERE d.user_id=u._id AND d.taxon_id=t._id AND ta._id=t.accepted_id AND ta.morphogroup_id = a.morphogroup_id AND (d.validation="Godkendt" OR d.score > 80) GROUP BY u._id, a.morphogroup_id;
	 

         END$$

DELIMITER ;


