'use strict';

angular.module('svampeatlasApp')
  .config(function ($translateProvider) {
	  
	  $translateProvider.translations('en', {
	      'Danmarks svampeatlas': 'Atlas of Danish Fungi',
		  'internetstedet hvor du kan deltage i kortlægningen af Danmarks svampe' : 'participate in the mapping of the fungi of Denmark and Europe',
		  'Dansk navn' : 'Danish name',
		  'DK name:': 'Danish name:',
		  'biotrof': 'biotroph',
		  'lavdanner' : 'lichen',
		  'ektomykorrhizadanner': 'ectomycorrhizal',
		  'biotrof parasit' : 'biotroph parasite',
		  'symbiotisk med insekter': 'symbiotic with insects',
		  'endofyt i alger': 'endofyte in algae',
		  'endofyt i planter': 'endofyte in plants',
		  'nedbryder (inkl. nekrotrof)' : 'decomposer (incl. necrotroph)',
		  'Forkert password og/eller initialer.' : 'Wrong password or initials.',
		  'Nyt fund' : 'New sighting',
		  'Profil' : 'User profile',
		  'Fund' : 'Sightings',
		  'Søg fund' : 'Search sightings',
		  'Mine fund' : 'My sightings',
		  'Søg i Svampeatlas' : 'Search the Atlas of Fungi',
		  'Søgeformular' : 'Search form',
		  'Seneste 3 dage' : 'Past 3 days',
		  'Seneste 7 dage' : 'Past 7 days',
		  'Om svampeatlas' : 'About the Atlas of Fungi',
		  'Nyheder' : 'News',
		  'Indstillinger' : 'Settings',
		  'Inkludér udenlandske fund' : 'Include foreign findings',
		  'Søg i slægter, familier, ordener osv.' : 'Search genera, families, orders etc.',
		  'Danske navne' : 'Danish names',
		  'Rødlistestatus' : 'Red list status',
		  'Databasenummer' : 'Database id',
		  'Latinsk navn' : 'Latin name',
		  'Finder' : 'Found by',
		  'Lokalitet' : 'Locality',
		  'Resultat i liste' : 'Result as list',
		  'Resultat på kort' : 'Result on a map',
		  'Initialer' : 'Initials',
		  'Søg' : 'Search',
		  'Dato' : 'Date',
		  'Art' : 'Species',
		  'Poster pr side' : 'Records / page',
		  'af' : 'of',
		  'Mine aktive tråde' : 'My active threads',
		  'Fra dato': 'From date' ,
		  'Til dato': 'To date',
		  'Livsstrategi' : 'Life strategy',
		  'Søg på kort' : 'Search on map',
		     'Forsvundet' :'Regionally extinct',
		     'Kritisk truet' : 'Critically endangered',
		     'Moderat truet' :'Endangered' ,
		     'Sårbar' : 'Vulnerable',
		     'Næsten truet' : 'Near threatened' ,
		     'Ikke truet' : 'Least concern',
		     'Utilstrækkelige data' : 'Data deficient',
		    'Ikke mulig' : 'Not possible',
		     'Ikke bedømt' : 'Not evaluated' ,
		  'Alle rødlistede' : 'All redlisted',
		  'Ældre fund afventer' : 'Old records on hold',
		  'Alle' : 'All',
		  'Godkendte':'Accepted',
		  'Valideres': 'To be validated',
		  'Afventer' : 'Validation in progress',
		  'Afviste' : 'Rejected',
		  'Dette fund er under godkendelse og bør ikke refereres før det er godkendt' : 'This sighting is under review and should not be referenced before it has been accepted',
		  'Dette fund er på de givne oplysninger afvist da bestemmelsen er for usikker' : 'This sighting has been rejected based on the information given since the determintaion is too uncertain',
		  'Henter' : 'Fetching',
		  'Kun de første 50000 vises på kortet, prøv evt. at afgrænse din søgning yderligere.' : 'Only the first 50000 records is shown on the map, try narrowing your search further.',
		  'Din søgning gav': 'Your search returned',
		  'resultater' : 'records',
		  'Ret fund' :'Edit sighting',
		  'Vis mere' : 'Show sighting',
		  'Finder(e)' : 'Found by',
		  'Bestemmer': 'Determined by',
		  'Vært/mykorrhizapartner' : 'Host/mycorrhizal partner',
		  'Substrat' : 'Substrate',
		  'Vegetationstype' : 'Vegetation type',
		  'Kollektionsnummer' : 'Collection number',
		  'Herbarium' : 'Herbarium',
		  'Økologi-kommentarer' : 'Ecology comments',
		  'Bemærkninger': 'Remarks',
		  'Intern note' : 'Internal note',
		  'Kommentarer' : 'Comments',
		  'Skriv kommentar' : 'Write a comment',
		  'Præcision' : 'Precision',
		  'Skriv art' : 'Type species name',
		  'Obligatorisk' : 'Mandatory',
		  'Skriv vært' : 'Type host',
		  'Udvidet værtssøgning' : 'Extended host search',
		  'Tilføj finder(e)' : 'Add collector(s)',
		  'Træk billeder hertil' : 'Drag images here',
		  'Nulstil dato og lokalitet' : 'Reset date and locality',
		  'Klargør foto, et øjeblik ...' : 'Preparing photo, plaese wait ...',
		  'Positionsinformation er ikke tilgængelig.' : 'Position information not accessible.',
		  'Time out i bestemmelse af position.' : 'Time out in determination of position.',
		  'Der opstod en ukendt fejl med betemmelse af position.'	: 'Unknown error in determination of position.',
		  'Du skal give enheden lov til at bruge din position.' : 'You must allow the device to access your position.',
		  'Chrome browseren tillader ikke brug af position fra ikke-kryperede sider. Anvend i stedet' : 'The chrome browser blocks use of position from unencrypted pages. Try',
		  'eller' : 'or',
		  'Bestemmer din position ...' : 'Determining position ...',
		  'Kort' : 'Map',
		  'DK 4cm kort'	: 'DK Topo Map',
		  'DK luftfoto' : 'DK imagery'  ,
		  'Antal fund' : 'Number of sightings',
		  'Artsliste' : 'Species list',
		  'Ingen data fundet' : 'No results',
		  'Hvad findes her?' : 'Species found here',
		  'Kun rødlistede': 'Only redlisted',
		  'Altid' : 'Any time',
		  'I år': 'This year',
		  'Seneste to uger': 'Past two weeks'		           
		  
		  
	    });
	  
  	  $translateProvider.translations('dk', {
		  'Logout' : 'Log ud',
  	      'Home' : 'Hjem',
		  'Search taxa' : 'Søg taxa',
		  'Taxon tree' : 'Taxon træ',
		  'Red List' : 'Rødliste',
		  'Book layout' : 'Boglayout',
		  'Add new taxon': 'Tilføj nyt taxon',
		  'Find species, varietes and forms under selected higher taxa:': 'Find arter, varieteter og former under valgte højere taxa:',
		  'Omit synonyms': 'Udelad synonymer',
		  'Only DK taxa': 'Kun danske taxa',
		  'Find orphant taxa' : 'Find forældreløse taxa',
		  'Found':'Fandt',
		  'Enter higher taxon' : 'Skriv højere taxon',
		  'Full name' : 'Fulde navn',
		  'Full Name:': 'Fulde navn:',
		  'Taxon Name / epithet:': 'Taxon-navn / epitet:',
		  'Name / Epithet': 'Navne / Epitet',
		  'Author': 'Autor',
		  'Author:': 'Autor:',
		  'Author(s)':'Autor(er)',
		  'Examples of Fullname / Taxon name combinations:':'Eksempler på Fulde navn / Taxon-navn kombinationer:',
		  'Epithet' : 'Epitet',
		  'Taxon rank' : 'Taxon-rang',
		  'Taxon rank:': 'Taxon-rang:',
		  'Present in DK': 'Til stede i DK',
		  'DK name:' : 'Dansk navn:',
		  'Maps, graphs from atlas': 'Kort og grafer fra atlas',
		  'Similar species' : 'Lignende arter',
		  'Close' : 'Luk',
		  'Open in new tab' : 'Åbn i ny tab',
		  'Make into synonym': 'Gør til synonym',
		  'Save taxon': 'Gem taxon',
		  'Nature types': 'Naturtyper',
		  'Images': 'Billeder',
		  'Parent taxon' : 'Forældre-taxon',
		  'Change parent taxon': 'Ændr forældre-taxon',
		  'Make taxon synonym of:': 'Gør taxon til synonym til:',
		  'Possible synonym!' : 'Muligt synonym!',
		  'This taxon may be a synonym of': 'Dette taxon er måske et synonym til',
		  'this taxon' : 'dette taxon',
		  'on Index Fungorum.': 'på Index Fungorum.',
		  'Full taxon name' : 'Fulde taxon navn',
		  'Enter taxon name/epithet' : 'Skriv taxon navn/epitet',
		  'View on Index Fungorum' : 'Se på Index Fungorum',
		  'Suggested parent taxon' : 'Foreslået forældre-taxon',
		  'Please review this and change it if neccesary' : 'Dette bør reviewes og ændres hvis nødvendigt',
		  'No parent taxon selected': 'Intet forældre-taxon valgt',
		  'Please select a parent taxon before saving' : 'Vælg et forældre-taxon for du gemmer',
		  'Set parent taxon' : 'Brug forældre-taxon',
		  'Child taxa': 'Børne-taxa',
		  'accepted': 'accepteret',
		  'synonyms': 'synonymer',
		  'History log' : 'Historik',
		  'Usage' : 'Brug',
		  'The preferred way of creating a new taxon is importing it from' : 'Den foretrukne måde at oprette et nyt taxon på, er at importere det fra',
		  'Alternatively it can be imported from' : 'Alternativt kan det importeres fra',
		  'There can be reasons to create taxa manually, for example super species and super genera should always be created using the \'Manual\' option' : 'Der kan være gode grunde til at oprette taxa manuelt, f.eks skal superarter (s. lato, clades etc) oftest oprettes ved klik på \'Manuel\'',
		  'Manual' : 'Manuel',
		  'Choose parent taxon' : 'Vælg forældre-taxon',
		  'Add search terms on attributes': 'Tilføj søgetermer på attributter',
		  'Extended search': 'Udvidet søgning',
		  'Search redlist categories': 'Søg rødlistekategorier',
		  'Search tags': 'Søg tags',
		  'Enter tags': 'Skriv tags',
		  'Enter characters': 'Skriv karakterer',
		  'Attribute name': 'Attribut navn',
		  'Reset search': 'Nulstil',
		  'Raise rank to' : 'Ophøj til',
		  'superspecies': 'superart',
		  'supergenus': 'superslægt',
		  'Detach' : 'Afkobl',
		  'Change' : 'Ændr',
		  'Initials' : 'Initialer',
		  'Mycokey characters': 'Mycokey karakterer',
		  'Number of species recorded in Denmark:' : 'Antal arter i Danmark:',
		  'Import mycokey characters from taxon' : 'Importér mycokey karakterer fra taxon',
		  'Password successfully changed.' : 'Dit password blev opdateret.',
		  'User profile' : 'Brugerprofil',
		  'Name:' : 'Navn:',
		  'Initials:' : 'Initialer:',
		  'Save changes' : 'Gem ændringer',
		  'Password must be at least 3 characters.' : 'Dit password skal være mindst 3 karakterer.',
		  'Current Password' : 'Nuværende password',
		  'New Password' : 'Nyt password',
		  'Change password' : 'Skift password'
  	    });
	 
	
	  //  $translateProvider.preferredLanguage('dk');
	
	  
  });

  
