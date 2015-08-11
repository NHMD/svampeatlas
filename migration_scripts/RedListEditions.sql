CREATE TABLE RedListEditions (
year INT(4) PRIMARY KEY,
authors VARCHAR(255),
notes TEXT
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

INSERT INTO RedListEditions (year) VALUES (1990), (1997), (2005), (2009);

ALTER TABLE TaxonRedListData ADD FOREIGN KEY (year) REFERENCES RedListEditions(year);