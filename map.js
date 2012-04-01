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

  // temporary testing params
  var searchLat = 55.596911;
  var searchLon = 12.998478;
  var searchRadius = 4;
  var searchQuery = '';
  var searchDate = false;


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
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    doShit();
  }


  //
  // Runs everything in the correct order.
  //
  function doShit() {
    var params = getUrlParams();

    if(params.length) {
      searchLat = params['searchLat'] ? params['searchLat'] : searchLat;
      searchLon = params['searchLon'] ? params['searchLon'] : searchLon;
      searchRadius = params['searchRadius'] ? params['searchRadius'] : searchRadius;
      searchQuery = params['searchQuery'] ? params['searchQuery'] : searchQuery;
      searchDate = params['searchDate'] ? params['searchDate'] : searchDate;
    }

    if (initiated) {
      removeShit();
    }

    jQuery.when(
      getTwitter(searchLat, searchLon, searchRadius, searchQuery, searchDate),
      getFlickr(searchLat, searchLon, searchRadius, searchQuery, searchDate)
    ).then(buildShit);

    initiated = true;
  }


  //
  // Get functions. Fetch data from every service, and add the results to allYourNodes.
  //
  // TODO: Add support for date.
  function getTwitter(lat, lon, radius, searchString, date) {
    // The endpoint url that we'll use for the AJAX request.
    var endpoint = 'http://search.twitter.com/search.json';

    return jQuery.ajax(endpoint, {
      dataType: 'jsonp',
      data: {
        q: searchString,
        geocode: lat + ',' + lon + ',' + radius + 'km',
        //until: date,
        rpp: 100
      }
    });
  }

  function getFlickr(lat, lon, radius, searchString, date) {
    var apiKey = '4cfe4215f3d4716ccee8a3bb631aa791';
    var endpoint = 'http://api.flickr.com/services/rest/?jsoncallback=?'; // Couldn't add jsoncallback with data for some reason

    // Todo: add date parameter (min_taken_date & max_taken_date)

    return jQuery.ajax({
      url: endpoint,
      data: {
        method: 'flickr.photos.search',
        format: 'json',
        extras: 'geo,url_m,date_taken,description',
        has_geo: 1,
        api_key: apiKey,
        text: searchString,
        lat: lat,
        lon: lon,
        radius: radius + 'km'
      },
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
  function buildShit(twitterResult, flickrResult) {
    // Add twitter result to allYourNodes
    $(twitterResult[0]['results']).each(function(index) {
      if (this.geo) {
        id = 'twitter-' + index;
        addToAllYourNodes(id, this.geo.coordinates[0], this.geo.coordinates[1], 'asd', 'asd', 'asd', 'asd', 'asd');
      }
    });

    // Add flickr result to allYourNodes
    $(flickrResult[0]['photos']['photo']).each(function(index) {
      id = 'flickr-' + index;
      url = 'http://www.flickr.com/photos/' + this.owner + '/' + this.id;
      addToAllYourNodes(id, this.latitude, this.longitude, this.description._content, this.url_m, '', this.datetaken, url);
    });

    // Use allYourNodes to add markers to map and build list
    jQuery.each(allYourNodes, function(key, value) {
      addMarker(this.lat, this.lon);
      // Skapa lista.
    });
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
  // getUrlParams()
  // Returns URL parameters in a nifty array. Duh.
  //

  function getUrlParams() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }


  //
  // Start your engines.
  //
  jQuery(document).ready(function() {
    mapInit();
  });


}());