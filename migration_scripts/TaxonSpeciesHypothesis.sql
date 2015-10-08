CREATE TABLE TaxonSpeciesHypothesis (
_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
taxon_id INT(11) NOT NULL,
createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt datetime DEFAULT NULL,
specieshypothesis VARCHAR(255) NOT NULL,
FOREIGN KEY (taxon_id) REFERENCES Taxon (_id),
UNIQUE (taxon_id, specieshypothesis)
) ENGINE = InnoDB DEFAULT CHARSET=UTF8;