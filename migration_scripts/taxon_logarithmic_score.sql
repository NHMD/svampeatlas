




select t.FullName, CEIL(CEIL((LOG10((SELECT MAX(accepted_count) +1.2 FROM TaxonStatistics)) - LOG10((if((ts.accepted_count IS NULL),0, ts.accepted_count)
 +1.1))) * 100) * 100
/ CEIL((LOG10((SELECT MAX(accepted_count) +1.2 FROM TaxonStatistics)) - LOG10((1.1))) * 100)) as TaxonWeight,
 ts.accepted_count as recordCount, (SELECT MAX(accepted_count) FROM TaxonStatistics) as maxRecordCount
FROM Taxon t LEFT JOIN TaxonStatistics ts  ON ts.taxon_id = t._id WHERE t.FullName IN ("Fomes fomentarius", "Russula ochroleuca", "Amanita muscaria", "Amanita citrina var. citrina", "Amanita phalloides var. phalloides", "Cortinarius anserinus", "Abortiporus biennis", "Cortinarius ionochlorus", "Hypholoma capnoides", "Laetiporus sulphureus", "Aurantiporus alborubescens", "Cortinarius sodagnitus", "Cortinarius infractus", "Cortinarius torvus", "Cortinarius obtusus", "Trametes versicolor", "Boletus edulis", "Cortinarius maculosus", "Piptoporus betulinus", "Cortinarius semisanguineus", "Cortinarius bolaris", "Lepiota grangei", "Lepiota cristata", "Amanita phalloides var. phalloides", "Clavulina coralloides", "Clitopilus prunulus", "Craterellus tubaeformis", "Coprinus comatus", "Agaricus moelleri", "Agaricus urinascens", "Agaricus campestris","Cortinarius rufo-olivaceus", "Russula olivacea", "Mycena pseudocorticola", "Cortinarius splendens");





fn TaxonWeigt(t) {

	Y = (LOG(max_accepted_count +1.2) -LOG(t.accepted_count + 1.1) * 100) * 100 / 
		(LOG(max_accepted_count +1.2) -LOG(1.1) * 100)
		return Y;

}



select t.FullName, CEIL(CEIL((LOG10((SELECT MAX(accepted_count) +1.2 FROM TaxonStatistics)) - LOG10((if((ts.accepted_count IS NULL),0, ts.accepted_count)
 +1.1))) * 100) * 100
/ CEIL((LOG10((SELECT MAX(accepted_count) +1.2 FROM TaxonStatistics)) - LOG10((1.1))) * 100)) as TaxonWeight,
 ts.accepted_count as recordCount, (SELECT MAX(accepted_count) FROM TaxonStatistics) as maxRecordCount
FROM (Taxon t JOIN TaxonAttributes a ON t._id= a.taxon_id AND a.PresentInDK = 1) LEFT JOIN TaxonStatistics ts  ON  ts.taxon_id = t._id WHERE ts.accepted_count > 500;



