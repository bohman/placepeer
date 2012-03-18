(function () {

  /**

    PlacePeer

    A bit hacky, but an awesome test of concept. Yeah!

    By:
    Björn Albertsson - @bjornalbertsson
    Linus Bohman - @linusbohman
    Lars Berggren - @punktlars
    Jens Grip - @jensgrip
    Daniel Friis - @danielfriis

  **/


  //
  // Settings
  //
  var sitepath = ''; //Where is the site located? If we need to reference images in JS (markers)
  var twitterRequestUrl = 'http://search.twitter.com/search.json?&include_entities=1'; // If twitter ever changes api search
  var requestUrl = 'q=&geocode=55.596911,12.998478,4km' // The first request is what?


  //
  // Set up global variables and run map_init() as a callback.
  //
  var bounds = new google.maps.LatLngBounds();
  var infoWindow = new google.maps.InfoWindow({ content: 'Loading information...' });
  var map;
  var mapInit = false;
  var mapNodes;
  var markersArray = [];
  var setBounds = false;

  jQuery(document).ready(function() {
    map_init();
  });


  //
  // map_init()
  // Sets up the map and everything. If this function
  // was your mother, it'd be HUGE. As in important, since
  // it basically gives birth to the entire map. You dig?
  //
  function map_init() {

    // Save and parse all map markers in an object. Also update mapInit variable
    // to let other functions know this is the first time we build the map.
    mapInit = true;
    jQuery('#map').removeClass('no-js');

    // Initial map load: build map
    var latlng = new google.maps.LatLng(55.596911,12.998478);
    var mapOptions = {
      zoom: 13,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      scrollwheel: false
    }
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    doRequest(requestUrl);

    mapInit = false;
  }


  //
  // buildNodes()
  // Made to run in the checkFilter function. Ensures bubbles and list
  // is populated with proper information.
  //
  function buildNodes(data) {

    mapNodes = data;

    jQuery.each(mapNodes['results'], function(key, value) {
      var lat = value['geo']['coordinates'][0];
      var lon = value['geo']['coordinates'][1];
      addMarker(lat, lon);
    });

    // Creating map bubbles and updating icons if needed
    for (i=0; i < markersArray.length; i++) {

      // Build bubble events if needed

      // Build timeline

    }
  }


  //
  // General utilities
  //

  function addMarker(lat, lon) {
    var location = new google.maps.LatLng(lat, lon);
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    markersArray.push(marker);
  }

  function removeMarkers() {
    if (markersArray) {
      for (i=0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
      }
      markersArray.length = 0;
    }
    // Empty timeline if needed
  }

  function doRequest(requestUrl) {
    jQuery.ajax({
      url: twitterRequestUrl+requestUrl,
      dataType: 'jsonp',
      jsonpCallback: 'buildNodes'
    });
  }

}());