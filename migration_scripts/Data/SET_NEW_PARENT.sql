delimiter //

CREATE PROCEDURE SET_NEW_PARENT( c_id INT,op_id INT,np_id INT)
BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING ROLLBACK;
START TRANSACTION;


UPDATE Taxon set parent_id = np_id WHERE _id=c_id;

UPDATE (SELECT _id FROM Taxon where Path LIKE CONCAT((SELECT Path from Taxon where _id=c_id), "%")) t1, Taxon t, Taxon np, Taxon op SET
t.Path = CONCAT( np.Path, SUBSTRING_INDEX(t.Path, op.Path, -1)),
t.SystematicPath = CONCAT( np.SystematicPath, SUBSTRING_INDEX(t.SystematicPath, op.SystematicPath, -1)),
t.updatedAt = NOW()
where np._id=np_id AND op._id=op_id AND t._id = t1._id ;

COMMIT;

END 
//
delimiter ;