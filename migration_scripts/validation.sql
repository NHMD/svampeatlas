CREATE TABLE temp_valid (
taxon_id INT(11) NOT NULL,
valideringskrav VARCHAR(4),
valideringsrapport TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO temp_valid SELECT DkIndexNumber, valideringskrav,
REPLACE(valFuldRapport, "Atlasprojektet er slut og fund valideres ikke længere systematisk. Vil du sikre dig at dette valideringskrævende fund på sigt kan godkendes gælder følgende: ", 
"") FROM TaxonBase;

UPDATE temp_valid SET valideringskrav = 0 where valideringskrav = 1;
UPDATE temp_valid v, TaxonBase t SET v.valideringskrav = 1 WHERE t.DkIndexNumber = v.taxon_id AND t.valideringSpecifikkeKrav LIKE "%7%";


-- på server:
UPDATE temp_valid a1, temp_valid b1, Taxon a, Taxon b SET b1.valideringskrav = a1.valideringskrav WHERE a._id = b.accepted_id AND b._id = b1.taxon_id AND a._id=a1.taxon_id AND b1.valideringskrav = "";
UPDATE temp_valid SET valideringskrav = 2 where valideringskrav = "";


ALTER TABLE TaxonAttributes ADD COLUMN valideringskrav TINYINT(2) DEFAULT 2, ADD COLUMN valideringsrapport TEXT;

UPDATE TaxonAttributes t, temp_valid v SET t.valideringskrav = v.valideringskrav, t.valideringsrapport = v.valideringsrapport WHERE t.taxon_id = v.taxon_id;


drop table temp_valid;

ALTER TABLE TaxonAttributes DROP COLUMN valideringskrav, DROP COLUMN valideringsrapport;
