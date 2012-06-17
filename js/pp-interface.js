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
// Behaviour: let us open and close the form/list
//
function initListToggle() {
  // Select the tabs and the sidebar elements that should toggle.
  $sidebarTabs = $('#list-wrapper .tabs a[data-tab]');
  $sidebarWrappers = $('#tab-content').children();

  // Initially hide the wrapper for the tabs that aren't active.
  $sidebarWrappers.filter('#' + $sidebarTabs.not('.active').data('tab')).hide();

  // Add a click behavior that will toggle the tabs.
  $sidebarTabs.click(function(event) {
    event.preventDefault();
    // Move the active class to the current tab.
    $(this).addClass('active');
    $sidebarTabs.not(this).removeClass('active');
    // Toggle the sidebar wrappers.
    $sidebarWrappers.filter('#' + $(this).data('tab')).show();
    $sidebarWrappers.not('#' + $(this).data('tab')).hide();
  });

  // Activate the list tab if the user has performed a search.
  if (window.location.search.length) {
    $sidebarTabs.filter('[data-tab=list]').click();
  }

  // Toggle the sidebar.
  $('#toggle-sidebar').click(function(event) {
    $('#list-wrapper').toggleClass('hidden');
    $('#map').toggleClass('sidebar-hidden');
  });
}


//
// Sets up search form controls
//
function initSearchForm() {
  // Add datepicker
  var params = getUrlParams();
  var defaultDate = params['searchDate'] ? params['searchDate'] : date('Y-m-d');
  $('#filter .datepicker').datepicker({
    dateFormat: 'yy-mm-dd',
    defaultDate: defaultDate,
    firstDay: 1,
    onSelect: function(dateText, inst) { $('#controls .searchDate').val(dateText); }
  });
}


//
// About overlay
//
function initAboutOverlay() {
  $('#logo, .overlay-back, .overlay-close').click(function(e){
    $('#about-placepeer').toggleClass('hidden');
    return false;
  });
}


//
// Vroom vroom!
//
jQuery(document).ready(function() {
  //initNoise();
  initListToggle();
  initSearchForm();
  initAboutOverlay();
});
