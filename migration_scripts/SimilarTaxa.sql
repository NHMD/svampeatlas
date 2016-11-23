CREATE TABLE SimilarTaxa (
    _id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt datetime DEFAULT NULL,
	createdbyuser_id INT(11),
	taxon1_id INT(11),
	taxon2_id INT(11),
	text_dk TEXT,
	text_uk TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE SimilarTaxa 
ADD FOREIGN KEY (taxon1_id) REFERENCES Taxon(_id),
ADD FOREIGN KEY (taxon2_id) REFERENCES Taxon(_id),
ADD FOREIGN KEY (createdbyuser_id) REFERENCES Users(_id);