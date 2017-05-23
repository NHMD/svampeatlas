-- CREATE VIEW CharacterView AS select taxon_id, CharacterID, `description UK`, `description DK`, `Short text UK`, `Short text DK`, Name, CharacterGroup FROM Characters c JOIN GenusCharacters g ON c.CharacterID = g.Character;

DROP VIEW CharacterView; 
CREATE VIEW CharacterView AS select taxon_id, RealValueMin, RealValueMax, Type, Unit, CharacterID, `description UK`, `description DK`, `Short text UK`, `Short text DK`, Name, CharacterGroup FROM Characters c JOIN GenusCharacters g ON c.CharacterID = g.Character;


DROP VIEW CharacterView2;
CREATE VIEW CharacterView2 AS select CharacterID, Type, Unit, `description UK`, `description DK`, `Short text UK`, `Short text DK`, c.Name, CharacterGroup, cg.`Full text UK` as `Group Full text UK`,  cg.`Full text DK` as `Group Full text DK` FROM Characters c JOIN CharacterGroup cg ON c.`CharacterGroup` = cg.`CharacterGroupID`;