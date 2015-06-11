CREATE TABLE TaxonImages (
_id INT(11),
uri varchar(255),
size char(1),
photographer varchar(255),
country varchar(255),
collectionNumber varchar(255)
) ENGINE = InnoDB DEFAULT CHARSET= UTF8;


INSERT INTO TaxonImages (_id, uri, size, photographer, country, collectionNumber) select p._id, concat("http://www.mycokey.com/MycoKeySolidState/", REPLACE(p.path, ":", "/"), "S.jpg"), "s", a.illustrator, a.Country, a.Number  from MycoKeyPictures p LEFT JOIN MycoKeyAttributes a ON a.MycoKeyHtmlReference=p.path where p._id IS NOT NULL;
INSERT INTO TaxonImages (_id, uri, size, photographer, country, collectionNumber) select p._id, concat("http://www.mycokey.com/MycoKeySolidState/", REPLACE(p.path, ":", "/"), "L.jpg"), "l", a.illustrator, a.Country, a.Number  from MycoKeyPictures p LEFT JOIN MycoKeyAttributes a ON a.MycoKeyHtmlReference=p.path where p._id IS NOT NULL;

ALTER TABLE TaxonImages ADD KEY `_id` (`_id`);


-- Check and fix foreign keys
select _id from TaxonImages where _id not in (select _id from Taxon);

-- add foreign key
ALTER TABLE TaxonImages ADD FOREIGN KEY `taxon_id` (`_id`) references Taxon(_id);
