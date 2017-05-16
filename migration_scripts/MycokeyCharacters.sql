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
	UPDATE GenusCharacters set BoolValue = 1;
	
	INSERT INTO svampeatlas.CharacterGroup  SELECT * FROM mycokey.CharacterGroup WHERE CharacterGroupID IN (7, 12, 29, 30, 31, 34, 41, 52);
	INSERT INTO svampeatlas.Characters SELECT * from mycokey.Characters WHERE CharacterGroup IN (7, 12, 29, 30, 31, 34, 41, 52);
	
	SELECT txa._id, txa.FullName, COUNT(sc.Character), sc.SpeciesID FROM mycokey.SpeciesCharacters sc, mycokey.Species ms, svampeatlas.Taxon tx, svampeatlas.Taxon txa WHERE tx.accepted_id = txa._id AND ms.ID = sc.SpeciesID AND ms.IndexFungorumSpecies= tx.FunIndexNumber AND ms.IndexFungorumSpecies > 0  GROUP BY sc.SpeciesID;
	
	
	