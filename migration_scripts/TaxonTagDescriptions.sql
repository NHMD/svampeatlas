CREATE TABLE TaxonTagDescriptions (
_id INT(11) NOT NULL PRIMARY KEY,
createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
tagname VARCHAR(255),
tagowner INT(11) NOT NULL,
FOREIGN KEY (tagowner) REFERENCES Users (_id)
) ENGINE = InnoDB DEFAULT CHARSET= UTF8;
