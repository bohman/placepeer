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

  // Open ze about window the first time.
  if (!$.cookie('about-overlay')) {
    $('#logo').click();
  }

  // Lenghten the cookie another year for every other time.
  else {
    $.cookie('about-overlay', false, {
      expires: 365
    });
  }

  // Set ze cookie when closing ze window.
  $('.overlay-back, .overlay .close-button').click(function(e){
    $.cookie('about-overlay', false, {
      expires: 365
    });
  });
}


//
// Vroom vroom!
//
jQuery(document).ready(function() {
  initSearchForm();
  initAboutOverlay();
});
