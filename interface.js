jQuery(document).ready(function() {
  
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
  
  // Toggle the sidebar.
  $('#toggle-sidebar').click(function(event) {
    $('#list-wrapper').toggleClass('hidden', 2000);
  });
  
});
