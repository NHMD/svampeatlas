CREATE VIEW `darwincoreview` AS 
select 
CONCAT('http://svampe.databasen.org/observations/', o._id) AS `id`,
GREATEST(o.updatedAt, COALESCE(d.updatedAt,0), COALESCE(t.updatedAt,0),  COALESCE(ta.updatedAt,0)) as `dcterms:modified`,
'HumanObservation' AS basisOfRecord,
'da' AS `dcterms:language`,
'https://creativecommons.org/licenses/by-nc/4.0/' AS `dcterms:license`,
CONCAT('Danish Mycological Society (',DATE_FORMAT(NOW(),'%Y-%m-%d'), '). Fungal records database (http://svampe.databasen.org), contributed by Frøslev, T., Heilmann-Clausen, J., Jeppesen, T.S., Lange, C., Læssøe, T., Petersen, J.H., Søchting, U., Vesterholt, J.' )    AS `dcterms:bibliographicCitation`,

CONCAT('http://svampe.databasen.org/observations/', o._id) AS `occurrenceID`,

CONCAT('DMS-',o._id) AS `catalogNumber`,
o.fieldNumber AS fieldNumber,
o.fieldNumber AS otherCatalogNumbers,
if((o.substrate_id IS NULL),NULL,concat('{"Substrate":"',`s`.`name_uk`,'"}')) AS `dynamicProperties`,
ptx.DKandLatinName AS `associatedTaxa`,
GROUP_CONCAT(CONCAT('http://svampe.databasen.org/uploads/', oi.name, '.JPG') SEPARATOR ' | ')  AS `associatedMedia`,
u.name AS `recordedBy`,
v.name_uk AS `habitat`,
o.observationDate as eventDate,
if((o.geonameId IS NULL),'Denmark', gn.countryName) AS `country`,
o.decimalLatitude as decimalLatitude,
o.decimalLongitude as decimalLongitude,
o.accuracy as 'coordinateUncertaintyInMeters',
'WGS84' AS `geodeticDatum`,
if((o.geonameId IS NULL),'Danish Mycological Society', 'http://www.geonames.org') as locationAccordingTo,
if((o.geonameId IS NULL), l.name, gn.name) as locality,
if((o.geonameId IS NULL), 'DK', gn.countryCode) as countryCode,
o.verbatimLocality  as verbatimLocality,
if((o.geonameId IS NULL), '', gn.adminName1) as county,
if((o.geonameId IS NULL), o.locality_id, gn.geonameId) as locationId,
CONCAT(ta.FullName, " ", ta.Author) AS `scientificName`,
dkn.vernacularname_dk AS `vernacularName`,
CONCAT('urn:lsid:indexfungorum.org:names:', ta.FunIndexNumber) AS `scientificNameID`,
dtm.name AS identifiedBy 
FROM Observation o LEFT JOIN Locality l ON o.locality_id=l._id LEFT JOIN Users u ON o.primaryuser_id= u._id LEFT JOIN GeoNames gn ON o.geonameId = gn.geonameId LEFT JOIN Determination d ON o.primarydetermination_id= d._id LEFT JOIN Substrate s ON o.substrate_id=s._id LEFT JOIN VegetationType v ON o.vegetationtype_id = v._id LEFT JOIN PlantTaxon ptx ON o.primaryassociatedorganism_id=ptx._id
LEFT JOIN Taxon t ON d.taxon_id=t._id LEFT JOIN Taxon ta ON t.accepted_id = ta._id LEFT JOIN TaxonDKnames dkn ON ta.vernacularname_dk_id = dkn._id LEFT JOIN Users dtm ON d.user_id = dtm._id LEFT JOIN ObservationImages oi ON oi.observation_id=o._id WHERE d.validation = 'Godkendt'
GROUP BY o._id;





INTO outfile '/tmp/dwc.txt'
 FIELDS TERMINATED BY ','
 OPTIONALLY ENCLOSED BY '"'
 LINES TERMINATED BY '\n'

