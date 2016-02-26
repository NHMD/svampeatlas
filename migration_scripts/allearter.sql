CREATE TABLE allearter (
_id INT(11) NOT NULL PRIMARY KEY,
accepted_id INT(11),
FunIndexNumber INT(11),
FullName VARCHAR(255),
Author VARCHAR(255),
vernacularname_dk VARCHAR(255),
CurrentRedlistStatus VARCHAR(255),
Family VARCHAR(255),
`Order` VARCHAR(255),
Class VARCHAR(255),
Phyllum VARCHAR(255),
Lichen TINYINT(4)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

INSERT INTO allearter (_id, accepted_id, FunIndexNumber, FullName, Author, vernacularname_dk) SELECT t._id, t.accepted_id, t.FunIndexNumber, t.FullName, t.Author, d.vernacularname_dk FROM (Taxon t JOIN TaxonAttributes a on t._id=a.taxon_id) LEFT JOIN TaxonDKnames d ON t.vernacularname_dk_id=d._id AND a.PresentInDK = 1 AND t.RankID > 9999;

INSERT INTO allearter (_id, accepted_id, FunIndexNumber, FullName, Author) SELECT t._id, t.accepted_id, t.FunIndexNumber, t.FullName, t.Author FROM Taxon t JOIN TaxonAttributes a on t._id=a.taxon_id AND a.PresentInDK = 1 AND t.RankID > 9999;

-- synonyms
INSERT INTO allearter (_id, accepted_id, FunIndexNumber, FullName, Author) SELECT t._id, t.accepted_id, t.FunIndexNumber, t.FullName, t.Author FROM Taxon t, allearter a WHERE t.accepted_id = a._id AND t._id NOT IN (SELECT _id FROM allearter x);

-- dk names
UPDATE allearter x, Taxon t, TaxonDKnames n SET x.vernacularname_dk = n.vernacularname_dk WHERE x._id=t._id AND t.vernacularname_dk_id=n._id;

--Redlist status
UPDATE allearter x, CurrentRedListStatus s SET x.CurrentRedlistStatus = s.status WHERE x._id=s.taxon_id;

-- Family
UPDATE allearter x, Taxon sp, Taxon f SET x.Family = f.FullName WHERE x._id=sp._id AND sp.Path LIKE CONCAT(f.Path, "%") AND f.RankName = "fam.";

-- Order
UPDATE allearter x, Taxon sp, Taxon f SET x.`Order` = f.FullName WHERE x._id=sp._id AND sp.Path LIKE CONCAT(f.Path, "%") AND f.RankName = "ord.";

-- Class
UPDATE allearter x, Taxon sp, Taxon f SET x.`Class` = f.FullName WHERE x._id=sp._id AND sp.Path LIKE CONCAT(f.Path, "%") AND f.RankName = "class.";

-- Phyllum
UPDATE allearter x, Taxon sp, Taxon f SET x.`Phyllum` = f.FullName WHERE x._id=sp._id AND sp.Path LIKE CONCAT(f.Path, "%") AND f.RankName = "phyl.";

-- Laver
UPDATE allearter a, TaxonBase t SET a.Lichen = t.Lav WHERE a._id= t.DKindexNumber AND t.Lav = "1";

UPDATE allearter set accepted_id=_id WHERE accepted_id IS NULL;
UPDATE allearter set FunIndexNumber = NULL WHERE FunIndexNumber > 1000000;
UPDATE allearter SET Lichen =0 WHERE Lichen IS NULL;
SELECT a.*, "https://creativecommons.org/licenses/by-nc/4.0/" as license, "Danish mycological society (2016). Checklist of Danish Fungi and Lichens, contributed by Frøslev, T., Heilmann-Clausen, J., Jeppesen, T.S., Lange, C., Læssøe, T., Petersen, J.H., Søchting, U., Vesterholt, J, online www.svampeatlas.dk" as citation from allearter a;
