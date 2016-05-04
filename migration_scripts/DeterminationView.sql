CREATE VIEW CurrentRedListStatus AS SELECT taxon_id, status, year FROM TaxonRedListData WHERE year= (SELECT MAX(year) FROM TaxonRedListData);
ALTER TABLE `TaxonRedListData` ADD KEY `Status` (`Status`);
ALTER TABLE `Determination` ADD KEY `validation` (`validation`);


CREATE VIEW DeterminationView AS SELECT 
d._id as Determination_id ,
d.createdAt as Determination_createdAt ,
d.updatedAt as Determination_updatedAt ,
d.observation_id as Determination_observation_id ,
d.taxon_id as Determination_taxon_id ,
d.user_id as Determination_user_id ,
d.confidence as Determination_confidence ,
d.score as Determination_score ,
d.validation as Determination_validation ,
d.notes as Determination_notes ,
d.validatorremarks as Determination_validatorremarks ,
d.validator_id as Determination_validator_id ,
d.verbatimdeterminator as Determination_verbatimdeterminator ,
t._id as Taxon_id ,
 t.createdAt Taxon_createdAt ,
  t.updatedAt Taxon_updatedAt ,
  t.Path Taxon_Path ,
  t.SystematicPath Taxon_SystematicPath ,
  t.Version Taxon_Version ,
  t.FullName Taxon_FullName ,
  t.GUID Taxon_GUID ,
  t.FunIndexTypificationNumber Taxon_FunIndexTypificationNumber ,
  t.FunIndexCurrUseNumber Taxon_FunIndexCurrUseNumber ,
  t.FunIndexNumber Taxon_FunIndexNumber ,
  t.RankID Taxon_RankID ,
  t.RankName Taxon_RankName ,
  t.TaxonName Taxon_TaxonName ,
  t.Author Taxon_Author ,
  n.vernacularname_dk Taxon_vernacularname_dk ,
  t.parent_id Taxon_parent_id ,
  t.accepted_id Taxon_accepted_id,
  t2.FullName Recorded_as_FullName,
  t2._id Recorded_as_id,
  r.status Taxon_redlist_status  
FROM  (Determination d JOIN Taxon t2
ON  t2._id=d.taxon_id JOIN Taxon t ON t2.accepted_id=t._id LEFT JOIN TaxonDKnames n ON t.vernacularname_dk_id = n._id) LEFT JOIN CurrentRedListStatus r ON r.taxon_id=t._id;



CREATE VIEW DeterminationView2 AS SELECT 
d._id as Determination_id ,
d.createdAt as Determination_createdAt ,
d.updatedAt as Determination_updatedAt ,
d.observation_id as Determination_observation_id ,
d.taxon_id as Determination_taxon_id ,
d.user_id as Determination_user_id ,
d.confidence as Determination_confidence ,
d.score as Determination_score ,
d.validation as Determination_validation ,
d.notes as Determination_notes ,
d.validatorremarks as Determination_validatorremarks ,
d.validator_id as Determination_validator_id ,
d.verbatimdeterminator as Determination_verbatimdeterminator ,
t._id as Taxon_id ,
 t.createdAt Taxon_createdAt ,
  t.updatedAt Taxon_updatedAt ,
  t.Path Taxon_Path ,
  t.SystematicPath Taxon_SystematicPath ,
  t.Version Taxon_Version ,
  t.FullName Taxon_FullName ,
  t.GUID Taxon_GUID ,
  t.FunIndexTypificationNumber Taxon_FunIndexTypificationNumber ,
  t.FunIndexCurrUseNumber Taxon_FunIndexCurrUseNumber ,
  t.FunIndexNumber Taxon_FunIndexNumber ,
  t.RankID Taxon_RankID ,
  t.RankName Taxon_RankName ,
  t.TaxonName Taxon_TaxonName ,
  t.Author Taxon_Author ,
  n.vernacularname_dk Taxon_vernacularname_dk ,
  t.parent_id Taxon_parent_id ,
  t.accepted_id Taxon_accepted_id,
  t2.FullName Recorded_as_FullName,
  t2._id Recorded_as_id,
  r.status Taxon_redlist_status,
  cv1.CharacterID IS NOT NULL as mycorrhizal,
  cv2.CharacterID IS NOT NULL as lichenized,
  cv3.CharacterID IS NOT NULL as parasite,
  cv4.CharacterID IS NOT NULL as saprobe,
  cv5.CharacterID IS NOT NULL as on_lichens,
  cv6.CharacterID IS NOT NULL as on_wood
FROM  (Determination d JOIN Taxon t2
ON  t2._id=d.taxon_id JOIN Taxon t ON t2.accepted_id=t._id LEFT JOIN TaxonDKnames n ON t.vernacularname_dk_id = n._id 
LEFT JOIN CharacterView cv1 ON (t._id = cv1.taxon_id AND cv1.CharacterID = 381) 
LEFT JOIN CharacterView cv2 ON (t._id = cv2.taxon_id AND cv2.CharacterID = 380)
LEFT JOIN CharacterView cv3 ON (t._id = cv3.taxon_id AND cv3.CharacterID = 382)
LEFT JOIN CharacterView cv4 ON (t._id = cv4.taxon_id AND cv4.CharacterID = 385)
LEFT JOIN CharacterView cv5 ON (t._id = cv5.taxon_id AND cv5.CharacterID = 404)
LEFT JOIN CharacterView cv6 ON (t._id = cv6.taxon_id AND cv6.CharacterID = 412)
) LEFT JOIN CurrentRedListStatus r ON r.taxon_id=t._id ;



