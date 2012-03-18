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
    Olof Johansson - @ojohansson

  **/


  //
  // Settings
  //
  var sitepath = ''; //Where is the site located? If we need to reference images in JS (markers)
  
  //
  // Set up global variables and run map_init() as a callback.
  //
  var map;
  var initiated = false;
  var allYourNodes = {};
  var allYourMarkers = [];

  //
  // map_init()
  // Sets up the map and everything. If this function
  // was your mother, it'd be HUGE. As in important, since
  // it basically gives birth to the entire map. You dig?
  //
  function mapInit() {

    // Save and parse all map markers in an object. Also update mapInit variable
    // to let other functions know this is the first time we build the map.
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

    doShit();
  }


  //
  // Runs everything in the correct order.
  //
  function doShit() {
    if (initiated) {
      removeShit();
    }
    
    jQuery.when(getTwitter(0, 0, 0, '', false)).then(buildShit);

    initiated = true;
  }
  
  //
  // Get functions. Fetch data from every service, and add the results to allYourNodes.
  //
  function getTwitter(lat, lon, radius, searchString, date) {
    var twitterRequestUrl = 'http://search.twitter.com/search.json?&include_entities=1'; // If twitter ever changes api search
    var requestUrl = 'q=&geocode=55.596911,12.998478,4km' // The first request is what?

    return jQuery.ajax({
      url: twitterRequestUrl+requestUrl,
      dataType: 'jsonp'
    });
  }

  function addToAllYourNodes(id, lat, lon, text, image, video, date, url) {
    allYourNodes[id] = {
      lat: lat,
      lon: lon,
      text: text,
      image: image,
      video: video,
      date: date,
      url: url
    }
  }

  //
  // Add the results to the map, and create the initial list.
  //
  function buildShit(twitterResult) {
    $(twitterResult.results).each(function(index) {
      if (this.geo) {
        id = 'twitter-' + index;
        addToAllYourNodes(id, this.geo.coordinates[0], this.geo.coordinates[1], 'asd', 'asd', 'asd', 'asd', 'asd');
      }
    });
  
    jQuery.each(allYourNodes, function(key, value) {
      addMarker(this.lat, this.lon);
    });

    // Skapa lista.
  }

  function addMarker(lat, lon) {
    var location = new google.maps.LatLng(lat, lon);
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    allYourMarkers.push(marker);
  }

  //
  // Will reset the results, emptying our arrays, clear the list and remove the markers.
  //
  function removeShit() {
    if (allYourMarkers) {
      for (i=0; i < allYourMarkers.length; i++) {
        allYourMarkers[i].setMap(null);
      }
      allYourMarkers.length = 0;
    }
    
    // Kill list.
  }

  //
  // Start your engines.
  //
  jQuery(document).ready(function() {
    mapInit();
  });
  

}());