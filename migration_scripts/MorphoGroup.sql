
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


UPDATE Taxon set morphogroup_id= NULL;
DELETE FROM UserMorphoGroupImpact;
DELETE FROM MorphoGroup;
ALTER TABLE MorphoGroup AUTO_INCREMENT = 1;

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
WHERE d.user_id=u._id AND d.taxon_id=t._id AND ta._id=t.accepted_id AND ta.morphogroup_id = a.morphogroup_id AND (d.validation="Godkendt" OR d.score > 80) GROUP BY u._id, a.morphogroup_id;


DELETE FROM UserMorphoGroupImpact;

-- detect unmapped DK taxa
select t._id, t.parent_id, p.RankName as parentrank, p.FullName as parentname, t.FullName as name,t.RankName as rank from Taxon t, Taxon p, TaxonAttributes ta where t._id= ta.taxon_id AND  ta.PresentInDK = 1 AND t.parent_id=p._id AND t.RankID > 9950 AND t.morphogroup_id IS NULL GROUP BY p._id ORDER BY p.FullName
