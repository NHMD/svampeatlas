DELETE from temp_dist where _id in (60760, 64797) AND fn_temperate = "" AND South_of_DK = "";


SUBSTRING_INDEX(FuldeNavnFraFUN, " ", 2) FROM `temp_dist`




update temp_dist t, Taxon f set t._id = f._id where t._id=0 AND SUBSTRING_INDEX(t.FuldeNavnFraFUN, " ", 2) = f.FullName

update temp_dist t, TaxonBase f set t.atlasart= f.AtlasArtMedtagesIStatestik where t._id = f.DkIndexNumber and f.AtlasArtMedtagesIStatestik="1" ;

insert into temp_dist (_id, atlasart) select DkIndexNumber, AtlasArtMedtagesIStatestik from TaxonBase where DkIndexNumber NOT IN (select _id from temp_dist where _id > 0) and AtlasArtMedtagesIStatestik="1"; 

UPDATE temp_dist t, Taxon x set t.FuldeNavnFraFUN = x.FullName, " ", x.Author) where t.FuldeNavnFraFUN IS NULL AND t._id=x._id;


ALTER TABLE TaxonAttributes ADD COLUMN basionym_described INT(5), 
ADD COLUMN fn_temperate VARCHAR(255), 
ADD COLUMN fn_hemiboreal VARCHAR(255), 
ADD COLUMN fn_boreal VARCHAR(255), 
ADD COLUMN fn_subarctic_alpine VARCHAR(255), 
ADD COLUMN fn_arctic_alpine VARCHAR(255), 
ADD COLUMN fn_comment VARCHAR(255), 
ADD COLUMN North_of_DK VARCHAR(255), 
ADD COLUMN South_of_DK VARCHAR(255), 
ADD COLUMN West_of_DK VARCHAR(255), 
ADD COLUMN East_of_DK VARCHAR(255), 
ADD COLUMN atlasart TINYINT(2) DEFAULT 0; 

UPDATE temp_dist set basionym_described = 0 where basionym_described LIKE "%N%";
UPDATE temp_dist set basionym_described = 0 where basionym_described LIKE "%?%";

UPDATE TaxonAttributes a, temp_dist t SET a.basionym_described = t.basionym_described, a.fn_temperate=t.fn_temperate, a.fn_hemiboreal = t.fn_hemiboreal, a.fn_boreal =t.fn_boreal , a.fn_subarctic_alpine = t.fn_subarctic_alpine, a.fn_arctic_alpine=t.fn_arctic_alpine, a.fn_comment = t.fn_comment, a.North_of_DK = t.North_of_DK , a.South_of_DK = t.South_of_DK, a.West_of_DK = t.West_of_DK, a.East_of_DK = t.East_of_DK, a.atlasart = t.atlasart where a.taxon_id = t._id;

UPDATE TaxonAttributes a, TaxonAttributes t, Taxon ta SET a.basionym_described = t.basionym_described, a.fn_temperate=t.fn_temperate, a.fn_hemiboreal = t.fn_hemiboreal, a.fn_boreal =t.fn_boreal , a.fn_subarctic_alpine = t.fn_subarctic_alpine, a.fn_arctic_alpine=t.fn_arctic_alpine, a.fn_comment = t.fn_comment, a.North_of_DK = t.North_of_DK , a.South_of_DK = t.South_of_DK, a.West_of_DK = t.West_of_DK, a.East_of_DK = t.East_of_DK, a.atlasart = t.atlasart where a.taxon_id = ta.accepted_id AND ta._id <> ta.accepted_id AND ta._id = t.taxon_id;