select (SELECT COUNT(ID) FROM Fungi) - ((SELECT COUNT(f.ID) FROM Fungi f, PlantTaxon p where f.associatedOrganism = p.DKname) +
(SELECT COUNT(f.ID) FROM Fungi f, PlantTaxon p where f.associatedOrganism = p.DKandLatinName) +
(SELECT COUNT(f.ID) FROM Fungi f, PlantTaxon p where f.associatedOrganism = p.LatinName));

-- 311477 mapper ikke direkte til planttaxon
-- 297589 har ingen host 
-- 13888 fund tilbage 

-- 250666 mappes utvetydigt
-- 3844 taxa har et komma i host felt, dette indikerer flere taxa
-- heraf kan der trækkes primært taxon for 3451, sekundært for 2434
 

--Primært taxon for dem med komma:
select (SELECT COUNT(ID) FROM Fungi f, PlantTaxon p WHERE associatedOrganism LIKE "%,%" AND SUBSTRING_INDEX(associatedOrganism, ", ", 1) = p.DKandLatinName) + (SELECT COUNT(ID) FROM Fungi f, PlantTaxon p WHERE associatedOrganism LIKE "%,%" AND SUBSTRING_INDEX(associatedOrganism, ", ", 1) = p.DKname) + (SELECT COUNT(ID) FROM Fungi f, PlantTaxon p WHERE associatedOrganism LIKE "%,%" AND SUBSTRING_INDEX(associatedOrganism, ", ", 1) = p.LatinName);

--Sekundært taxon for dem med komma:

select (SELECT COUNT(ID) FROM Fungi f, PlantTaxon p WHERE associatedOrganism LIKE "%,%" AND SUBSTRING_INDEX(associatedOrganism, ", ", -1) = p.DKandLatinName) + (SELECT COUNT(ID) FROM Fungi f, PlantTaxon p WHERE associatedOrganism LIKE "%,%" AND SUBSTRING_INDEX(associatedOrganism, ", ", -1) = p.DKname) + (SELECT COUNT(ID) FROM Fungi f, PlantTaxon p WHERE associatedOrganism LIKE "%,%" AND SUBSTRING_INDEX(associatedOrganism, ", ", -1) = p.LatinName);



klima ud
Jordbund ud


Fjern bark 
Slider 0-2 m
Slider helt frisk / pilråddent
Stående/liggende