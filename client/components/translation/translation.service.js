'use strict';

angular.module('svampeatlasApp')
	.config(function($translateProvider) {

		$translateProvider.translations('en', {
			
			'Danmarks svampeatlas': 'Atlas of Danish Fungi',
			'internetstedet hvor du kan deltage i kortlægningen af Danmarks svampe': 'participate in the mapping of the fungi of Denmark and Europe',
			'Dansk navn': 'Danish name',
			'DK name:': 'Danish name:',
			'biotrof': 'biotroph',
			'lavdanner': 'lichen',
			'ektomykorrhizadanner': 'ectomycorrhizal',
			'biotrof parasit': 'biotroph parasite',
			'symbiotisk med insekter': 'symbiotic with insects',
			'endofyt i alger': 'endofyte in algae',
			'endofyt i planter': 'endofyte in plants',
			'nedbryder (inkl. nekrotrof)': 'decomposer (incl. necrotroph)',
			'Forkert password og/eller initialer.': 'Wrong password or initials.',
			'Nyt fund': 'New sighting',
			'Profil': 'User profile',
			'Fund': 'Sightings',
			'fund': 'sightings',
			'Søg fund': 'Search sightings',
			'Mine fund': 'My sightings',
			'Søg i Svampeatlas': 'Search the Atlas of Fungi',
			'Søgeformular': 'Search form',
			'Seneste 3 dage': 'Past 3 days',
			'Seneste 7 dage': 'Past 7 days',
			'Om svampeatlas': 'About the Atlas of Fungi',
			'Nyheder': 'News',
			'Indstillinger': 'Settings',
			'Inkludér udenlandske fund': 'Include non-danish sightings',
			'Søg i familier, ordener osv.': 'Search families, orders etc.',
			'Søg efter slægt, familie, orden etc.': 'Search for genus, family, order etc.',
			'Danske navne': 'Danish names',
			'Rødlistestatus': 'Red list status',
			'Databasenummer': 'Database id',
			'Latinsk navn': 'Latin name',
			'Finder': 'Found by',
			'Lokalitet': 'Locality',
			'Resultat i liste': 'Result as list',
			'Resultat på kort': 'Result on a map',
			'Initialer': 'Initials',
			'Søg': 'Search',
			'Dato': 'Date',
			'Art': 'Species',
			'Poster pr side': 'Records / page',
			'Fra dato': 'From date',
			'Til dato': 'To date',
			'Livsstrategi': 'Life strategy',
			'Søg på kort': 'Search on map',
			'Forsvundet': 'Regionally extinct',
			'Kritisk truet': 'Critically endangered',
			'Moderat truet': 'Endangered',
			'Sårbar': 'Vulnerable',
			'Næsten truet': 'Near threatened',
			'Ikke truet': 'Least concern',
			'Utilstrækkelige data': 'Data deficient',
			'Ikke mulig': 'Not possible',
			'Ikke bedømt': 'Not evaluated',
			'Alle rødlistede': 'All redlisted',
			'Ældre fund afventer': 'Old records on hold',
			'Alle': 'All',
			'Godkendte': 'Accepted',
			'Valideres': 'To be validated',
			'Afventer': 'Validation in progress',
			'Afviste': 'Rejected',
			'Dette fund er under godkendelse og bør ikke refereres før det er godkendt': 'This sighting is under review and should not be referenced before it has been accepted',
			'Dette fund er på de givne oplysninger afvist da bestemmelsen er for usikker': 'This sighting has been rejected based on the information given since the identification is too uncertain',
			'Henter': 'Fetching',
			'Kun de første 50000 vises på kortet, prøv evt. at afgrænse din søgning yderligere.': 'Only the first 50000 records is shown on the map, try narrowing your search further.',
			'Din søgning gav': 'Your search returned',
			'resultater': 'records',
			'Ret fund': 'Edit record',
			'Vis mere': 'Show sighting',
			'Finder(e)': 'Found by',
			'Bestemmer': 'Determined by',
			'Vært/mykorrhizapartner': 'Host/mycorrhizal partner',
			'Substrat': 'Substrate',
			'Vegetationstype': 'Vegetation type',
			'Kollektionsnummer': 'Collection number',
			'Herbarium': 'Herbarium',
			'Økologi-kommentarer': 'Ecology comments',
			'Bemærkninger': 'Remarks',
			'Intern note': 'Internal note',
			'Kommentarer': 'Comments',
			'Skriv kommentar': 'Write a comment',
			'Præcision': 'Precision',
			'Skriv art': 'Type species name',
			'Obligatorisk': 'Mandatory',
			'Skriv vært': 'Type host',
			'Udvidet værtssøgning': 'Extended host search',
			'Tilføj finder(e)': 'Add collector(s)',
			'Træk billeder hertil': 'Drag images here',
			'Nulstil dato og lokalitet': 'Reset date and locality',
			'Klargør foto, et øjeblik ...': 'Preparing photo, plaese wait ...',
			'Positionsinformation er ikke tilgængelig.': 'Position information not accessible.',
			'Time out i bestemmelse af position.': 'Time out in determination of position.',
			'Der opstod en ukendt fejl med betemmelse af position.': 'Unknown error in determination of position.',
			'Du skal give enheden lov til at bruge din position.': 'You must allow the device to access your position.',
			'Chrome browseren tillader ikke brug af position fra ikke-krypterede sider. Anvend i stedet': 'The chrome browser blocks use of position from unencrypted pages. Try',
			'eller': 'or',
			'Bestemmer din position ...': 'Determining position ...',
			'Kort': 'Map',
			'DK 4cm kort': 'DK Topo Map',
			'DK luftfoto': 'DK imagery',
			'Antal fund': 'Number of sightings',
			'Artsliste': 'Species list',
			'Ingen data fundet': 'No results',
			'Hvad findes her?': 'Species found here',
			'Kun rødlistede': 'Only redlisted',
			'Altid': 'Any time',
			'I år': 'This year',
			'Seneste to uger': 'Past two weeks',
			'Foto slettet': 'Image deleted',
			'Foto usynligt på taxonside': 'Image hidden on taxon page',
			'Foto synligt på taxonside': 'Image shown on taxon page',
			'Kun mine fund': 'Only my sightings',
			'Søg kun i danske arter': 'Search only danish species',
			'Vejledninger': 'Tutorials',
			'Projektbeskrivelse': 'Project description',
			'Kun udenlandske fund': 'Exclude sightings from Denmark',
			'Vil du slette': 'Do you want to delete',
			'Fundet og alle tilhørende data vil blive permanent slettet fra databasen.': 'The record and all related data will be permanently deleted from the database.',
			'Slet fund': 'Delete record',
			'Slet': 'Delete',
			'Fortryd': 'Cancel',
			'Record': 'Record',
			'slettet.': 'deleted.',
			'Danske arter': 'Danish checklist',
			'Checkliste for danske arter': 'Checklist of Danish fungi',
			'Udfør': 'Execute',
			'Syn. til': 'Syn. of',
			'Rapportør': 'Reported by',
			'Skriv art/slægt': 'Type species/genus',
			'Skriv familie, orden etc': 'Type family, order etc',
			'Art / taxon': 'Species / taxon',
			'Geografi': 'Geography',
			'Tid': 'Time',
			'Økologi': 'Ecology',
			'Personer': 'Involved persons',
			'Ikke mine fund': 'Exclude my sightings',
			'Andre har kommenteret efter mig': 'Others have commented after me',
			'Kun kommenterede fund': 'Only sightings with comments',
			'Eksakt dato': 'Exact date',
			'Siden dato': 'Since date',
			'Fra år': 'From year',
			'Til år': 'To year',
			'Måneder': 'Months',
			'dage': 'days',
			'Funddato': 'Sighting date',
			'Fund indlagt': 'Submitted date',
			'Kun fund med billeder': 'Only sightings with images',
			'Fundegenskaber': 'Sighting properties',
			'tilføjet som finder': 'added as finder',
			'fjernet fra findere': 'removed from finders',
			'Forum-kommentar indeholder:': 'Forum comment contains:',
			'Ikke afviste': 'Not rejected',
			'Arter fundet i Danmark': 'Species found in Denmark',
			'Fund rapporteret': 'Sightings reported',
			'Lande rapporteret fra': 'Countries reported from',
			'Kommentarer i forum': 'Comments in forum',
			'Fotos': 'Photos',
			'Arter fundet pr år': 'Species found pr year',
			'Taksonomisk profil': 'Taxonomic profile',
			'Rang': 'Rank',
			'Arter': 'Species',
			'Års første fund': 'First yearly findings',
			'Statistik': 'Statistics',
			'Du har' : 'You have',
			'med nye kommentarer seneste' : 'with comments since',
			'Mine rapporteringer' : 'My reportings',
			'Bruger' : 'User',
			'Ubestemt svamp' : 'Undetermined fungus',
			'Indlagt' : 'Submitted',
			'Kopier funddata til udklipsholder' : 'Copy data to clipboard',
			'Klon fund' : 'Clone record',
			'Del fund' : 'Share',
			'Dette fund er valideret og godkendt af' : 'This sighting is validated and accepted by',
			'Kopier link' : 'Copy link',
			'klassifikation' : 'classification',
			'Klassifikation' : 'Classification',
			'Bygger' : 'Building',
			'Gendan' : 'Rebuild',
			'Bestemmelshjul' : 'Identification circles',
			'I dag' : 'Today',
			'Udenlandske fund': 'Global sightings',
			'Svampebog' : 'Fungi book',
			'klonet fra': 'cloned from',
			'Mine feltture': 'My fieldtrips',
			'Du har nu klonet' : 'You have cloned',
			'Husk at gemme det klonede fund før du lukker dette vindue.' : 'Remember to save the cloned sighting before closing this window.',
			'Afvis' : 'Reject',
			'Ombestem' : 'Redetermine',
			'Ret bestemmelse' : 'Edit determination',
			'Godkend' : 'Accept',
			'Ved' : 'Wood',
			'Plantemateriale' : 'Plant material',
			'Mosser' : 'Mosses',
			'Dyr' : 'Animals',
			'Svampe og svampedyr': 'Fungi and mycetozoans',
			'Sten' : 'Stone',
			'Kalender' : 'Calendar',
			'Åbn kalender' : 'Open calendar',
			'Ikke kendt fra Danmark' : 'Not known from Denmark',
			'Kommentarer til fundet' : 'Comments for the sighting',
			'Aktuel søgning:' : 'Current search:',
			'Gem søgning': 'Save search',
			'Gemte søgninger' : 'Saved searches',
			'Usikkerhed større end (meter)': 'Uncertainty greater than (meters)',
			'Usikkerhed mindre end (meter)': 'Uncertainty less than (meters)',
			'Datakilde' : 'Data source',
			'Koordinat' : 'Coordinate',
			'Kommune' : 'Municipality',
			'Forvekslingsmulighed til' : 'Similar taxon to',
			'Dansk' : 'Danish',
			'Engelsk' : 'English',
			'Gem' : 'Save',
			'Komma som separator' : 'Comma as separator',
			'Semikolon som separator' : 'Semicolon as separator',
			'Kopier kort fundreference' : 'Copy short sighting reference',
			'Udskriv kapsel' : 'Print capsule',
			'Vis flere' : 'Show more',
			'Galleri' : 'Gallery',
			'Mit galleri' : 'My gallery',
			'Vis inputfelter til Lat/Lon'  : 'Show input fields for Lat/Lng',
			'som er valideret eller ombestemt seneste' : 'validated or re-determined since',
			'oprettet af' : 'created by',
			'regn.' : 'Kingdom',
			'phyl.' : 'Phylum',
			'subphyl.' : 'Subphylum',
			'class.' : 'Class',
			'subclass.' : 'Subclass',
			'ord.' : 'Order',
			'fam.' : 'Family',
			'gen.' : 'Genus',
			'sp.' : 'Species',
			'var.' : 'Variety',
			'Det er helt sikkert denne' : 'It is certainly this',
			'Det er sandsynligvis denne' : 'It is most likely this',
			'Det er muligvis denne' : 'It may be this',
			'Bestemmelser' : 'Determinations',
			'Foreslå bestemmelse' : 'Propose determination',
			'Hvor sikker er du?' : 'How certain are you?',
			'Luk': 'Close',
			'er allerede blevet foreslået.' : 'has already been proposed',
			'Denne' : 'This',
			'Foreslå bestemmelse til' : 'Propose determination of',
			'Note til bestemmelsen' : 'Notes about this determination',
		
			'Vælg billeder': 'Choose images',
			'Gem fund' : 'Save sighting',
			'af' : 'by',
			'VALIDATION_STATUS_EXPERT': 'expert approved',
			'VALIDATION_STATUS_COMMUNITY_LEVEL_3': 'approved',
			'VALIDATION_STATUS_COMMUNITY_LEVEL_2': 'probable',
			'VALIDATION_STATUS_COMMUNITY_LEVEL_1': 'a suggestion',
			'Dette fund er': 'This sighting is',
			'Bestemmelsen er': 'The identification is',
			'Validering' : 'Validation',
			'Bestemmelsen blev slettet': 'The identification was deleted',
			'Der kan kun downloades CSV filer med op til 10000 poster. Prøv at indsnævre din søgning.' : 'Download of CSV data is restricted to 10000 rows. Please narrow your search.',
		  'num_users' : 'Number of reporters', 
		  'num_obs' : 'Number of observations', 
		  'num_days' : 'Number of field days', 
		  'num_years' : 'Number of years', 
		  'num_species' : 'Number of species',
			'UTM Felt': 'UTM Field',
			'UTM felter': 'UTM fields',
			'Henter artsliste' : 'Fetching species list',
			'Farvelæg felter efter': 'Color fields by',
			'Klik på et felt for at se info' : 'Click a field to see info',
			'Jeg er alligevel ikke enig i bestemmelsen' : 'Withdraw vote on this determination',
			'Jeg er enig i bestemmelsen' : 'I agree on this determination',
			'Vis kun laver i søgninger' : 'Show only Lichens in searches',
			'numberofobservations' : 'Effort of the year',
			'pioneerredlisted' : 'Hit hunter of the year',
			'speciescount' : 'Most species',
			'highjumper' : 'High jumper of the year',
			'numberofmobileobservations' : 'Mobile reporter of the year',
			'numberofarchiveobservations' : 'Archiver of the year',
			'pioneer' : 'Pioneer of the year',
			'Konkurrencer' : 'Competitions',
			'Hjælp med at validere fund' : 'Participate in the identification',
			'Filtrér til artsgruppe(r)' : 'Filter to species group(s)',
			'Samarbejdspartnere': 'Partners',
			'Seneste aktivitet' : 'Latest activity',
			'Fund i dag' : 'Sightings today',
			'Seneste uge' : 'Past week',
			'Nyheder fra svampeatlas' : 'News from the Atlas of Danish Fungi',
			'Opdatér' : 'Refresh',
			'Bestemmelsens sikkerhed ændret til' : 'Identification certainty changed to',
			'mulig' : 'possible',
			'sandsynlig' : 'likely',
			'sikker' : 'certain',
			'Bestemmelsens sikkerhed' : 'Identification certainty',
			'Antal stemmer' : 'Number of votes',
			'Nuværende bestemmelse' : 'Current identification',
			'Ny bestemmelse' : 'New identification',
			'Nyt password' : 'New password',
			'Gentag nyt password' : 'Repeat new password',
			'Gem nyt password' : 'Save new password',
			'Der er sendt en email til': 'An email has been sent to',
			'Gentag password' : 'Repeat password',
			'Opret brugerprofil' : 'Create user account',
			'Din notifikation er sendt til validator': 'Your notification has been sent to a validator',
			'Kontakt validator angående' : 'Contact validator regarding',
			'Brug denne kontaktformular hvis du mener der er behov for at en validator vurderer denne observation.': 'Use this contact form if you think a validator needs to evaluate this observation.',
			'Skriv besked til validator' : 'Write a message to the validator',
			'Send besked til validator' : 'Send message to the validator',
			'Kontakt validator' : 'Contact validator',
			'Skriv art, slægt, familie, orden etc' : 'Type species, genus, family, order etc',
			'Antal danske fund' : 'Number of Danish records',
			'Seneste danske fund' : 'Latest Danish record',
			'nulstil' : 'reset',
			'Fjern fra forsiden' : 'Remove from frontpage',
			'På forsiden i 30 dage' : 'On the front page 30 days',
			'På forsiden i 7 dage' : 'On the front page 7 days',
			'Der findes' : 'There are',
			'bestemmelsesforslag' : 'identification suggestions',
			'Fund til validering' : 'Pending validation',
			'vis art' : 'show species',
			'Se alle til validering' : 'See all pending validation'
			
			
		});
		

		$translateProvider.translations('dk', {
			
			'Logout': 'Log ud',
			'Home': 'Hjem',
			'Search taxa': 'Søg taxa',
			'Taxon tree': 'Taxon træ',
			'Red List': 'Rødliste',
			'Book layout': 'Boglayout',
			'Add new taxon': 'Tilføj nyt taxon',
			'Find species, varietes and forms under selected higher taxa:': 'Find arter, varieteter og former under valgte højere taxa:',
			'Omit synonyms': 'Udelad synonymer',
			'Only DK taxa': 'Kun danske taxa',
			'Find orphant taxa': 'Find forældreløse taxa',
			'Found': 'Fandt',
			'Enter higher taxon': 'Skriv højere taxon',
			'Full name': 'Fulde navn',
			'Full Name:': 'Fulde navn:',
			'Taxon Name / epithet:': 'Taxon-navn / epitet:',
			'Name / Epithet': 'Navne / Epitet',
			'Author': 'Autor',
			'Author:': 'Autor:',
			'Author(s)': 'Autor(er)',
			'Examples of Fullname / Taxon name combinations:': 'Eksempler på Fulde navn / Taxon-navn kombinationer:',
			'Epithet': 'Epitet',
			'Taxon rank': 'Taxon-rang',
			'Taxon rank:': 'Taxon-rang:',
			'Present in DK': 'Til stede i DK',
			'DK name:': 'Dansk navn:',
			'Maps, graphs from atlas': 'Kort og grafer fra atlas',
			'Similar species': 'Lignende arter',
			'Close': 'Luk',
			'Open in new tab': 'Åbn i ny tab',
			'Make into synonym': 'Gør til synonym',
			'Save taxon': 'Gem taxon',
			'Nature types': 'Naturtyper',
			'Images': 'Billeder',
			'Parent taxon': 'Forældre-taxon',
			'Change parent taxon': 'Ændr forældre-taxon',
			'Make taxon synonym of:': 'Gør taxon til synonym til:',
			'Possible synonym!': 'Muligt synonym!',
			'This taxon may be a synonym of': 'Dette taxon er måske et synonym til',
			'this taxon': 'dette taxon',
			'on Index Fungorum.': 'på Index Fungorum.',
			'Full taxon name': 'Fulde taxon navn',
			'Enter taxon name/epithet': 'Skriv taxon navn/epitet',
			'View on Index Fungorum': 'Se på Index Fungorum',
			'Suggested parent taxon': 'Foreslået forældre-taxon',
			'Please review this and change it if neccesary': 'Dette bør reviewes og ændres hvis nødvendigt',
			'No parent taxon selected': 'Intet forældre-taxon valgt',
			'Please select a parent taxon before saving': 'Vælg et forældre-taxon for du gemmer',
			'Set parent taxon': 'Brug forældre-taxon',
			'Child taxa': 'Børne-taxa',
			'accepted': 'accepteret',
			'synonyms': 'synonymer',
			'History log': 'Historik',
			'Usage': 'Brug',
			'The preferred way of creating a new taxon is importing it from': 'Den foretrukne måde at oprette et nyt taxon på, er at importere det fra',
			'Alternatively it can be imported from': 'Alternativt kan det importeres fra',
			'There can be reasons to create taxa manually, for example super species and super genera should always be created using the \'Manual\' option': 'Der kan være gode grunde til at oprette taxa manuelt, f.eks skal superarter (s. lato, clades etc) oftest oprettes ved klik på \'Manuel\'',
			'Manual': 'Manuel',
			'Choose parent taxon': 'Vælg forældre-taxon',
			'Add search terms on attributes': 'Tilføj søgetermer på attributter',
			'Extended search': 'Udvidet søgning',
			'Search redlist categories': 'Søg rødlistekategorier',
			'Search tags': 'Søg tags',
			'Enter tags': 'Skriv tags',
			'Enter tag': 'Skriv tag',
			'Enter characters': 'Skriv karakterer',
			'Enter character': 'Skriv karakter',
			'Attribute name': 'Attribut navn',
			'Reset search': 'Nulstil',
			'Raise rank to': 'Ophøj til',
			'superspecies': 'superart',
			'supergenus': 'superslægt',
			'Detach': 'Afkobl',
			'Change': 'Ændr',
			'Initials': 'Initialer',
			'Mycokey characters': 'Mycokey karakterer',
			'Number of species recorded in Denmark:': 'Antal arter i Danmark:',
			'Import mycokey characters from taxon': 'Importér mycokey karakterer fra taxon',
			'Password successfully changed.': 'Dit password blev opdateret.',
			'User profile': 'Brugerprofil',
			'Name:': 'Navn:',
			'Initials:': 'Initialer:',
			'Save changes': 'Gem ændringer',
			'Password must be at least 3 characters.': 'Dit password skal være mindst 3 karakterer.',
			'Current Password': 'Nuværende password',
			'New Password': 'Nyt password',
			'Change password': 'Skift password',
			'No Facebook account detected.': 'Ingen Facebook konto fundet.',
			'Login with credentials, then goto user profile and connect your Facebook account.': 'Log ind med initialer og password, gå derefter til "profil" og forbind din Facebook konto',
			'Please try again later. If the problem persists, contact the system administrator.': 'Prøv venligst igen senere. Kontakt venligst systemadministratoren hvis problemet vedbliver.',
			'A server error has occurred': 'Der er sket en serverfejl',
			'Type here': 'Skriv her',
			'Operation succeeded.': 'Handlingen blev udført.',
			'Add': 'Tilføj',
			'Remove': 'Fjern',
			'Action': 'Handling',
			'Batch add/remove': 'Batch tilføj/fjern',
			'Phylum': 'Række',
			'Class': 'Klasse',
			'Order': 'Orden',
			'Family': 'Familie',
			'Genus': 'Slægt',
			'species recorded in Denmark' : 'arter fundet i Danmark',
			'regn.' : 'Rige',
			'phyl.' : 'Række',
			'subphyl.' : 'Underrække',
			'class.' : 'Klasse',
			'subclass.' : 'Underklasse',
			'ord.' : 'Orden',
			'fam.' : 'Familie',
			'gen.' : 'Slægt',
			'sp.' : 'Art',
			'var.' : 'Varietet',
			'Kopier link' : 'Kopiér link',
			'Not allowed' : 'Ikke tilladt',
			'Your request cannot be fullfilled.': 'Handlingen kan ikke fuldføres',
			'Similar Taxa' : 'Forvekslingsmuligheder',
			'Add similar taxon' : 'Tilføj forvekslingsmulighed',
			'Add search terms on statistics' : 'Tilføg søgetermer på statistik',
			'Statistics name' : 'Statistik navn',
			'VALIDATION_STATUS_EXPERT': 'ekspert-godkendt',
			'VALIDATION_STATUS_COMMUNITY_LEVEL_3': 'godkendt',
			'VALIDATION_STATUS_COMMUNITY_LEVEL_2': 'sandsynlig',
			'VALIDATION_STATUS_COMMUNITY_LEVEL_1': 'et forslag',
			'Dashboard': 'Min side',
			'You are not allowed to vote on your own identifications':  'Du kan ikke stemme på dine egne bestemmelser',
			'Downvote authorization missing' : 'Du har ikke rettighed til at nedstemme',
			'Morpho group': 'Morfo-gruppe',
			'Morpho groups': 'Morfo-grupper',
			'Morpho group missing': 'Morfo-gruppe mangler',
			'Login' : 'Log ind',
			'Sign up': 'Tilmeld',
		  'num_users' : 'Antal rapportører', 
		  'num_obs' : 'Antal observationer', 
		  'num_days' : 'Antal feltdage', 
		  'num_years' : 'Antal år', 
		  'num_species' : 'Antal arter',
			'numberofobservations' : 'Årets slider',
			'pioneerredlisted' : 'Årets hitjæger',
			'speciescount' : 'Flest arter',
			'highjumper' : 'Årets højdespringer',
			'numberofmobileobservations' : 'Årets mobilrapportør',
			'numberofarchiveobservations' : 'Årets arkivar',
			'pioneer' : 'Årets fornyer',
			'Password confirmation must match' : 'De to passwords skal være ens',
			'Activating account' : 'Aktiverer brugerprofil',
			'Account activated succesfully' : 'Brugerprofil aktiveret',
			'Account activation failed': 'Aktivering af brugerprofil mislykkedes',
			'Click to login' : 'Klik for at logge ind',
			'There was an error activating your account. The link might have expired.' : 'Der opstod en fejl under aktivering af din profil. Måske er linket udløbet.',
			'Create user account' : 'Opret brugerprofil',
			'Name' : 'Navn',
			'A name is required' : 'Navn er obligatorisk',
			'Too long (max 5 characters)': 'For langt (max 5 karakterer)',
			'Too short (min 2 characters)': 'For kort (min 2 karakterer)',
			'Initials are required' : 'Initialer er obligatisk',
			'Checking if these initials is available...' : 'Checker om disse initialer er ledige...',
			'These initials is already taken!' : 'Disse initialer er optaget!',
			'Doesnt look like a valid email.' : 'Ligner ikke en gyldig email',
			'Enter your email address.' : 'Indtast din email adresse',
			'Checking if this email is already in use...' : 'Checker om denne email allerede er i brug...',
			'This email is already in use!' : 'Denne email er allerede i brug!',
			'Lost password?' : 'Har du mistet dit password?',
			'Password must be at least 6 characters.' : 'Dit password skal være på mindst 6 tegn.',
			'An email has been sent to' : 'Der er sendt en email til',
			'The email contains further instructions on how to activate your account' : 'Emailen indeholder yderligere information om hvordan du aktiverer din brugerprofil.',
			'UTM northing' : 'UTM nord',
			'UTM easting' : 'UTM øst',
			'Password must be at least 7 characters' : 'Dit password skal være mindst 7 karakterer langt'
			


		});


		//  $translateProvider.preferredLanguage('dk');


	});
