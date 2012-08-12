//
// Create noise in header. Uses Daniel Rapps Noisy-plugin:
// https://github.com/DanielRapp/Noisy
//
// Found a showstopping bug in chrome, where this plugin exhausts localStorage.
// Need to be examined further before using. 
//
function initNoise() {
  $('#header').noisy({
    'intensity': 1.5,
    'size': 250,
    'opacity': 0.2,
    'monochrome': false
  });
}


//
// Sets up search form controls
//
function initSearchForm() {
  // Add datepicker
  $('#controls .date').prepend('<div class="datepicker"></div>');
  var params = getUrlParams();
  var daysToGoBack = 7;
  var defaultDate = params['searchDate'] ? params['searchDate'] : date('Y-m-d');

  var i = 0;
  while(i < daysToGoBack) {
    var then = strtotime(date('Y-m-d'))-(86400*i);
    var classes = '';
    if(defaultDate === date('Y-m-d', then)) {
      classes = ' class="active"';
    } else {
      classes = '';
    }
    $('.datepicker').prepend('<a'+ classes +' href="#" data-date="'+ date('Y-m-d', then) +'"><b class="dayname">'+ date('D', then) +'</b><b class="daynumber">'+ date('j', then) +'</b></a>');
    i++;
  }

  $('.datepicker a').click(function(e){
    var then = $(this).attr('data-date');
    $('.datepicker a').removeClass('active');
    $(this).addClass('active');
    $('#controls .searchDate').val(then);
    e.preventDefault();
  });



  //$('#controls .datepicker').datepicker({
  //  dateFormat: 'yy-mm-dd',
  //  defaultDate: defaultDate,
  //  firstDay: 1,
  //  onSelect: function(dateText, inst) { $('#controls .searchDate').val(dateText); }
  //});
}


//
// About overlay
//
function initAboutOverlay() {
  $('#logo, .overlay-back, .overlay .close-button').click(function(e){
    $('#about-placepeer').toggleClass('hidden');
    return false;
  });
}


//
// Vroom vroom!
//
jQuery(document).ready(function() {
  //initNoise();
  initSearchForm();
  initAboutOverlay();
});
