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
		  'endofyt i planter': 'endofyte in plants'
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
		  'Change parent taxon': 'Ændr forældre-taxon'
  	    });
	 
	
	  //  $translateProvider.preferredLanguage('dk');
	
	  
  });
