CREATE TABLE Naturtyper (
_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
verbatimId CHAR NOT NULL,
name VARCHAR(64) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET UTF8;

INSERT INTO Naturtyper (verbatimId, name) VAlUES
('A' , 'ædel-løvskov på leret eller kalkrig bund'),
('B' ,'løvskov på morbund'),
('C', 'skov på muldbund'),
('D', 'nåleskov på kalkholdig/leret bund'),
('E', 'nåleskov på næringsfattig bund'),
('F', 'gammel ædelløvskov dødt ved'),
('G', 'gammel nåleskov med dødt ved'),
('H', 'sumpskove på næringsrig bund'),
('I', 'løvskove med birk, bævreasp mv på fattig bund'),
('J', 'parker, alleer og græsningsskove.'),
('K', 'overdrevs- og kystkrat'),
('L', 'pilemoser'),
('M', 'overdrev'),
('N', 'tørt sandet græsland'),
('O' , 'klitter'),
('P' ,'tørvemoser'),
('Q' ,'rigkær');

CREATE TABLE NaturtypeTaxon (
	naturtype_id INT(11) NOT NULL,
	taxon_id INT(11) NOT NULL,
	PRIMARY KEY (naturtype_id, taxon_id),
	FOREIGN KEY (naturtype_id) REFERENCES Naturtyper(_id),
	FOREIGN KEY (taxon_id) REFERENCES Taxon(_id)
) ENGINE = InnoDB DEFAULT CHARSET UTF8;


INSERT INTO NaturtypeTaxon (naturtype_id, taxon_id) SELECT n._id, t.DkIndexNumber
FROM TaxonBase t
JOIN Naturtyper n ON t.Naturtyper LIKE CONCAT('%', n.verbatimId, '%');
