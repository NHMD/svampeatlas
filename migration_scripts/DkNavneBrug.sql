CREATE TABLE DKNavneBrug(
anvendtDKNavn TEXT,
anvendtSystNavn TEXT,
DKIndex TEXT,
kilde TEXT,
kilde_fritekst TEXT,
refID TEXT,
side TEXT,
tekst TEXT
) ENGINE = InnoDB DEFAULT CHARSET=UTF8;

anvendtDKNavn;anvendtSystNavn;DKIndex;kilde;kilde fritekst;refID;side;tekst;år;FuldeNavnFraFUN

LOAD DATA INFILE "/Users/thomasjeppesen/svampeatlas/exports/DkNavne.csv" INTO TABLE DKNavneBrug
CHARACTER SET UTF8
FIELDS TERMINATED BY ',' 
            ENCLOSED BY '"'
    LINES  TERMINATED BY '\r';
ALTER TABLE `DKNavneBrug` ADD `_id` INT(11) NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`_id`) ;
UPDATE DKNavneBrug SET DKIndex=0 where DKIndex="";
UPDATE DKNavneBrug d, Taxon t SET d.DKIndex=t._id where d.anvendtSystNavn = t.FullName;
