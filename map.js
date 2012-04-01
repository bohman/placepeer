(function () {

  /**

    PlacePeer

    A small project that wants to give an overview of a thing, on a date, at a place.
    We aggregate info from several sources, sort it by date/geo/keywords, place them on a
    map and create a nice overview list.

    Perhaps a bit hacky, but still an awesome test of concept. Yeah!

    By:
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
  

  //
  // Set up global variables and run map_init() as a callback.
  //
  var map;
  var initiated = false;
  var allYourNodes = {};
  var allYourMarkers = [];
  var allYourInfoWindows = [];


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
      searchDate = strtotime(params['searchDate'] ? params['searchDate'] : searchDate);
    }

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

    return jQuery.ajax(endpoint, {
      dataType: 'jsonp',
      data: {
        include_entities: true,
        q: searchQuery,
        geocode: searchLat + ',' + searchLon + ',' + searchRadius + 'km',
        until: date('Y-m-d', searchDate),
        rpp: 100
      }
    });
  }

  function getFlickr(searchLat, searchLon, searchRadius, searchQuery, searchDate) {
    var apiKey = '4cfe4215f3d4716ccee8a3bb631aa791';
    var endpoint = 'http://api.flickr.com/services/rest/?jsoncallback=?'; // Couldn't add jsoncallback with data for some reason

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
        // Set the arguments.
        var id = 'twitter-' + index;
        var lat = this.geo.coordinates[0];
        var lon = this.geo.coordinates[1];
        var text = this.text;
        var image = false;
        var video = false;
        var date = strtotime(this.created_at);
        var url = 'https://twitter.com/' + this.from_user + '/status/' + this.id_str;
        // Add media.
        $(this.entities.media).each(function() {
          if (this.type == 'photo' && !image) {
            image = this.media_url + ':thumb';
          }
        });
        addToAllYourNodes(id, lat, lon, text, image, video, date, url);
      }
    });

    // Add flickr result to allYourNodes
    $(flickrResult[0]['photos']['photo']).each(function(index) {
      // Set the arguments.
      var id = 'flickr-' + index;
      var lat = this.latitude;
      var lon = this.longitude;
      var text = this.description._content;
      var image = this.url_m;
      var video = false;
      var date = strtotime(this.datetaken);
      var url = 'http://www.flickr.com/photos/' + this.owner + '/' + this.id;
      addToAllYourNodes(id, lat, lon, text, image, video, date, url);
    });
    
    // Add YouTube results to allYourNodes.
    $(youTubeResult[0]['feed']['entry']).each(function(index) {
      if (this.georss$where) {
        // Set the arguments.
        var id = 'flickr-' + index;
        var coordinates = this.georss$where.gml$Point.gml$pos.$t.split(' ');
        var lat = coordinates[0];
        var lon = coordinates[1];
        var text = this.title.$t;
        var image = false;
        var video = '<object width="280" height="210"><param name="movie" value="' + this.content.src + '"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="' + this.content.src + '" type="application/x-shockwave-flash" width="280" height="210" allowscriptaccess="always" allowfullscreen="true"></embed></object>';
        var date = strtotime(this.published.$t);
        var url = this.link[0].href;
        addToAllYourNodes(id, lat, lon, text, image, video, date, url);
      }
    });

    // Use allYourNodes to add markers to map and build list
    jQuery.each(allYourNodes, function(index) {
      addMarker(this);
      // Skapa lista.
    });
  }

  function addMarker(object) {
    // Create the location.
    var location = new google.maps.LatLng(object.lat, object.lon);
    
    // Add a marker.
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      title: object.text
    });
    allYourMarkers.push(marker);
    
    // Add an info window.
    var content = '<strong>' + object.text + '</strong>';
    if (object.image) {
      content += '<p><img src="' + object.image + '" /></p>';
    }
    if (object.video) {
      content += '<p>' + object.video + '</p>';
    }
    content += '<p><a href="' + object.url + '" target="_blank">Visa</a></p>';
    var infoWindow = new google.maps.InfoWindow({
      position: location,
      content: content
    });
    allYourInfoWindows.push(infoWindow);
    
    // Open the info window on click.
    google.maps.event.addListener(marker, 'click', function() {
      $(allYourInfoWindows).each(function() {
        this.close();
      });
      infoWindow.open(map, marker);
    });
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
    
    if (allYourInfoWindows) {
      for (i=0; i < allYourInfoWindows.length; i++) {
        allYourInfoWindows[i].setMap(null);
      }
      allYourInfoWindows.length = 0;
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