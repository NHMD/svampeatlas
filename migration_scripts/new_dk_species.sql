SELECT ta.FullName, MIN(o.observationDate) as found_date, l.name as locality, u.name as reported_by FROM Observation o, Determination d, Taxon t, Taxon ta,  Users u, Locality l WHERE o.locality_id=l._id AND o.primaryuser_id=u._id AND o.primarydetermination_id = d._id AND d.taxon_id=t._id AND o.locality_id IS NOT NULL AND t.accepted_id=ta._id AND d.validation="Godkendt" AND ta.RankID = 10000 AND NOT EXISTS (
	SELECT o1._id FROM Observation o1, Determination d1, Taxon t1, Taxon ta1 WHERE  o1.primarydetermination_id = d1._id AND d1.taxon_id=t1._id AND t1.accepted_id=ta1._id AND ta1.RankID > 10000 AND ta1.Path LIKE CONCAT(ta.Path, "%") GROUP BY ta1._id HAVING MIN(o1.observationDate) < '2016-01-01'
)

GROUP BY ta._id HAVING MIN(o.observationDate) > '2015-12-31' ORDER BY ta.FullName ASC;

-- Query som anvender statistik viewet til at sikre at der ikke eksisterer tidligere fund af varieteter- bør så joines med ovenstående for at få fund data med.

SELECT ts.first_accepted_record, t.FullName FROM Taxon t, TaxonStatistics ts WHERE t._id=ts.taxon_id AND ts.first_accepted_record > '2015-12-31' AND t.RankID = 10000 AND NOT EXISTS (SELECT tc._id FROM Taxon tc, TaxonStatistics tsc WHERE  tc._id=tsc.taxon_id AND tc.Path LIKE CONCAT(t.Path, "%") AND tc.RankID > 10000 AND tsc.first_accepted_record < '2016-01-01') ORDER BY t.FullName ASC;




