
	 SELECT p._id, z._id, 
           p.distance_unit
                    * DEGREES(ACOS(COS(RADIANS(p.latpoint))
                    * COS(RADIANS(z.decimalLatitude))
                    * COS(RADIANS(p.longpoint) - RADIANS(z.decimalLongitude))
                    + SIN(RADIANS(p.latpoint))
                    * SIN(RADIANS(z.decimalLatitude)))) AS distance_in_km
     FROM (SELECT o._id, o.decimalLatitude, o.decimalLongitude FROM Observation o JOIN Determination d JOIN Taxon t ON o.primarydetermination_id=d._id AND d.taxon_id= t._id AND t.accepted_id= 12621 AND (d.validation="Godkendt" OR d.score > 99)) AS z
     JOIN (   
           SELECT  _id,  decimalLatitude  AS latpoint,  decimalLongitude AS longpoint,
                   3 AS radius,      111.045 AS distance_unit FROM Observation WHERE (decimalLatitude <> 0 AND decimalLongitude <> 0)  AND _id =9170235
       ) AS p 
     WHERE z.decimalLatitude
        BETWEEN p.latpoint  - (p.radius / p.distance_unit)
            AND p.latpoint  + (p.radius / p.distance_unit)
       AND z.decimalLongitude
        BETWEEN p.longpoint - (p.radius / (p.distance_unit * COS(RADIANS(p.latpoint))))
            AND p.longpoint + (p.radius / (p.distance_unit * COS(RADIANS(p.latpoint))))
     GROUP BY p._id, distance_in_km ORDER BY distance_in_km ASC
     LIMIT 1;
	 
	 
	 
	 SELECT COUNT(*), MONTH(observationDate)  FROM Observation o JOIN Determination d JOIN Taxon t ON o.primarydetermination_id=d._id AND d.taxon_id= t._id AND t.accepted_id= 10252 AND (d.validation="Godkendt" OR d.score > 99) AND MONTH(observationDate) >0 GROUP BY MONTH(observationDate);
	 
	 


	 select AVG(a.count) FROM (SELECT COUNT(*) as count, MONTH(observationDate)  
	 FROM Observation o JOIN Determination d JOIN Taxon t ON o.primarydetermination_id=d._id AND d.taxon_id= t._id 
	 AND t.accepted_id= 10252 AND (d.validation="Godkendt" OR d.score > 99) AND MONTH(observationDate) >0 GROUP BY MONTH(observationDate)) a;
	 
	 
	 65783
	 
	 
	 SELECT COUNT(*), MONTH(observationDate)  FROM Observation o JOIN Determination d JOIN Taxon t ON o.primarydetermination_id=d._id AND d.taxon_id= t._id AND t.accepted_id= 65783 AND (d.validation="Godkendt" OR d.score > 99) AND MONTH(observationDate) >0 GROUP BY MONTH(observationDate);
	 
	 select AVG(a.count) FROM (SELECT COUNT(*) as count, MONTH(observationDate)  
	 FROM Observation o JOIN Determination d JOIN Taxon t ON o.primarydetermination_id=d._id AND d.taxon_id= t._id 
	 AND t.accepted_id= 65783 AND (d.validation="Godkendt" OR d.score > 99) AND MONTH(observationDate) >0 GROUP BY MONTH(observationDate)) a;
	 
	 
	 14062
	 
	 
	 SELECT COUNT(*), MONTH(observationDate)  FROM Observation o JOIN Determination d JOIN Taxon t ON o.primarydetermination_id=d._id AND d.taxon_id= t._id AND t.accepted_id= 14062 AND (d.validation="Godkendt" OR d.score > 99) AND MONTH(observationDate) >0 GROUP BY MONTH(observationDate);
	 
	 select AVG(a.count) FROM (SELECT COUNT(*) as count, MONTH(observationDate)  
	 FROM Observation o JOIN Determination d JOIN Taxon t ON o.primarydetermination_id=d._id AND d.taxon_id= t._id 
	 AND t.accepted_id= 14062 AND (d.validation="Godkendt" OR d.score > 99) AND MONTH(observationDate) >0 GROUP BY MONTH(observationDate)) a;
	 
	 
	 12681
	 SELECT COUNT(*), MONTH(observationDate)  FROM Observation o JOIN Determination d JOIN Taxon t ON o.primarydetermination_id=d._id AND d.taxon_id= t._id AND t.accepted_id= 12681 AND (d.validation="Godkendt" OR d.score > 99) AND MONTH(observationDate) >0 GROUP BY MONTH(observationDate);
	 
	 select AVG(a.count) FROM (SELECT COUNT(*) as count, MONTH(observationDate)  
	 FROM Observation o JOIN Determination d JOIN Taxon t ON o.primarydetermination_id=d._id AND d.taxon_id= t._id 
	 AND t.accepted_id= 12681 AND (d.validation="Godkendt" OR d.score > 99) AND MONTH(observationDate) >0 GROUP BY MONTH(observationDate)) a;
	 
	 
	 
	 
	 17041
	 
	 SELECT COUNT(*), MONTH(observationDate)  FROM Observation o JOIN Determination d JOIN Taxon t ON o.primarydetermination_id=d._id AND d.taxon_id= t._id AND t.accepted_id= 17041 AND (d.validation="Godkendt" OR d.score > 99) AND MONTH(observationDate) >0 GROUP BY MONTH(observationDate);
	 
	 select AVG(a.count) FROM (SELECT COUNT(*) as count, MONTH(observationDate)  
	 FROM Observation o JOIN Determination d JOIN Taxon t ON o.primarydetermination_id=d._id AND d.taxon_id= t._id 
	 AND t.accepted_id= 17041 AND (d.validation="Godkendt" OR d.score > 99) AND MONTH(observationDate) >0 GROUP BY MONTH(observationDate)) a;
	 
	 ------------
	 SELECT COUNT(*) as count, MONTH(o.observationDate) FROM (Observation o JOIN Determination d JOIN Taxon t 
	 	ON o.primarydetermination_id=d._id AND d.taxon_id= t._id AND t.accepted_id= 10000 AND (d.validation="Godkendt" OR d.score > 99) ) LEFT JOIN Observation o2 ON MONTH(o.observationDate) = MONTH(o2.observationDate) AND o2._id = 9170283 GROUP BY MONTH(o.observationDate);
	 