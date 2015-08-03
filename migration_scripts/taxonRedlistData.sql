CREATE TABLE IF NOT EXISTS `TaxonRedListData` (
	`taxon_id` INT(11) NOT NULL,
	 `Artstilbagegang` INT(11),
    `Status` ENUM('LC', 'NT', 'VU', 'EN', 'CR','RE', 'DD', 'NA', 'NE'),
	`VerbatimStatus` VARCHAR(255),
	`year`  INT(4) NOT NULL,
    `StatusDK` ENUM('DK', 'Rare', 'Vulnerable', 'Endangered', 'Observation', 'extinct', 'New'),
	`StatusTal` INT(11),
    `Roedlisteansvarlig` VARCHAR(255),
    `roedlisteBestandsstoerrelse` INT(11),
    `roedlisteBestandsstoerrelseÅr` VARCHAR(11),
    `roedlisteBestandsstoerrelseBem` text,
    `roedlisteBestandsudvikling` text,
    `roedlisteGenerationsinterval` INT(4),
    `roedlisteGenerationstid` INT(4),
    `roedlisteGruppe` ENUM('Barksvampe', 'Bladhatte', 'Bugsvampe', 'Bægersvampe', 'Bævresvampe', 'Kantareller og Trompetsvampe', 'Kernesvampe', 'Kølle- og Koralsvampe', 'Pigsvampe', 'Poresvampe', 'Rørhatte', 'Skivesvampe', 'Skørhatte og Mælkehatte', 'Trøfler', 'Vedboende pigsvampe'),
    `roedlisteID` INT(4),
    `roedlisteIndivider` INT(4),
    `roedlisteLevesteder` VARCHAR(255),
    `roedlisteNationalStatus` text,
    `roedlisteNationalStatusClean` text,
    `roedlisteNegativePaavirknBem` VARCHAR(255),
    `roedlisteNegativePaavirkninger` VARCHAR(255),
    `roedlisteNomenkaltur` VARCHAR(11),
    `roedlisteUdbredelsesareal` INT(4),
    `Roedlistevurdering` text,
	`NationalRoedlistekatogeri` VARCHAR(11),
	`Udbredelse` text,
    `Litteratur` text,
    `Litteratur_DMU` VARCHAR(255),
	`Kriterier` VARCHAR(255),
	PRIMARY KEY (taxon_id, year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

UPDATE TaxonBase SET Artstilbagegang = NULL where Artstilbagegang = "";
UPDATE TaxonBase SET roedlisteBestandsstoerrelse = NULL where roedlisteBestandsstoerrelse = "";

UPDATE TaxonBase SET roedlisteGenerationsinterval = NULL where roedlisteGenerationsinterval = "";
UPDATE TaxonBase SET roedlisteGenerationstid = NULL where roedlisteGenerationstid = "";
UPDATE TaxonBase SET roedlisteUdbredelsesareal = NULL where roedlisteUdbredelsesareal = "";
UPDATE TaxonBase SET Artstilbagegang = 0 where Artstilbagegang = "Der er ikke påvist nogen tilbagegang for  arten.";
UPDATE TaxonBase SET Artstilbagegang = 0 where Artstilbagegang = "00";
UPDATE TaxonBase SET Artstilbagegang = 10 where Artstilbagegang = "<10";
UPDATE TaxonBase SET Artstilbagegang = NULL where Artstilbagegang = "";


UPDATE TaxonBase SET roedlisteBestandsstoerrelse = "38" where roedlisteBestandsstoerrelse = "37,5";

UPDATE TaxonBase SET roedlisteID = NULL where roedlisteID = "";
UPDATE TaxonBase SET roedlisteBestandsstoerrelse = NULL where roedlisteBestandsstoerrelse = "";

-- 2009

INSERT INTO TaxonRedListData (
	`taxon_id`,
	 `Artstilbagegang`,
	`VerbatimStatus`,
	`year` ,
    `StatusDK` ,
	`StatusTal` ,
    `Roedlisteansvarlig` ,
    `roedlisteBestandsstoerrelse` ,
    `roedlisteBestandsstoerrelseÅr` ,
    `roedlisteBestandsstoerrelseBem` ,
    `roedlisteBestandsudvikling` ,
    `roedlisteGenerationsinterval` ,
    `roedlisteGenerationstid`,
    `roedlisteGruppe` ,
    `roedlisteID` ,
    `roedlisteIndivider`,
    `roedlisteLevesteder`,
    `roedlisteNationalStatus` ,
    `roedlisteNationalStatusClean` ,
    `roedlisteNegativePaavirknBem` ,
    `roedlisteNegativePaavirkninger` ,
    `roedlisteNomenkaltur` ,
    `roedlisteUdbredelsesareal` ,
    `Roedlistevurdering` ,
	`NationalRoedlistekatogeri` ,
	`Udbredelse`,
    `Litteratur` ,
    `Litteratur_DMU` ,
	`Kriterier` 
) SELECT `DkIndexNumber`,
	 `Artstilbagegang`,
	`roedliste_2009`,
	2009 ,
    `StatusDK` ,
	`StatusTal` ,
    `Roedlisteansvarlig` ,
    `roedlisteBestandsstoerrelse` ,
    `roedlisteBestandsstoerrelseÅr` ,
    `roedlisteBestandsstoerrelseBem` ,
    `roedlisteBestandsudvikling` ,
    `roedlisteGenerationsinterval` ,
    `roedlisteGenerationstid` ,
    `roedlisteGruppe` ,
    `roedlisteID` ,
    `roedlisteIndivider`,
    `roedlisteLevesteder`,
    `roedlisteNationalStatus` ,
    `roedlisteNationalStatusClean` ,
    `roedlisteNegativePaavirknBem` ,
    `roedlisteNegativePaavirkninger` ,
    `roedlisteNomenkaltur` ,
    `roedlisteUdbredelsesareal` ,
    `Roedlistevurdering` ,
	`NationalRoedlistekatogeri` ,
	`Udbredelse`,
    `Litteratur` ,
    `Litteratur_DMU` ,
	`Kriterier` FROM TaxonBase WHERE roedliste_2009 IS NOT NULL AND roedliste_2009 <> "" AND roedlisteGruppe <> "" AND StatusDK <> "";


	-- 2005
	
	INSERT INTO TaxonRedListData (
		`taxon_id`,
		`VerbatimStatus`,
		`year` 
	) SELECT `DkIndexNumber`,
		`StatusNy`,
		2005 FROM TaxonBase WHERE StatusNy IS NOT NULL AND StatusNy <> "" AND roedlisteGruppe <> "" AND StatusDK <> "";


		-- 1997
	
		INSERT INTO TaxonRedListData (
			`taxon_id`,
			`VerbatimStatus`,
			`year` 
		) SELECT `DkIndexNumber`,
		 
			`Status`,
			1997 FROM TaxonBase WHERE Status IS NOT NULL AND Status <> "" AND roedlisteGruppe <> "" AND StatusDK <> "";



	-- 1990
	
			INSERT INTO TaxonRedListData (
				`taxon_id`,
				`VerbatimStatus`,
				`year` 
			) SELECT `DkIndexNumber`,
		 
				`Gl_status`,
				1990 FROM TaxonBase WHERE Gl_status IS NOT NULL AND Gl_status <> "" AND roedlisteGruppe <> "" AND StatusDK <> "";



