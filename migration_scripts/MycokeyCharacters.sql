INSERT INTO svampeatlas.Characters SELECT * from mycokey.Characters WHERE CharacterGroup IN (10,11, 39, 42);


CREATE TABLE svampeatlas.CharacterGroup AS SELECT * FROM mycokey.CharacterGroup WHERE CharacterGroupID IN (10,11, 39, 42);

truncate svampeatlas.GenusCharacters;
INSERT INTO svampeatlas.GenusCharacters SELECT g.*, 0 FROM mycokey.GenusCharacters g ;
delete from svampeatlas.GenusCharacters where `Character` NOT IN (select CharacterID from svampeatlas.Characters);

update mycokey.Genus mg, svampeatlas.GenusCharacters sg, svampeatlas.Taxon st SET sg.taxon_id = st._id where mg.Name = st.FullName AND sg.GenusID = mg.ID;
	

	-- two new groups as of 2. may 2016
	
INSERT INTO svampeatlas.Characters SELECT * from mycokey.Characters WHERE CharacterGroup IN (40, 130);
INSERT INTO svampeatlas.CharacterGroup  SELECT * FROM mycokey.CharacterGroup WHERE CharacterGroupID IN (40, 130);

truncate svampeatlas.GenusCharacters;
INSERT INTO svampeatlas.GenusCharacters SELECT g.*, 0 FROM mycokey.GenusCharacters g ;
delete from svampeatlas.GenusCharacters where `Character` NOT IN (select CharacterID from svampeatlas.Characters);

update mycokey.Genus mg, svampeatlas.GenusCharacters sg, svampeatlas.Taxon st SET sg.taxon_id = st._id where mg.Name = st.FullName AND sg.GenusID = mg.ID;
	
	delete from svampeatlas.GenusCharacters where taxon_id = 0;
	
	INSERT INTO GenusCharacters (`Character`, `GenusID`, `xxxx`,`BoolValue`, Probability, mark, CodedForSpecies, `check`, `RealValueMax`, `RealValueMin`, `taxon_id`) 
	SELECT c.`Character`, 0, 0, c.BoolValue, c.Probability, c.mark, c.CodedForSpecies, c.`check`, c.RealValueMax, c.RealValueMin,  t._id  FROM GenusCharacters c, Taxon t, Taxon tp WHERE tp._id = c.taxon_id AND t._id <> c.taxon_id AND t.Path LIKE CONCAT(tp.Path, "%");
	
	INSERT INTO GenusCharacters (`Character`, `GenusID`, `xxxx`,`BoolValue`, Probability, mark, CodedForSpecies, `check`, `RealValueMax`, `RealValueMin`, `taxon_id`) 
	SELECT 380, 0, 2, 0, 100, 0, 0, 0, 0, 0,  t.DkIndexNumber  FROM TaxonBase t WHERE t.Lav = "1" on duplicate key update taxon_id=taxon_id;
	
	
	-- lav parasitter
	INSERT INTO GenusCharacters (`Character`, `GenusID`, `xxxx`,`BoolValue`, Probability, mark, CodedForSpecies, `check`, `RealValueMax`, `RealValueMin`, `taxon_id`) 
	SELECT 382, 0, 3, 0, 100, 0, 0, 0, 0, 0,  t._id  FROM lavparasitter t  on duplicate key update taxon_id=taxon_id;
	
	INSERT INTO GenusCharacters (`Character`, `GenusID`, `xxxx`,`BoolValue`, Probability, mark, CodedForSpecies, `check`, `RealValueMax`, `RealValueMin`, `taxon_id`) 
	SELECT 404, 0, 3, 0, 100, 0, 0, 0, 0, 0,  t._id  FROM lavparasitter t  on duplicate key update taxon_id=taxon_id;
	



	-- Final import may 2017
	
	-- fix wrong value for Bool on existing data
	-- remember to run updates from MycokeyCharacterView.sql
	UPDATE GenusCharacters set BoolValue = 1;
	
	INSERT INTO svampeatlas.CharacterGroup  SELECT * FROM mycokey.CharacterGroup WHERE CharacterGroupID IN (7, 12, 29, 30, 31, 34, 41, 52);
	INSERT INTO svampeatlas.Characters SELECT * from mycokey.Characters WHERE CharacterGroup IN (7, 12, 29, 30, 31, 34, 41, 52);
	
	-- Create a materialized  view with id´s from the accepted taxa in this query
	CREATE table mycokey_temp_species (
		_id INT(11) NOT NULL,
		ID INT(11) NOT NULL,
		PRIMARY KEY (ID, _id)
	) ENGINE= InnoDB;
	
	insert into svampeatlas.mycokey_temp_species
	SELECT txa._id, ms.ID FROM mycokey.Characters mc, mycokey.SpeciesCharacters sc, mycokey.Species ms, svampeatlas.Taxon tx, svampeatlas.Taxon txa WHERE sc.Character = mc.CharacterID AND  mc.CharacterGroup IN (7, 12, 29, 30, 31, 34, 41, 52) AND  tx.accepted_id = txa._id AND ms.ID = sc.SpeciesID AND ms.IndexFungorumSpecies= tx.FunIndexNumber AND ms.IndexFungorumSpecies > 0  GROUP BY txa._id
	
	
	
	--SELECT txa._id, txa.FullName, COUNT(sc.Character), sc.SpeciesID FROM mycokey.Characters mc, mycokey.SpeciesCharacters sc, mycokey.Species ms, svampeatlas.Taxon tx, svampeatlas.Taxon txa WHERE sc.Character = mc.CharacterID AND  mc.CharacterGroup IN (7, 12, 29, 30, 31, 34, 41, 52) AND  tx.accepted_id = txa._id AND ms.ID = sc.SpeciesID AND ms.IndexFungorumSpecies= tx.FunIndexNumber AND ms.IndexFungorumSpecies > 0  GROUP BY sc.SpeciesID;
	
	-- Omit those from the extrapolation	
	INSERT INTO svampeatlas.GenusCharacters SELECT mgc.*, stc._id 
	FROM 	mycokey.Genus mg, mycokey.GenusCharacters mgc, mycokey.Characters mc, svampeatlas.Taxon st, svampeatlas.Taxon sta, svampeatlas.Taxon stc 
	where mg.Name = st.FullName AND st.accepted_id=sta._id AND stc.Path LIKE(CONCAT(sta.Path, '%')) AND mgc.GenusID = mg.ID AND mgc.Character = mc.CharacterID AND mc.CharacterGroup IN (7, 12, 29, 30, 31, 34, 41, 52) AND stc.RankID > 4999 AND stc._id NOT IN (SELECT _id from svampeatlas.mycokey_temp_species) GROUP BY mc.CharacterID, stc._id;
	

	-- DELETE FROM svampeatlas.GenusCharacters WHERE  (`Character` IN (SELECT CharacterID FROM svampeatlas.Characters WHERE CharacterGroup IN (29, 30, 52)) AND taxon_id IN (SELECT _id FROM svampeatlas.Taxon WHERE RankID > 5000));
	
	
	-- insert species characters
	INSERT INTO svampeatlas.GenusCharacters 
	SELECT mgc.Character, mgc.xxxx, mgc.BoolValue, mgc.RealValueMin, mgc.RealValueMax, mgc.Probability, 0,0,0,0, stc._id 
	FROM mycokey.Species mg, mycokey.SpeciesCharacters mgc, mycokey.Characters mc, svampeatlas.mycokey_temp_species stc where stc.ID = mg.ID AND mgc.Character = mc.CharacterID AND mgc.SpeciesID=stc.ID AND mc.CharacterGroup IN (7, 12, 29, 30, 31, 34, 41, 52) 
	ON DUPLICATE KEY UPDATE RealValueMin = mgc.RealValueMin, RealValueMax = mgc.RealValueMax;
	
	
	DROP table svampeatlas.`mycokey_temp_species`
	
	-- Query to delete all characters in the new groups:
	DELETE FROM svampeatlas.GenusCharacters WHERE `Character` IN (SELECT CharacterID FROM svampeatlas.Characters WHERE CharacterGroup IN (7, 12, 29, 30, 31, 34, 41, 52));
	
	-- Query to delete all species characters in the new groups:
	
	select CONCAT(cg.`Full text DK`, " : ", c.`Short text DK`) from Characters c JOIN CharacterGroup cg ON c.CharacterGroup = cg.CharacterGroupID  where c.CharacterGroup IN (7, 12, 29, 30, 31, 34, 41, 52);
	
	
	
	
	
	
	
	