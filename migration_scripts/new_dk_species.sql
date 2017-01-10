SELECT ta.FullName, MIN(o.observationDate) as found_date, l.name as locality, u.name as reported_by FROM Observation o, Determination d, Taxon t, Taxon ta,  Users u, Locality l WHERE o.locality_id=l._id AND o.primaryuser_id=u._id AND o.primarydetermination_id = d._id AND d.taxon_id=t._id AND o.locality_id IS NOT NULL AND t.accepted_id=ta._id AND d.validation="Godkendt" AND ta.RankID = 10000 GROUP BY ta._id HAVING MIN(o.observationDate) > '2015-12-31' ORDER BY ta.FullName ASC;