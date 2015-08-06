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
  `Author` varchar(128) DEFAULT NULL,
  `diagnose` text DEFAULT NULL COMMENT 'diagnose in FileMaker',
  `forvekslingsmuligheder` text DEFAULT NULL,
  `beskrivelse` text DEFAULT NULL,
 `oekologi` text DEFAULT NULL COMMENT 'AtlasOekologi in FileMaker',
`bemaerkning` text DEFAULT NULL COMMENT 'atlasBem_rkning in FileMaker',
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