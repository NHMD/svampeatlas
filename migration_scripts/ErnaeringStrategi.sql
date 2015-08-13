DROP TABLE ErnaeringStrategi;
CREATE TABLE ErnaeringStrategi (
_id INT(4) PRIMARY KEY NOT NULL,
name VARCHAR(128)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

INSERT INTO ErnaeringStrategi (_id, name) VALUES 
(0, 'nedbryder (inkl. nekrotrof)' ),
(1, 'biotrof'),
(2, 'lavdanner'),
(3, 'ektomykorrhizadanner'),
(4, 'biotrof parasit'),
(5, 'symbiotisk med insekter'),
(6, 'endofyt i alger'),
(7, 'endofyt i planter');

CREATE TABLE TaxonErnaeringStrategi (
ernaeringsstrategi_id INT(3) NOT NULL,
taxon_id INT(11) NOT NULL,
PRIMARY KEY (ernaeringsstrategi_id, taxon_id)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

INSERT INTO TaxonErnaeringStrategi SELECT e._id, t.DkIndexNumber FROM ErnaeringStrategi e, TaxonBase t WHERE t.Ern_ringsstrategi_fra_MycoKey LIKE CONCAT("%", e._id, "%");

ALTER TABLE TaxonErnaeringStrategi ADD FOREIGN KEY (ernaeringsstrategi_id) REFERENCES ErnaeringStrategi(_id);

ALTER TABLE TaxonErnaeringStrategi ADD FOREIGN KEY (taxon_id) REFERENCES Taxon(_id);


