INSERT INTO svampeatlas.Characters SELECT * from mycokey.Characters WHERE CharacterGroup IN (10,11, 39, 42);

truncate svampeatlas.GenusCharacters;
INSERT INTO svampeatlas.GenusCharacters SELECT g.*, 0 FROM mycokey.GenusCharacters g ;
delete from svampeatlas.GenusCharacters where `Character` NOT IN (select CharacterID from svampeatlas.Characters);

update mycokey.Genus mg, svampeatlas.GenusCharacters sg, svampeatlas.Taxon st SET sg.taxon_id = st._id where mg.Name = st.FullName AND sg.GenusID = mg.ID;