'use strict';

angular.module('svampeatlasApp')
  .config(function ($translateProvider) {
	  
	  $translateProvider.translations('en', {
	      'Danmarks svampeatlas': 'Atlas of Danish Fungi',
	      'Dette er en paragraf' : 'This is a paragraph.',
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
		  'nedbryder (inkl. nekrotrof)' : 'decomposer (incl. necrotroph)'
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
		  'Present in DK': 'Tilstede i DK',
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
		  'Make into synonym': 'Gør til synonym',
		  'Full taxon name' : 'Fulde taxon navn',
		  'Enter taxon name/epithet' : 'Skriv taxon navn/epitet',
		  'View on Index Fungorum' : 'Se på Index Fungorum',
		  'Suggested parent taxon' : 'Forelået forældre-taxon',
		  'Please review this and change it if neccesary' : 'Dette bør reviewes og ændres hvis nødvendigt',
		  'No parent taxon selected': 'Intet forældre-taxon valgt',
		  'Please select a parent taxon before saving' : 'Vælg et forældre-taxon for du gemmer',
		  'Set parent taxon' : 'Brug forældre-taxon',
		  'Child taxa': 'Børne-taxa',
		  'accepted': 'accepteret',
		  'synonyms': 'synonymer',
		  'Images' : 'Billeder',
		  'Nature types' : 'Naturtyper',
		  'History log' : 'Historik',
		  'Usage' : 'Brug',
		  'The preferred way of creating a new taxon is importing it from' : 'Den foretrukne måde at oprette et nyt taxon på, er at importere det fra',
		  'Alternatively it can be imported from' : 'Alternativt kan det importeres fra',
		  'There can be reasons to create taxa manually, for example super species and super genera should always be created using the \'Manual\' option' : 'Der kan være gode grunde til at oprette taxa manuelt, f.eks skal superarter (s. lato, clades etc) oftest oprettes ved klik på \'Manuel\'',
		  'Manual' : 'Manuel',
		  'Choose parent taxon' : 'Vælg forældre-taxon',
		  'Add search terms on attributes': 'Tilføj søgetermer på attributter',
		  'Extended search': 'Udvidet søgning'
  	    });
	 
	
	  //  $translateProvider.preferredLanguage('dk');
	
	  
  });
