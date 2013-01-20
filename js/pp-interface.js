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
}


//
// About overlay
//
function initAboutOverlay() {
  $('#logo, .overlay-back, .overlay .close-button').click(function(e){
    if(!$('#about-placepeer').is(':visible')) {
      var top = $(document).scrollTop();
      $('.overlay .overlay-content').css({
        'top': parseInt(top + 20) + 'px'
      })
    }
    $('#about-placepeer').toggleClass('hidden');
    return false;
  });
}


//
// Vroom vroom!
//
jQuery(document).ready(function() {
  initSearchForm();
  initAboutOverlay();
});
