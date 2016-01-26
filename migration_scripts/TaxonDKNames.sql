CREATE TABLE TaxonDKnames (
_id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
taxon_id INT(11) NOT NULL,
vernacularname_dk VARCHAR(255) NOT NULL,
appliedLatinName VARCHAR(255) NOT NULL,
source VARCHAR(255),
FOREIGN KEY (taxon_id) REFERENCES TAXON(_id)
)ENGINE = InnoDB DEFAULT CHARSET=UTF8;

ALTER TABLE TaxonDKnames ADD UNIQUE (taxon_id, vernacularname_dk);

INSERT INTO TaxonDKnames SELECT
_id, DKIndex, anvendtDKNavn, anvendtSystNavn, kilde FROM DKNavneBrug where DKIndex <>0 ON DUPLICATE KEY UPDATE TaxonDKnames._id=TaxonDKnames._id;

INSERT INTO TaxonDKnames(taxon_id, vernacularname_dk, appliedLatinName, source) SELECT _id, vernacularname_dk, FullName, "TaxonBasen" FROM Taxon WHERE vernacularname_dk IS NOT NULL AND vernacularname_dk <> "" ON DUPLICATE KEY UPDATE TaxonDKnames._id=TaxonDKnames._id;

ALTER TABLE Taxon ADD COLUMN vernacularname_dk_id INT(11);
ALTER TABLE Taxon ADD FOREIGN KEY (vernacularname_dk_id) REFERENCES TaxonDKnames(_id);
UPDATE Taxon t, TaxonDKnames d set t.vernacularname_dk_id = d._id where d.taxon_id=t._id AND t.vernacularname_dk = d.vernacularname_dk;

ALTER TABLE TaxonDKnames
ADD COLUMN createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updatedAt datetime DEFAULT NULL;

ALTER TABLE `TaxonDKnames` ADD `note` VARCHAR(510) CHARACTER SET utf8 COLLATE utf8_bin NULL AFTER `source`;