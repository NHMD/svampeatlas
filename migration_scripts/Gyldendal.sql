-- All danish species of Basidiomycota (incl. superspecies rank > 9900 and varieties)
SELECT t._id, t.FullName, dkn.vernacularname_dk, GROUP_CONCAT(t2.FullName ORDER BY t2.RankID ASC SEPARATOR ", ") as Classification, t.RankName FROM Taxon t JOIN Taxon t2 JOIN TaxonAttributes ta ON t._id=ta.taxon_id AND ta.PresentInDK = 1 AND t._id = t.accepted_id AND t.RankID > 9900 AND t.Path LIKE "66576, 60212, 60059%" AND t.Path LIKE CONCAT(t2.Path, '%') LEFT JOIN TaxonDKnames dkn ON t.vernacularname_dk_id=dkn._id  GROUP BY t._id;



-- All  genera of Basidiomycota having descendants at sp. var. forms where PresentInDK = true(incl. superspecies rank > 9900 and varieties)
SELECT t._id, t.FullName, dkn.vernacularname_dk, GROUP_CONCAT(DISTINCT c.Name SEPARATOR ", ") as FruitBodyType, GROUP_CONCAT(DISTINCT t3.FullName ORDER BY t3.RankID ASC SEPARATOR ", ") as Classification,t.RankName, COUNT( distinct tc._id) as species_count FROM
 ((Taxon t LEFT JOIN TaxonDKnames dkn ON t.vernacularname_dk_id=dkn._id) JOIN TaxonAttributes ta ON t._id=ta.taxon_id)
 LEFT JOIN (SELECT _id, parent_id from Taxon t2, TaxonAttributes t2a WHERE t2._id=t2a.taxon_id AND t2a.PresentInDK = true) tc ON t._id=tc.parent_id JOIN Taxon t3 ON t.Path LIKE CONCAT(t3.Path, '%')
  LEFT JOIN (GenusCharacters gc JOIN Characters c ON gc.Character = c.CharacterID AND c.CharacterGroup= 11 ) ON t._id=gc.taxon_id
   WHERE t.Path LIKE "66576, 60212, 60059%" AND t.RankID = 5000 AND (ta.PresentInDK = 1 OR tc._id IS NOT NULL) GROUP BY t._id ORDER BY t.FullName;
 
 
 
 
 
 
 LEFT JOIN (GenusCharacters gc JOIN Characters c ON gc.Character = c.CharacterID AND c.CharacterGroup= 11 ) ON t._id=gc.taxon_id