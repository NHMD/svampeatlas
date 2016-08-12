SELECT u._id, u.Initialer, u.name, count(distinct ta._id) as antal_godkendte_arter FROM Users u, Determination d, Taxon t, Taxon ta WHERE d.user_id=u._id AND d.taxon_id=t._id AND t.accepted_id = ta._id AND d.validation = "Godkendt" GROUP BY u._id ORDER BY antal_godkendte_arter DESC;


SELECT u._id, u.Initialer, u.name, count(distinct o._id) as antal_godkendte_observationer FROM Users u, Determination d, Observation o WHERE o.primaryuser_id=u._id AND o.primarydetermination_id = d._id AND  d.validation = "Godkendt" GROUP BY u._id ORDER BY antal_godkendte_observationer DESC;

SELECT u._id, u.Initialer, u.name, count(distinct o._id) as antal_afviste_observationer FROM Users u, Determination d, Observation o WHERE o.primaryuser_id=u._id AND o.primarydetermination_id = d._id AND  d.user_id=u._id AND d.validation = "Afvist" GROUP BY u._id ORDER BY antal_afviste_observationer DESC;