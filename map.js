(function () {


  /**

    PlacePeer

    A small project that wants to give an overview of a thing, on a date, at a place.
    We aggregate info from several sources, sort it by date/geo/keywords, place them on a
    map and create a nice overview list.

    Perhaps a bit hacky, but still an awesome test of concept. Yeah!

    People involved:
    Björn Albertsson - @bjornalbertsson
    Linus Bohman - @linusbohman
    Lars Berggren - @punktlars
    Jens Grip - @jensgrip
    Daniel Friis - @danielfriis
    Olof Johansson - @ojohansson

    Companies involved:
    Odd Hill - http://oddhill.se
    040 Internet - http://040.se
    Mediegymnasiet Malmö - http://mediegymnasiet.net

  **/


  //
  // Settings
  //
  var sitepath = ''; //Where is the site located? If we need to reference images in JS (markers)

  // Default values
  var searchLat = 55.596911;
  var searchLon = 12.998478;
  var searchRadius = 4;
  var searchQuery = '';
  var searchDate = date('Y-m-d');
  var mapZoomLevel = 13;


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

    jQuery('#map').removeClass('no-js');

    // Update default values if we have parameters
    var params = getUrlParams();
    if(params.length) {
      searchLat = params['searchLat'] ? params['searchLat'] : searchLat;
      searchLon = params['searchLon'] ? params['searchLon'] : searchLon;
      searchRadius = params['searchRadius'] ? params['searchRadius'] : searchRadius;
      searchQuery = params['searchQuery'] ? params['searchQuery'] : searchQuery;
      searchDate = strtotime(params['searchDate'] ? params['searchDate'] : searchDate);
      mapZoomLevel = parseInt(params['mapZoomLevel'] ? params['mapZoomLevel'] : mapZoomLevel);
    }

    // Initial map load: build map
    var latlng = new google.maps.LatLng(searchLat, searchLon);
    var mapOptions = {
      zoom: mapZoomLevel,
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
    if (initiated) {
      removeShit();
    }

    jQuery.when(
      getTwitter(searchLat, searchLon, searchRadius, searchQuery, searchDate),
      getFlickr(searchLat, searchLon, searchRadius, searchQuery, searchDate),
      getYouTube(searchLat, searchLon, searchRadius, searchQuery, searchDate)
    ).then(buildShit);

    initiated = true;
  }


  //
  // Get functions. Fetch data from every service, and add the results to allYourNodes.
  //
  function getTwitter(searchLat, searchLon, searchRadius, searchQuery, searchDate) {
    var endpoint = 'http://search.twitter.com/search.json';

    // Ensuring search date is + one day,
    // since Twitter until doesn't include the
    // date you set
    searchDate = searchDate + 60*60*24;

    return jQuery.ajax(endpoint, {
      dataType: 'jsonp',
      data: {
        q: searchQuery,
        geocode: searchLat + ',' + searchLon + ',' + searchRadius + 'km',
        until: date('Y-m-d', searchDate),
        rpp: 100,
        result_type: 'recent'
      }
    });
  }

  function getFlickr(searchLat, searchLon, searchRadius, searchQuery, searchDate) {
    var apiKey = '4cfe4215f3d4716ccee8a3bb631aa791';
    var endpoint = 'http://api.flickr.com/services/rest/?jsoncallback=?'; // Couldn't add jsoncallback with data for some reason

    // Max radius for flickr is 32 km.
    if(searchRadius > 32) {
      searchRadius = 32;
    }

    return jQuery.ajax({
      url: endpoint,
      data: {
        method: 'flickr.photos.search',
        format: 'json',
        extras: 'geo,url_m,date_taken,description',
        has_geo: 1,
        api_key: apiKey,
        text: searchQuery,
        lat: searchLat,
        lon: searchLon,
        min_taken_date: date('Y-m-d', searchDate),
        max_taken_date: date('Y-m-d', searchDate),
        radius: searchRadius + 'km'
      },
      dataType: 'jsonp'
    });
  }
  
  function getYouTube(searchLat, searchLon, searchRadius, searchQuery, searchDate) {
    var endpoint = 'https://gdata.youtube.com/feeds/api/videos';

    return jQuery.ajax({
      url: endpoint,
      data: {
        'v': 2,
        'alt': 'json',
        'safeSearch': 'none',
        'orderby': 'published',
        'location': searchLat + ',' + searchLon,
        'location-radius': searchRadius + 'km',
        'q': searchQuery,
        //'published-min': date('Y-m-dT00:00:00', searchDate),
        //'published-max': date('Y-m-dT23:59:59', searchDate)
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
  function buildShit(twitterResult, flickrResult, youTubeResult) {
    // Add twitter result to allYourNodes
    $(twitterResult[0]['results']).each(function(index) {
      if (this.geo) {
        var id = 'twitter-' + index;
        addToAllYourNodes(id, this.geo.coordinates[0], this.geo.coordinates[1], 'asd', 'asd', 'asd', 'asd', 'asd');
      }
    });

    // Add flickr result to allYourNodes
    $(flickrResult[0]['photos']['photo']).each(function(index) {
      var id = 'flickr-' + index;
      var url = 'http://www.flickr.com/photos/' + this.owner + '/' + this.id;
      addToAllYourNodes(id, this.latitude, this.longitude, this.description._content, this.url_m, '', this.datetaken, url);
    });
    
    // Add YouTube results to allYourNodes.
    $(youTubeResult[0]['feed']['entry']).each(function(index) {
      if (this.georss$where) {
        var id = 'youtube-' + index;
        var coordinates = this.georss$where.gml$Point.gml$pos.$t.split(' ');
        addToAllYourNodes(id, coordinates[0], coordinates[1], this.title.$t, '', this.content.src, this.published.$t, this.link[0].href);
      }
    });

    // Use allYourNodes to add markers to map and build list
    jQuery.each(allYourNodes, function(key, value) {
      addMarker(this.lat, this.lon);
      // Skapa lista.
    });

    // Update form and set map events
    updateForm();
    google.maps.event.addListener(map, 'center_changed', function(event) { updateForm(); });
    google.maps.event.addListener(map, 'zoom_changed', function(event) { updateForm(); });
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
  // getCurrentRadius()
  // Gives you current radius of map in miles
  //
  function getCurrentRadius() {
    var bounds = map.getBounds();

    var center = bounds.getCenter();
    var ne = bounds.getNorthEast();

    // r = radius of the earth in statute miles
    var r = 3963.0;  

    // Convert lat or lng from decimal degrees into radians (divide by 57.2958)
    var lat1 = center.lat() / 57.2958; 
    var lon1 = center.lng() / 57.2958;
    var lat2 = ne.lat() / 57.2958;
    var lon2 = ne.lng() / 57.2958;

    // distance = circle radius from center to Northeast corner of bounds
    var disMiles = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
    var disKM = Math.round(disMiles*1.609);
    return disKM;
  }


  //
  // updateForm()
  // Updates front end form with correct values from map
  //
  function updateForm() {
    var curLatLon = map.getCenter();
    searchLat = curLatLon['Ta'];
    searchLon = curLatLon['Ua'];
    searchRadius = getCurrentRadius();
    mapZoomLevel = map.getZoom();
    jQuery('#controls .searchLat').val(searchLat);
    jQuery('#controls .searchLon').val(searchLon);
    jQuery('#controls .searchRadius').val(searchRadius);
    jQuery('#controls .mapZoomLevel').val(mapZoomLevel);
  }


  //
  // Start your engines.
  //
  jQuery(document).ready(function() {
    mapInit();
  });


}());