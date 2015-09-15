CREATE TABLE TaxonBase (
3gen TEXT, 50Arter TEXT, A_kriterium TEXT, about TEXT, ACodeCurrLookup TEXT, ACodeSynLookup TEXT, ACodeToFUN TEXT, AcodeToSpecies TEXT, Amter_kumuleret_lavdata TEXT, Anamorf_species TEXT, anamorfANDtype TEXT, AnamorphORTeleomorph TEXT, Art TEXT, Artstilbagegang TEXT, atlasansvarlig TEXT, AtlasArtMedtagesIStatestik TEXT, AtlasArtMedtagesIWeb TEXT, atlasBemaerkning TEXT, AtlasOekologi TEXT, Atlasrapport TEXT, atlasStatus TEXT, Autor TEXT, B_kriterium TEXT, beskrivelse TEXT, BeskrivelseUK TEXT, Bestandsudvikling TEXT, Biotoptilbagegang TEXT, bog_Gyldendal_art_medtages TEXT, bogtekst TEXT, bogtekst_faenologi_udbredelse TEXT, bogtekst_gyldendal TEXT, Bogtekst_stor_art TEXT, bogtekstAdvarsel TEXT, bogtekstAdvarselGytekst TEXT, bogtekstAdvarselUKtekst TEXT, C_kriterium TEXT, check_ TEXT, D_kriterium TEXT, diagnose TEXT, DK_reference TEXT, DKAcode TEXT, DKIndexANDSynNumber TEXT, DKIndexNumber TEXT, DKnavn TEXT, DKnavnekommentar TEXT, DKnavnForeslaaet TEXT, E_kriterium TEXT, Ernaeringsstrategi_fra_MycoKey TEXT, ernaeringsstrategirapport TEXT, Ernaeringssubstrat_fra_MycoKey TEXT, Ernaeringssubstrat_kun_trae TEXT, etikettekst TEXT, foersteFundIDK TEXT, foersteReferenceForDK TEXT, forfatternavn TEXT, Forudsaetninger TEXT, forvekslingsmuligheder TEXT, foto TEXT, Frb TEXT, Fulde_navn TEXT, FuldeNavnFraFUN TEXT, FuldOekologi TEXT, FUNAuthor TEXT, FunGenus TEXT, FunGenusGenus TEXT, FunGenusGenusMatch TEXT, FunIndexBasNumber TEXT, FunIndexCurrUseNumber TEXT, FunIndexGlobal TEXT, FunIndexNumber TEXT, FunSpeciesANDSubspecificsAuthors TEXT, FUNSpeciesEpithet TEXT, FunSpeciesMatch TEXT, FUNSubspecificCategory TEXT, FUNSubspecificName TEXT, FunSystematics TEXT, Generation TEXT, Genfund TEXT, GenusAndSpecieForOldDataMatch TEXT, GenusAndSpecieForOldDataMatch2 TEXT, GenusAndSpecies TEXT, GenusAndSpeciesAndVar TEXT, GenusSpeciesNavnBog TEXT, Glstatus TEXT, godkendt TEXT, Hyppighed TEXT, In_MycoKey TEXT, Indikator TEXT, Individer TEXT, Infrataxa TEXT, Jordbund TEXT, JVDKoekologi TEXT, JVOrganisme TEXT, JVSubstrat TEXT, kalkulationsfelt_til_fri_afbenyttelse TEXT, Kort TEXT, Kortlaegning TEXT, Kriterier TEXT, last_layout TEXT, LatestRecord TEXT, Lav TEXT, lavTrussel TEXT, Litteratur TEXT, Litteratur_DMU TEXT, Lokalklima TEXT, Loklok TEXT, MarathonCombiNavn TEXT, MarathonDKNavn TEXT, MarathonSpeciesValidation TEXT, Myclok TEXT, MycoKey_genera_with_subgen_syst TEXT, MycoKey_link_loebenummer TEXT, MycoKey_til_export TEXT, MycoKeyGenusID TEXT, MycoKeyIDDKWebLink TEXT, MycoKeyIDForFotoTilstedeArter TEXT, NationalRoedlistekatogeri TEXT, Naturtyper TEXT, noegle TEXT, noeglebeskrivelse TEXT, noeglesti TEXT, note TEXT, note_internal TEXT, numberOfrecords TEXT, numberOfrecordsAtlas TEXT, numberOfrecordsYear TEXT, Nykort TEXT, nyt_taxon_DK_navn TEXT, nyt_taxon_DKindex TEXT, oekologi_ekskluderes_fra_rapport TEXT, Orig_beskrivelse TEXT, rappDiagnose TEXT, rappErnaeringsstrategirapport TEXT, rappForveksling TEXT, rappRoedlisteBestandsudvikling TEXT, rappRoedlistekategori TEXT, rappRoedlisteStatus TEXT, rappRoedlisteUdbredelse TEXT, rappSpiselighedsrapport TEXT, roedliste_2009 TEXT, Roedlisteansvarlig TEXT, roedlisteBestandsstoerrelse TEXT, roedlisteBestandsstoerrelseAar TEXT, roedlisteBestandsstoerrelseBem TEXT, roedlisteBestandsudvikling TEXT, roedlisteGenerationsinterval TEXT, roedlisteGenerationstid TEXT, roedlisteGruppe TEXT, roedlisteID TEXT, roedlisteIndivider TEXT, roedlisteLevesteder TEXT, roedlisteNationalStatus TEXT, roedlisteNationalStatusClean TEXT, roedlisteNegativePaavirknBem TEXT, roedlisteNegativePaavirkninger TEXT, roedlisteNomenkaltur TEXT, roedlisteUdbredelsesareal TEXT, Roedlistevurdering TEXT, Slaegt TEXT, source_of_data TEXT, spiselighedskode TEXT, spiselighedskommentar TEXT, spiselighedsrapport TEXT, Status TEXT, StatusDK TEXT, StatusNy TEXT, StatusTal TEXT, StatusTilstedeIDK TEXT, Subgeneric_system TEXT, Substrat TEXT, SynonomyReport TEXT, synonym TEXT, Synonymer TEXT, System TEXT, Systnr TEXT, taxonomic_rank TEXT, teleomorfIndexLink TEXT, Udbredelse TEXT, vaert TEXT, valAndet TEXT, valArtsRapport TEXT, valBelaeg TEXT, valBeskr TEXT, valFoto TEXT, valFuldRapport TEXT, valideringskrav TEXT, valideringSpecifikkeKrav TEXT, valMikro TEXT, var TEXT, variableCheck TEXT, Vegetationstype TEXT, vernacular_name_DE TEXT, vernacular_name_Fi TEXT, vernacular_name_FR TEXT, vernacular_name_GB TEXT, vernacular_name_NL TEXT, vernacular_name_NO TEXT, vernacular_name_SE TEXT, visSynonymer TEXT, vort_taxon_DK_navnxxx TEXT, vort_taxon_DKindex TEXT, yearOfAtlasStart TEXT, yearToSearch TEXT) ENGINE= MyISAM DEFAULT CHARSET=utf8;

-- One record has invalid DkIndexNumber:

DELETE from TaxonBase where DkIndexNumber NOT REGEXP '^-?[0-9]+$';

ALTER TABLE TaxonBase MODIFY DkIndexNumber INT(11) NOT NULL;

ALTER TABLE TaxonBase ADD PRIMARY KEY (DkIndexNumber);