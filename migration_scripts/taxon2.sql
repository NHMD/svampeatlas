CREATE TABLE IF NOT EXISTS `Taxon` (
`_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'DkIndexNumber in FileMaker',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `Path` varchar(255) DEFAULT NULL COMMENT 'Text index for subtree querying',
  `SystematicPath` varchar(255) DEFAULT NULL COMMENT 'Systematic path from Index Fungorum or MycoBank',
  `Version` int(11) DEFAULT NULL,
  `FullName` varchar(255) DEFAULT NULL COMMENT 'FuldeNavnFraFUN in FileMaker',
  `GUID` varchar(128) DEFAULT NULL,
  `IsAccepted` bit(1) NOT NULL,
  `FunIndexTypificationNumber` int(11) NOT NULL,
  `FunIndexCurrUseNumber` int(11) NOT NULL,
  `FunIndexNumber` int(11) INT(11) NULL DEFAULT NULL,
  `RankID` int(11) NOT NULL,
  `RankName` varchar(128) DEFAULT NULL COMMENT 'taxonomic_rank in FileMaker',
  `TaxonName` varchar(128) NOT NULL,
  `Author` varchar(1024) DEFAULT NULL,
  `diagnose` text DEFAULT NULL COMMENT 'diagnose in FileMaker',
  `forvekslingsmuligheder` text DEFAULT NULL,
  `beskrivelse` text DEFAULT NULL,
 `oekologi` text DEFAULT NULL COMMENT 'AtlasOekologi in FileMaker',
`bemaerkning` text DEFAULT NULL COMMENT 'atlasBemaerkning in FileMaker',
`foersteFundIDK` int(4) DEFAULT NULL,
`foersteReferenceForDK` int(4) DEFAULT NULL,
`PresentInDK` bit(1) NOT NULL DEFAULT 0,
 `DK_reference` text DEFAULT NULL,
 `MycoKeyIDDKWebLink` varchar(255) DEFAULT NULL,
 `internalNote` text DEFAULT NULL COMMENT 'note_internal in FileMaker',
  `DKnavn` varchar(255) DEFAULT NULL,
  `vernacular_name_DE` varchar(255) DEFAULT NULL,
  `vernacular_name_Fi` varchar(255) DEFAULT NULL,
  `vernacular_name_FR` varchar(255) DEFAULT NULL,
  `vernacular_name_GB` varchar(255) DEFAULT NULL,
  `vernacular_name_NL` varchar(255) DEFAULT NULL,
  `vernacular_name_NO` varchar(255) DEFAULT NULL,
  `vernacular_name_SE` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `accepted_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `Taxon` ADD UNIQUE KEY `TaxonName_2` (`TaxonName`,`RankName`, `parent_id`), ADD KEY `RankName` (`RankName`), ADD KEY `TaxonName` (`TaxonName`), ADD FULLTEXT KEY `SystematicPath` (`SystematicPath`);


CREATE TABLE IF NOT EXISTS `Systematics` (
  `_id` int(11) NOT NULL,
  `path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Fyld Systematics via phpMyAdmin med export fra TaxonBase : DkIndexNumber, samt Systematics fra FunSystem 2

-- Clean firstOccurrance and first ref:

UPDATE TaxonBase SET foersteFundIDK = "0" WHERE foersteFundIDK NOT REGEXP '^[[:digit:]]{4}$';
UPDATE TaxonBase SET foersteReferenceForDK = "0" WHERE foersteReferenceForDK NOT REGEXP '^[[:digit:]]{4}$';
UPDATE `TaxonBase` SET taxonomic_rank = "species" where taxonomic_rank = "genus" and FUNSpeciesEpithet <> "";


-- Create super generic taxa
INSERT INTO Taxon (
	RankID,
	_id,
	createdAt, 
	updatedAt,
	IsAccepted, 
	FullName, 
	RankName, 
	TaxonName, 
	Author, 
	FunIndexCurrUseNumber, 
	FunIndexNumber, 
	diagnose, 
	forvekslingsmuligheder, 
	beskrivelse,
	oekologi,
	bemaerkning,
	foersteFundIDK,
	foersteReferenceForDK,
	DK_reference,
	MycoKeyIDDKWebLink,
	internalNote,
	 DKnavn, 
	 vernacular_name_DE, 
	 vernacular_name_Fi, 
	 vernacular_name_FR, 
	 vernacular_name_GB, 
	 vernacular_name_NL, 
	 vernacular_name_NO, 
	 vernacular_name_SE
 ) SELECT 0, DkIndexNumber, NOW(), NOW(), 1, FuldeNavnFraFUN, taxonomic_rank, FUNGenus, FUNAuthor, FunIndexCurrUseNumber, FunIndexNumber, diagnose, forvekslingsmuligheder, beskrivelse,
	AtlasOekologi,
	atlasBemaerkning,
	foersteFundIDK,
	foersteReferenceForDK,
	DK_reference,
	MycoKeyIDDKWebLink,
	note_internal, DKnavn, vernacular_name_DE, vernacular_name_Fi, vernacular_name_FR, vernacular_name_GB, vernacular_name_NL, vernacular_name_NO, vernacular_name_SE FROM TaxonBase where taxonomic_rank = "supergeneric rank";



-- Create genera
INSERT INTO Taxon (
	RankID,
	_id,
	createdAt, 
	updatedAt,	
	IsAccepted, 
	FullName, 
	RankName, 
	TaxonName, 
	Author, 
	FunIndexCurrUseNumber, 
	FunIndexNumber, 
	diagnose, 
	forvekslingsmuligheder, 
	beskrivelse,
	oekologi,
	bemaerkning,
	foersteFundIDK,
	foersteReferenceForDK,
	DK_reference,
	MycoKeyIDDKWebLink,
	internalNote,
	 DKnavn, 
	 vernacular_name_DE, 
	 vernacular_name_Fi, 
	 vernacular_name_FR, 
	 vernacular_name_GB, 
	 vernacular_name_NL, 
	 vernacular_name_NO, 
	 vernacular_name_SE) SELECT 0, DkIndexNumber, NOW(), NOW(), 1, FuldeNavnFraFUN, taxonomic_rank, FUNGenus, FUNAuthor, FunIndexCurrUseNumber, FunIndexNumber, diagnose, forvekslingsmuligheder, beskrivelse,
	AtlasOekologi,
	atlasBemaerkning,
	foersteFundIDK,
	foersteReferenceForDK,
	DK_reference,
	MycoKeyIDDKWebLink,
	note_internal, DKnavn, vernacular_name_DE, vernacular_name_Fi, vernacular_name_FR, vernacular_name_GB, vernacular_name_NL, vernacular_name_NO, vernacular_name_SE FROM TaxonBase where taxonomic_rank = "genus" AND FUNGenus <> "";

-- move subspecific taxa from species rank:

UPDATE TaxonBase SET taxonomic_rank = FUNSubspecificCategory  where taxonomic_rank = "species" and FUNSubspecificCategory != "" AND FUNSubspecificName != ""; 

UPDATE TaxonBase SET FunIndexNumber = NULL where FunIndexNumber ="";
UPDATE TaxonBase SET  FunIndexCurrUseNumber = NULL where FunIndexCurrUseNumber = "";

-- Create species
INSERT INTO Taxon (
	RankID,
	_id,
	createdAt, 
	updatedAt,
	IsAccepted, 
	FullName, 
	RankName, 
	TaxonName, 
	Author, 
	FunIndexCurrUseNumber, 
	FunIndexNumber, 
	diagnose, 
	forvekslingsmuligheder, 
	beskrivelse,
	oekologi,
	bemaerkning,
	foersteFundIDK,
	foersteReferenceForDK,
	DK_reference,
	MycoKeyIDDKWebLink,
	internalNote,
	 DKnavn, 
	 vernacular_name_DE, 
	 vernacular_name_Fi, 
	 vernacular_name_FR, 
	 vernacular_name_GB, 
	 vernacular_name_NL, 
	 vernacular_name_NO, 
	 vernacular_name_SE, parent_id) SELECT 0, DkIndexNumber, NOW(), NOW(), 1, FuldeNavnFraFUN, taxonomic_rank, FUNSpeciesEpithet, FUNAuthor, FunIndexCurrUseNumber, FunIndexNumber, diagnose, forvekslingsmuligheder, beskrivelse,
	AtlasOekologi,
	atlasBemaerkning,
	foersteFundIDK,
	foersteReferenceForDK,
	DK_reference,
	MycoKeyIDDKWebLink,
	note_internal, DKnavn, vernacular_name_DE, vernacular_name_Fi, vernacular_name_FR, vernacular_name_GB, vernacular_name_NL, vernacular_name_NO, vernacular_name_SE, (select _id from Taxon t2 where t2.TaxonName = TaxonBase.FunGenus AND t2.RankName = "genus") FROM TaxonBase where taxonomic_rank = "species";
	
	-- create 93 species which has no taxonomic rank in Taxon Base
	INSERT INTO Taxon (
		RankID,
		_id,
		createdAt, 
		updatedAt,
		IsAccepted, 
		FullName, 
		RankName, 
		TaxonName, 
		Author, 
		FunIndexCurrUseNumber, 
		FunIndexNumber, 
		diagnose, 
		forvekslingsmuligheder, 
		beskrivelse,
		oekologi,
		bemaerkning,
		foersteFundIDK,
		foersteReferenceForDK,
		DK_reference,
		MycoKeyIDDKWebLink,
		internalNote,
		 DKnavn, 
		 vernacular_name_DE, 
		 vernacular_name_Fi, 
		 vernacular_name_FR, 
		 vernacular_name_GB, 
		 vernacular_name_NL, 
		 vernacular_name_NO, 
		 vernacular_name_SE, parent_id) SELECT 0, DkIndexNumber, NOW(), NOW(), 1, FuldeNavnFraFUN, "sp.XXX", FUNSpeciesEpithet, FUNAuthor, FunIndexCurrUseNumber, FunIndexNumber, diagnose, forvekslingsmuligheder, beskrivelse,
		AtlasOekologi,
		atlasBemaerkning,
		foersteFundIDK,
		foersteReferenceForDK,
		DK_reference,
		MycoKeyIDDKWebLink,
		note_internal, DKnavn, vernacular_name_DE, vernacular_name_Fi, vernacular_name_FR, vernacular_name_GB, vernacular_name_NL, vernacular_name_NO, vernacular_name_SE, (select _id from Taxon t2 where t2.TaxonName = tb.FunGenus AND t2.RankName = "genus") FROM (select t3.* from Fungi f, TaxonBase t3 where f.DkIndexNumber= t3.DkIndexNumber AND t3.taxonomic_rank = "" AND f.DkIndexNumber not in (select _id from Taxon tax) GROUP BY f.DkIndexNumber) tb;


	UPDATE Taxon t, TaxonBase t2 SET t.accepted_id = t2.DKIndexANDSynNumber where t._id = t2.DkIndexNumber AND t2.DKIndexANDSynNumber != "";
	
	UPDATE Taxon set RankName = "sp." where RankName in ("species", "sp.XXX");
	UPDATE Taxon set RankName = "gen." where RankName = "genus";
		
		
		
		-- Clean subgeneric taxa
		UPDATE TaxonBase SET FUNSubspecificCategory = "f." where taxonomic_rank = "subspecific rank" and FUNSubspecificCategory = "ﬂ";
		-- Move incorrectly placed taxa to species rank
		UPDATE TaxonBase SET taxonomic_rank = "species" where taxonomic_rank = "subspecific rank" and FUNSubspecificCategory = "" AND FUNSpeciesMatch NOT LIKE "%var.%" AND FUNSpeciesMatch  LIKE "%var%";
		UPDATE TaxonBase SET FUNSubspecificName = SUBSTRING_INDEX(FUNSpeciesMatch, 'var. ', -1), FUNSubspecificCategory = "var." where taxonomic_rank = "subspecific rank" and FUNSubspecificCategory = "" and FUNSubspecificName ="" and FUNSpeciesMatch  LIKE "%var.%";
		UPDATE TaxonBase SET FUNSubspecificName = SUBSTRING_INDEX(FUNSpeciesMatch, 'f. ', -1), FUNSubspecificCategory = "f." where taxonomic_rank = "subspecific rank" and FUNSubspecificCategory = "" and FUNSubspecificName ="" and FUNSpeciesMatch  LIKE "%f.%";
		UPDATE TaxonBase SET FUNSubspecificCategory = "var." where taxonomic_rank = "subspecific rank" and FUNSubspecificCategory = "";
		
		 update TaxonBase set taxonomic_rank = FUNSubspecificCategory where FUNSubspecificCategory IN ("f.sp.", "f.", "var.","subsp." );
		
		 update TaxonBase set FUNSpeciesEpithet = Art where FUNSubspecificCategory IN ("f.sp.", "f.", "var.","subsp." ) AND FUNSpeciesEpithet = "";
		update TaxonBase set FunGenus = Slaegt where FUNSubspecificCategory IN ("f.sp.", "f.", "var.","subsp." ) AND FunGenus = "";
			update TaxonBase set FuldeNavnFraFUN = Fulde_navn where FUNSubspecificCategory IN ("f.sp.", "f.", "var.","subsp." ) AND FuldeNavnFraFUN = "";
			
	-- Temporary table for species as parents of supspecific taxa	
				create table subspecifictemp (
					child INT (11) NOT NULL,
					parent INT (11) NOT NULL
				) ENGINE = InnoDB;
		
				insert into subspecifictemp
				select t2.DkIndexNumber, t._id from Taxon t, TaxonBase t2 where SUBSTRING_INDEX(t.FullName, " ", 2) = CONCAT(t2.FunGenus, " ", t2.FUNSpeciesEpithet) AND t.FullName NOT LIKE "%sensu%" AND t.FullName NOT LIKE "%ss.%" AND t.RankName IN ("sp.","species") AND t2.taxonomic_rank IN ("f.sp.", "f.", "var.","subsp.");
				
				ALTER TABLE subspecifictemp ADD PRIMARY KEY (parent, child);
				
				-- verify that every subspecific taxon is mapped to exactly one species:
				select count(child), child FROM subspecifictemp s JOIN Taxon t ON t._id = s.parent   group by child having count(child) > 1;
				
				
				select count(t.FuldeNavnFraFUN) FROM TaxonBase t WHERE t.DkIndexNumber NOT IN (select distinct child from subspecifictemp) AND t.taxonomic_rank IN 		("f.sp.", "f.", "var.","subsp." );
			
				-- Create missing parent species - use isAccepted attr to flag new species for later sync with index fungorum
				INSERT INTO Taxon (
					RankID,
					FunIndexCurrUseNumber,
					createdAt, 
					updatedAt,
					IsAccepted, 
					FullName, 
					RankName, 
					TaxonName, 
					parent_id) SELECT 0, 0,  NOW(), NOW(), 0, CONCAT(t.FunGenus, " ", t.FUNSpeciesEpithet), "species", t.FUNSpeciesEpithet, (select _id from Taxon t2 where t2.TaxonName = t.FunGenus AND t2.RankName = "genus" )	FROM TaxonBase t WHERE t.DkIndexNumber NOT IN (select distinct child from subspecifictemp) AND t.taxonomic_rank IN ("f.sp.", "f.", "var.","subsp." ) GROUP BY t.FUNSpeciesEpithet, t.FunGenus;
					
-- Map them to correct index fungorum records
http://localhost:9000/api/taxons/updateallidsbynameforunacceptedspecies
			
					insert into subspecifictemp
					select t2.DkIndexNumber, t._id from Taxon t, TaxonBase t2 where SUBSTRING_INDEX(t.FullName, " ", 2) = CONCAT(t2.FunGenus, " ", t2.FUNSpeciesEpithet) AND t.RankName = "species" AND t.isAccepted = 0 AND t2.taxonomic_rank IN ("f.sp.", "f.", "var.","subsp.") AND t2.DkIndexNumber NOT IN (select child from subspecifictemp);
				
					-- verify that every subspecific taxon is mapped to exactly one species:
					select count(child), child FROM subspecifictemp s JOIN Taxon t ON t._id = s.parent   group by child having count(child) > 1;
			
		-- Create subspecific taxa
		INSERT INTO Taxon (
			RankID,
			_id,
			createdAt, 
			updatedAt,
			IsAccepted, 
			FullName, 
			RankName, 
			TaxonName, 
			Author, 
			FunIndexCurrUseNumber, 
			FunIndexNumber, 
			diagnose, 
			forvekslingsmuligheder, 
			beskrivelse,
			oekologi,
			bemaerkning,
			foersteFundIDK,
			foersteReferenceForDK,
			DK_reference,
			MycoKeyIDDKWebLink,
			internalNote,
			 DKnavn, 
			 vernacular_name_DE, 
			 vernacular_name_Fi, 
			 vernacular_name_FR, 
			 vernacular_name_GB, 
			 vernacular_name_NL, 
			 vernacular_name_NO, 
			 vernacular_name_SE, parent_id) SELECT 0, DkIndexNumber, NOW(), NOW(), 1, FuldeNavnFraFUN, FUNSubspecificCategory, FUNSubspecificName, FUNAuthor, FunIndexCurrUseNumber, FunIndexNumber, diagnose, forvekslingsmuligheder, beskrivelse,
			AtlasOekologi,
			atlasBemaerkning,
			foersteFundIDK,
			foersteReferenceForDK,
			DK_reference,
			MycoKeyIDDKWebLink,
			note_internal, DKnavn, vernacular_name_DE, vernacular_name_Fi, vernacular_name_FR, vernacular_name_GB, vernacular_name_NL, vernacular_name_NO, vernacular_name_SE, (select parent from subspecifictemp where child= TaxonBase.DkIndexNumber) 	
			FROM TaxonBase where taxonomic_rank IN ("f.sp.", "f.", "var.","subsp." ) ;



			UPDATE Taxon t, Taxon t2 SET
			t.diagnose = t2.diagnose, 
			t.forvekslingsmuligheder = t2.forvekslingsmuligheder, 
			t.beskrivelse = t2.beskrivelse,
			t.oekologi = t2.oekologi,
			t.bemaerkning = t2.bemaerkning,
			t.foersteFundIDK = t2.foersteFundIDK,
			t.foersteReferenceForDK = t2.foersteReferenceForDK,
			t.DK_reference = t2.DK_reference,
			t.MycoKeyIDDKWebLink = t2.MycoKeyIDDKWebLink,
			t.internalNote = t2.internalNote,
			 t.DKnavn = t2.DKnavn, 
			 t.vernacular_name_DE =t2.vernacular_name_DE, 
			 t.vernacular_name_Fi=t2.vernacular_name_Fi, 
			 t.vernacular_name_FR=t2.vernacular_name_FR, 
			 t.vernacular_name_GB=t2.vernacular_name_GB, 
			 t.vernacular_name_NL=t2.vernacular_name_NL, 
			 t.vernacular_name_NO=t2.vernacular_name_NO, 
			 t.vernacular_name_SE = t2.vernacular_name_SE
			where t.RankName in ("species", "sp.") AND t2.RankName in ("f.sp.", "f.", "var.","subsp." ) AND t._id=t2.parent_id AND t.TaxonName = t2.TaxonName;
			-- Create a table for temporary super generic taxa
			
			CREATE TABLE temptaxon (
				`_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
				`DkIndexNumber` int(11) NOT NULL DEFAULT '0',
			    `RankName` varchar(128) DEFAULT NULL ,
			    `TaxonName` varchar(128) NOT NULL,
				`SystematicPath` varchar(255) DEFAULT NULL
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;

			ALTER TABLE `temptaxon` ADD UNIQUE KEY `RankName` (`RankName`,`TaxonName`);
			
			-- Update orphant species:

			UPDATE Taxon t, Taxon t2 set t.parent_id = t2._id where t2.TaxonName = SUBSTRING_INDEX(t.FullName, " ", 1) AND t.RankName = "species" and t2.RankName = "gen.";

			-- Create missing genera:

			insert ignore into temptaxon (RankName, TaxonName, SystematicPath) (SELECT "genus", SUBSTRING_INDEX(t.FullName, " ", 1), "" FROM Taxon t where t.RankName ="species" AND t.parent_id IS NULL);
	
				INSERT INTO Taxon (
					RankID,
					createdAt, 
					updatedAt,
					IsAccepted,
					FunIndexTypificationNumber,
					FunIndexCurrUseNumber,
					FunIndexNumber,
					RankName, 
					TaxonName, 
					SystematicPath
				) SELECT 0,  NOW(), NOW(), 1, 0,0,0, RankName, TaxonName, SystematicPath FROM temptaxon where DkIndexNumber = 0 AND RankName = "genus";	

			
-- 			UPDATE Taxon t, Systematics s SET t.SystematicPath = s.path where s._id = t._id;
-- Get correct FUN id´s for genera with FunIndexNumber 0:
localhost:9000/api/taxons/updateallidsbyname/genus
-- Run the service that updates systemtics of all genera (method updateAllSystematics in taxon.controller): 
localhost:9000/api/taxons/updateallsystematicsbyid
-- Get correct FUN id´s for supergeneric taxa:
localhost:9000/api/taxons/updateallidsbyname/supergeneric
-- And get their correct SystematicPath:
localhost:9000/api/taxons/updateallsystematicsbytypificationid		
	
-- Hierarchy
-- First set all genera as parents of the species:

UPDATE Taxon t JOIN TaxonBase t2 
   ON SUBSTRING_INDEX(t.FullName, " ", 1) = t2.FunGenus AND t.RankName = "species" AND t2.taxonomic_rank = "genus"  
   SET t.parent_id = t2.DkIndexNumber;	

-- Verify everything is ok:
   SELECT p.TaxonName as parent, t.FullName as child FROM Taxon t, Taxon p where t.parent_id = p._id and t.TaxonName = "vesterholtii";
   
   SELECT t.FullName  FROM Taxon t, Taxon p where t.parent_id = p._id and p.TaxonName = "Cortinarius" AND t.SystematicPath <> "";
   
--   DELETE from Taxon where RankName NOT IN ("species", "genus");




insert ignore into temptaxon (RankName, TaxonName, SystematicPath) (SELECT "regn.", SUBSTRING_INDEX(SystematicPath,", ", 1), SUBSTRING_INDEX(SystematicPath,", ", 1) FROM Taxon where RankName ="gen.");
insert ignore into temptaxon (RankName, TaxonName, SystematicPath) (SELECT "phyl.", SUBSTRING_INDEX(SUBSTRING_INDEX(SystematicPath, ", ", 2),", ", -1), SUBSTRING_INDEX(SystematicPath, ", ", 2) FROM Taxon where RankName ="gen.");
insert ignore into temptaxon (RankName, TaxonName, SystematicPath) (SELECT "subphyl.", SUBSTRING_INDEX(SUBSTRING_INDEX(SystematicPath, ", ", 3),", ", -1), SUBSTRING_INDEX(SystematicPath, ", ", 3) FROM Taxon where RankName ="gen.");
insert ignore into temptaxon (RankName, TaxonName, SystematicPath) (SELECT "class.", SUBSTRING_INDEX(SUBSTRING_INDEX(SystematicPath, ", ", 4),", ", -1), SUBSTRING_INDEX(SystematicPath, ", ", 4) FROM Taxon where RankName ="gen.");
insert ignore into temptaxon (RankName, TaxonName, SystematicPath) (SELECT "subclass.", SUBSTRING_INDEX(SUBSTRING_INDEX(SystematicPath, ", ", 5),", ", -1), SUBSTRING_INDEX(SystematicPath, ", ", 5) FROM Taxon where RankName ="gen.");
insert ignore into temptaxon (RankName, TaxonName, SystematicPath) (SELECT "ord.", SUBSTRING_INDEX(SUBSTRING_INDEX(SystematicPath, ", ", 6),", ", -1), SUBSTRING_INDEX(SystematicPath, ", ", 6) FROM Taxon where RankName ="gen.");
insert ignore into temptaxon (RankName, TaxonName, SystematicPath) (SELECT "fam.", SUBSTRING_INDEX(SUBSTRING_INDEX(SystematicPath, ", ", 7),", ", -1), SUBSTRING_INDEX(SystematicPath, ", ", 7) FROM Taxon where RankName ="gen.");


DELETE FROM `temptaxon` WHERE TaxonName IN ("", "undefined", "Incertae sedis");
	
UPDATE 	temptaxon t, Taxon t2 SET t.DkIndexNumber= t2._id where t.RankName = t2.RankName AND t.TaxonName = t2.TaxonName;

INSERT INTO Taxon (
	RankID,
	createdAt, 
	updatedAt,
	IsAccepted,
	FunIndexTypificationNumber,
	FunIndexCurrUseNumber,
	FunIndexNumber,
	RankName, 
	TaxonName, 
	SystematicPath
) SELECT 0,  NOW(), NOW(), 1, 0,0,0, RankName, TaxonName, SystematicPath FROM temptaxon where DkIndexNumber = 0;

	UPDATE Taxon t, temptaxon t2 SET t.SystematicPath = t2.SystematicPath where t2.DkIndexNumber = t._id AND (t.SystematicPath = "" OR t.SystematicPath IS NULL);

-- Create the root node	
	INSERT INTO Taxon (
		RankID,
		createdAt, 
		updatedAt,
		IsAccepted,
		FunIndexTypificationNumber,
		FunIndexCurrUseNumber,
		FunIndexNumber,
		RankName, 
		TaxonName, 
		SystematicPath
	) values( 0,  NOW(), NOW(), 1, 0,0,0, "life", "Life", "");

	-- Sync new supergeneric taxa with index fungorum:
	http://localhost:9000/api/taxons/syncallfunidsbynamematch

SELECT SystematicPath, SUBSTRING_INDEX(SUBSTRING_INDEX(SystematicPath, ", ", 7),", ", -1) FROM Taxon where RankName = "gen." AND TaxonName = "Hortiboletus";

SELECT SystematicPath, SUBSTRING_INDEX(SUBSTRING_INDEX(SystematicPath, ", ", 6),", ", -1) FROM Taxon where RankName = "fam." AND TaxonName = "Cortinariaceae";

UPDATE Taxon t, Taxon t2 SET t.parent_id = t2._id WHERE t2.TaxonName = SUBSTRING_INDEX(SUBSTRING_INDEX(t.SystematicPath, ", ", 7),", ", -1) AND t.RankName = "gen." AND t2.RankName = "fam.";

UPDATE Taxon t, Taxon t2 SET t.parent_id = t2._id WHERE t2.TaxonName = SUBSTRING_INDEX(SUBSTRING_INDEX(t.SystematicPath, ", ", 7),", ", -1) AND t.RankName = "genus" AND t2.RankName = "fam.";

UPDATE Taxon t, Taxon t2 SET t.parent_id = t2._id WHERE t2.TaxonName = SUBSTRING_INDEX(SUBSTRING_INDEX(t.SystematicPath, ", ", 6),", ", -1) AND t.RankName = "fam." AND t2.RankName = "ord.";

UPDATE Taxon t, Taxon t2 SET t.parent_id = t2._id WHERE t2.TaxonName = SUBSTRING_INDEX(SUBSTRING_INDEX(t.SystematicPath, ", ", 5),", ", -1) AND t.RankName = "ord." AND t2.RankName = "subclass.";

UPDATE Taxon t, Taxon t2 SET t.parent_id = t2._id WHERE t2.TaxonName = SUBSTRING_INDEX(SUBSTRING_INDEX(t.SystematicPath, ", ", 4),", ", -1) AND t.RankName = "subclass." AND t2.RankName = "class.";

UPDATE Taxon t, Taxon t2 SET t.parent_id = t2._id WHERE t2.TaxonName = SUBSTRING_INDEX(SUBSTRING_INDEX(t.SystematicPath, ", ", 3),", ", -1) AND t.RankName = "class." AND t2.RankName = "subphyl.";

UPDATE Taxon t, Taxon t2 SET t.parent_id = t2._id WHERE t2.TaxonName = SUBSTRING_INDEX(SUBSTRING_INDEX(t.SystematicPath, ", ", 2),", ", -1) AND t.RankName = "subphyl." AND t2.RankName = "phyl.";

UPDATE Taxon t, Taxon t2 SET t.parent_id = t2._id WHERE t2.TaxonName = SUBSTRING_INDEX(t.SystematicPath, ", ", 1) AND t.RankName = "phyl." AND t2.RankName = "regn.";

-- Attach kingdoms to the root
UPDATE Taxon t, Taxon t2  SET t.parent_id = t2._id WHERE  t.RankName = "regn." AND t2.RankName = "life";

select SUBSTRING_INDEX(t.SystematicPath, ", Incertae sedis", 1) from Taxon t where t.TaxonName = "Russulales" AND t.RankName = "ord."

UPDATE Taxon t, Taxon t2 SET t.parent_id = t2._id where  t2.SystematicPath = SUBSTRING_INDEX(t.SystematicPath, ", Incertae sedis", 1) AND t.RankName NOT IN ("gen.", "sp.") AND t.parent_id IS NULL;

UPDATE Taxon t, Taxon t2 SET t.parent_id = t2._id where  t2.SystematicPath = SUBSTRING_INDEX(t.SystematicPath, ", Incertae sedis", 1) AND t.RankName = "gen." AND t.parent_id IS NULL;



select TaxonName, SystematicPath, SUBSTRING_INDEX(SUBSTRING_INDEX(t.SystematicPath, "Incertae sedis, ", -2),", Incertae sedis" ,1)  FROM Taxon t where SUBSTRING_INDEX(SUBSTRING_INDEX(t.SystematicPath, "Incertae sedis, ", -2),", Incertae sedis" ,1) NOT REGEXP "," AND t.SystematicPath REGEXP "," AND T.SystematicPath LIKE CONCAT("%Incertae sedis, ", t.TaxonName);
-- update broken references, i.e. Incertae sedis, xxxxxxx, Incertae sedis,
UPDATE Taxon t2, Taxon t SET t.parent_id = t2._id where SUBSTRING_INDEX(SUBSTRING_INDEX(t.SystematicPath, "Incertae sedis, ", -2),", Incertae sedis" ,1) = t2.TaxonName AND SUBSTRING_INDEX(SUBSTRING_INDEX(t.SystematicPath, "Incertae sedis, ", -2),", Incertae sedis" ,1) NOT REGEXP "," AND t.SystematicPath REGEXP "," AND t.SystematicPath LIKE CONCAT("%Incertae sedis, ", t.TaxonName);

update TaxonBase set StatusTilstedeIDK= "0" where StatusTilstedeIDK="";
	ALTER TABLE `TaxonBase` CHANGE `StatusTilstedeIDK` `StatusTilstedeIDK` BIT(1) NOT NULL;
UPDATE Taxon t, TaxonBase t2 set t.PresentInDK=t2.StatusTilstedeIDK where t._id = t2.DkIndexNumber;
-- This query gives Taxa wich occur more than once for the same FunIndexNumber
-- select * from Taxon where FunIndexNumber IN (select FunIndexNumber from Taxon group by FunIndexNumber having count(*) > 1) AND FunIndexNumber IS NOT NULL ORDER BY `Taxon`.`FunIndexNumber` ASC;


-- Create Paths
UPDATE Taxon t SET t.Path = t._id where t.RankName = "life";
UPDATE Taxon t, Taxon t2 SET t.Path = CONCAT(t2.Path, ", ", t._id) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "regn.";
UPDATE Taxon t, Taxon t2 SET t.Path = CONCAT(t2.Path, ", ", t._id) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "phyl.";
UPDATE Taxon t, Taxon t2 SET t.Path = CONCAT(t2.Path, ", ", t._id) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "subphyl.";
UPDATE Taxon t, Taxon t2 SET t.Path = CONCAT(t2.Path, ", ", t._id) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "class.";
UPDATE Taxon t, Taxon t2 SET t.Path = CONCAT(t2.Path, ", ", t._id) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "subclass.";
UPDATE Taxon t, Taxon t2 SET t.Path = CONCAT(t2.Path, ", ", t._id) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "ord.";
UPDATE Taxon t, Taxon t2 SET t.Path = CONCAT(t2.Path, ", ", t._id) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "fam.";
UPDATE Taxon t, Taxon t2 SET t.Path = CONCAT(t2.Path, ", ", t._id) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "gen.";
UPDATE Taxon t, Taxon t2 SET t.Path = CONCAT(t2.Path, ", ", t._id) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "sp.";
UPDATE Taxon t, Taxon t2 SET t.Path = CONCAT(t2.Path, ", ", t._id) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "subsp.";
UPDATE Taxon t, Taxon t2 SET t.Path = CONCAT(t2.Path, ", ", t._id) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "var.";
UPDATE Taxon t, Taxon t2 SET t.Path = CONCAT(t2.Path, ", ", t._id) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "f.";
UPDATE Taxon t, Taxon t2 SET t.Path = CONCAT(t2.Path, ", ", t._id) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "f.sp.";

-- Create SystematicPaths for species and subspecific taxa:
UPDATE Taxon t, Taxon t2 SET t.SystematicPath = CONCAT(t2.SystematicPath, ", ", t.TaxonName) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "sp.";
UPDATE Taxon t, Taxon t2 SET t.SystematicPath = CONCAT(t2.SystematicPath, ", ", t.TaxonName) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "subsp.";
UPDATE Taxon t, Taxon t2 SET t.SystematicPath = CONCAT(t2.SystematicPath, ", ", t.TaxonName) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "var.";
UPDATE Taxon t, Taxon t2 SET t.SystematicPath = CONCAT(t2.SystematicPath, ", ", t.TaxonName) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "f.";
UPDATE Taxon t, Taxon t2 SET t.SystematicPath = CONCAT(t2.SystematicPath, ", ", t.TaxonName) WHERE t.parent_id= t2._id AND t.parent_id IS NOT NULL AND t.RankName = "f.sp.";

--RankIds

UPDATE Taxon t SET RankID =0 where t.RankName = "life";
UPDATE Taxon t SET RankID =100 where t.RankName = "regn.";
UPDATE Taxon t SET RankID =500 where t.RankName = "phyl.";
UPDATE Taxon t SET RankID =1000 where t.RankName = "subphyl.";
UPDATE Taxon t SET RankID =1500 where t.RankName = "class.";
UPDATE Taxon t SET RankID =2000 where t.RankName = "subclass.";
UPDATE Taxon t SET RankID =3000 where t.RankName = "ord.";
UPDATE Taxon t SET RankID =4000 where t.RankName = "fam.";
UPDATE Taxon t SET RankID =5000 where t.RankName = "gen.";
UPDATE Taxon t SET RankID =10000 where t.RankName = "sp.";
UPDATE Taxon t SET RankID =11000 where t.RankName = "subsp.";
UPDATE Taxon t SET RankID =12000 where t.RankName = "var.";
UPDATE Taxon t SET RankID =13000 where t.RankName = "f.";
UPDATE Taxon t SET RankID =14000 where t.RankName = "f.sp.";

CREATE TABLE TaxonRanks SELECT DISTINCT RankName, RankID FROM Taxon;


-- drop attributes when they are moved to TaxonAttributes table

ALTER TABLE `Taxon`
  DROP `IsAccepted`,
  DROP `diagnose`,
  DROP `forvekslingsmuligheder`,
  DROP `beskrivelse`,
  DROP `oekologi`,
  DROP `bemaerkning`,
  DROP `foersteFundIDK`,
  DROP `foersteReferenceForDK`,
  DROP `PresentInDK`,
  DROP `DK_reference`,
  DROP `MycoKeyIDDKWebLink`,
  DROP `internalNote`,
  DROP `DKnavn`,
  DROP `vernacular_name_DE`,
  DROP `vernacular_name_Fi`,
  DROP `vernacular_name_FR`,
  DROP `vernacular_name_GB`,
  DROP `vernacular_name_NL`,
  DROP `vernacular_name_NO`,
  DROP `vernacular_name_SE`;
 
 -- Patch for some synonyms which were not synced 
  CREATE TABLE subspecific_syn_correct SELECT DkIndexNumber, DkIndexANDSynNumber  from TaxonBase tb JOIN Taxon t ON tb.DkIndexNumber = t._id AND  tb.DkIndexNumber <> tb.DkIndexANDSynNumber AND tb.DkIndexANDSynNumber <> "" AND t.accepted_id IS NULL;

  UPDATE Taxon t, subspecific_syn_correct s SET t.accepted_id = s.DkIndexANDSynNumber WHERE t._id = s.DkIndexNumber;

  DROP TABLE subspecific_syn_correct;