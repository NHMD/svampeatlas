
moment.locale('da');
angular.module('svampeatlasApp').config(function($mdDateLocaleProvider) {
    // Example of a French localization.
   
   $mdDateLocaleProvider.firstDayOfWeek = 1;
   $mdDateLocaleProvider.formatDate = function(date) {
     return (date) ? moment(date).format('L'): "";
   };
   /*
    $mdDateLocaleProvider.months = ['januar', 'februar', 'marts', 'april', 'maj','juni', 'juli', 'august','september','oktober', 'november', 'december']
    
	var myShortMonths = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
	$mdDateLocaleProvider.shortMonths = myShortMonths;
    $mdDateLocaleProvider.days = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
    $mdDateLocaleProvider.shortDays = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
    // Can change week display to start on Monday.
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    // Optional.
  //  $mdDateLocaleProvider.dates = [1, 2, 3, 4, 5, 6, ...];
    // Example uses moment.js to parse and format dates.
    $mdDateLocaleProvider.parseDate = function(dateString) {
      var m = moment(dateString, 'L', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
    $mdDateLocaleProvider.formatDate = function(date) {
      return (date) ? moment(date).format('L'): "";
    };
    $mdDateLocaleProvider.monthHeaderFormatter = function(date) {
      return myShortMonths[date.getMonth()] + ' ' + date.getFullYear();
    };
    // In addition to date display, date components also need localized messages
    // for aria-labels for screen-reader users.
    $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
      return 'Uge ' + weekNumber;
    };
    $mdDateLocaleProvider.msgCalendar = 'Kalender';
    $mdDateLocaleProvider.msgOpenCalendar = 'Åbn kalender';
	
	*/
	
  });