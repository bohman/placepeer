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
    Olof Johansson - @ojohansson

    Companies involved:
    Odd Hill - http://oddhill.se
    040 Internet - http://040.se
    Mediegymnasiet Malmö - http://mediegymnasiet.net

  **/

  //
  // Set up global variables and run map_init() as a callback.
  //
  var sitepath = window.location.protocol + '//' + window.location.hostname + window.location.pathname;
  var center;
  var map;
  var geocoder;
  var markerClusterer;
  var initiated = false;
  var allYourNodes = [];
  var allYourMarkers = [];
  var allYourInfoWindows = [];


  //
  // map_init()
  // Sets up the map and everything. If this function
  // was your mother, it'd be HUGE. As in important, since
  // it basically gives birth to the entire map. You dig?
  //
  function mapInit() {
    jQuery('#map').removeClass('no-js');

    // Set the initial latitude and longitude for the map. We'll look for the
    // data in the URL. If it's not present, we'll try to get the users real
    // location. And if that fail's we'll stick with Malmö, since it's awesome.
    var params = getUrlParams();
    if (params['lat'] && params['lon']) {
      searchLat = params['lat'];
      searchLon = params['lon'];
    }
    else if (google.loader.ClientLocation != null) {
      var searchLat = google.loader.ClientLocation.latitude;
      var searchLon = google.loader.ClientLocation.longitude;
    }
    else {
      var searchLat = 55.596911;
      var searchLon = 12.998478;
    }

    // Create the map.
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: parseInt(params['zoom'] ? params['zoom'] : 13),
      maxZoom: 18,
      minZoom: 11,
      center: new google.maps.LatLng(searchLat, searchLon),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: false,
      scrollwheel: false,
      disableDefaultUI: true
    });

    // When the map has finished loading for the first time, we'll automatically
    // do the initial shit.
    google.maps.event.addListener(map, 'tilesloaded', function(event) {
      if (!initiated) {
        updateParams();
        doShit();
        initiated = true;
      }
    });
    
    google.maps.event.addListener(map, 'dragend', function(event) { updateParams(); });
    google.maps.event.addListener(map, 'zoom_changed', function(event) { updateParams(); });

    // Create the geocoder object.
    geocoder = new google.maps.Geocoder();

    // Initialize form controls
    initForm();
  }


  //
  // Runs everything in the correct order.
  //
  function doShit() {
    // Remove the previous shit.
    if (initiated) {
      removeShit();
    }

    // Get the parameters from the url.
    var params = getUrlParams();
    searchLat = params['lat'];
    searchLon = params['lon'];
    searchQuery = params['q'];
    searchDate = strtotime(params['date'] + ' 00:00');
    searchRadius = getCurrentRadius();

    // Get the shit from various places.
    getTwitter(searchLat, searchLon, searchRadius, searchQuery, searchDate, 1);
    getFlickr(searchLat, searchLon, searchRadius, searchQuery, searchDate);
    getYouTube(searchLat, searchLon, searchRadius, searchQuery, searchDate);
    getInstagram(searchLat, searchLon, searchRadius, searchQuery, searchDate);
  }


  //
  // Get functions. Fetch data from every service, and add the results to allYourNodes.
  //
  function getTwitter(searchLat, searchLon, searchRadius, searchQuery, searchDate, page) {
    var endpoint = 'http://search.twitter.com/search.json';
    var searchDay = date('d', searchDate);
    var resultDay = searchDay;

    jQuery.ajax(endpoint, {
      dataType: 'jsonp',
      data: {
        page: page,
        include_entities: true,
        q: searchQuery,
        geocode: searchLat + ',' + searchLon + ',' + searchRadius + 'km',
        until: date('Y-m-d', searchDate + 60*60*24),
        rpp: 100,
        result_type: 'recent'
      },
      success: function(data, status) {
        console.log('Twitter: ' + page, data);
        if (typeof data['results'] == 'object') {
          $(data['results']).each(function(index) {
            resultDay = window.date('d', strtotime(this.created_at));
            if (this.geo && resultDay == searchDay) {
              // Set the arguments.
              var id = 'twitter-' + index;
              var lat = this.geo.coordinates[0];
              var lon = this.geo.coordinates[1];
              var text = this.text;
              var image = false;
              var video = false;
              var date = strtotime(this.created_at);
              var url = 'https://twitter.com/' + this.from_user + '/status/' + this.id_str;
              var user = this.from_user;
              var avatar = this.profile_image_url;
  
              // Add media
              // This one time, at band camp, we actually got a result where an object didn't have
              // 'entities', even though documentation said we should. So let's do an extra check. -LB
              if(this.hasOwnProperty('entities')) {
                $(this.entities.media).each(function() {
                  if (this.type == 'photo' && !image) {
                    image = this.media_url + ':thumb';
                  }
                });
              }
              
              buildShit(id, lat, lon, text, image, video, date, url, user, avatar);
            }
          });
  
          if (resultDay >= searchDay) {
            getTwitter(searchLat, searchLon, searchRadius, searchQuery, searchDate, page + 1)
          }
        }
      }
    });
  }

  function getFlickr(searchLat, searchLon, searchRadius, searchQuery, searchDate) {
    var apiKey = '4cfe4215f3d4716ccee8a3bb631aa791';
    var endpoint = 'http://api.flickr.com/services/rest/?jsoncallback=?'; // Couldn't add jsoncallback with data for some reason

    // Max radius for flickr is 32 km.
    if(searchRadius > 32) {
      flickrSearchRadius = 32;
    } else {
      flickrSearchRadius = searchRadius;
    }

    jQuery.ajax({
      url: endpoint,
      data: {
        method: 'flickr.photos.search',
        format: 'json',
        extras: 'geo,url_m,date_taken,description,owner_name',
        has_geo: 1,
        api_key: apiKey,
        text: searchQuery,
        lat: searchLat,
        lon: searchLon,
        min_taken_date: date('Y-m-d', searchDate),
        max_taken_date: date('Y-m-d', searchDate),
        radius: flickrSearchRadius + 'km'
      },
      dataType: 'jsonp',
      success: function(data, status) {
        if (data.stat == 'ok' && typeof data['photos']['photo'] == 'object') {
          $(data['photos']['photo']).each(function(index) {
            // Set the arguments.
            var id = 'flickr-' + index;
            var lat = this.latitude;
            var lon = this.longitude;
            var text = this.title;
            var image = this.url_m;
            var video = false;
            var date = strtotime(this.datetaken);
            var url = 'http://www.flickr.com/photos/' + this.owner + '/' + this.id;
            var user = this.ownername;
            var avatar = false;
            
            buildShit(id, lat, lon, text, image, video, date, url, user, avatar);
          });
        }
      }
    });
  }
  
  function getYouTube(searchLat, searchLon, searchRadius, searchQuery) {
    var endpoint = 'https://gdata.youtube.com/feeds/api/videos';

    // Max radius for YouTube is 1000 km.
    if(searchRadius > 1000) {
      youtubeSearchRadius = 1000;
    } else {
      youtubeSearchRadius = searchRadius;
    }

    jQuery.ajax({
      url: endpoint,
      data: {
        'v': 2,
        'alt': 'json',
        'safeSearch': 'none',
        'orderby': 'published',
        'location': searchLat + ',' + searchLon,
        'location-radius': youtubeSearchRadius + 'km',
        'q': searchQuery,
      },
      dataType: 'jsonp',
      success: function(data, status) {
        if (typeof data['feed']['entry'] == 'object') {
          $(data['feed']['entry']).each(function(index) {
            var date = this.yt$recorded ? this.yt$recorded.$t : window.date('Y-m-d', strtotime(this.published.$t));
            if (this.georss$where && date == window.date('Y-m-d', searchDate)) {
              // Set the arguments.
              var id = 'youtube-' + index;
              var coordinates = this.georss$where.gml$Point.gml$pos.$t.split(' ');
              var lat = coordinates[0];
              var lon = coordinates[1];
              var text = this.title.$t;
              var image = this.media$group.media$thumbnail[0].url;
              var video = '<object width="280" height="210"><param name="movie" value="' + this.content.src + '"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="' + this.content.src + '" type="application/x-shockwave-flash" width="280" height="210" allowscriptaccess="always" allowfullscreen="true"></embed></object>';
              var date = strtotime(this.published.$t);
              var url = this.link[0].href;
              var user = this.author[0].name.$t;
              var avatar = false;
              
              buildShit(id, lat, lon, text, image, video, date, url, user, avatar);
            }
          });
        }
      }
    });
  }
  
  function getInstagram(searchLat, searchLon, searchRadius, searchQuery, searchDate) {
    var endpoint = 'https://api.instagram.com/v1/media/search';

    jQuery.ajax({
      url: endpoint,
      data: {
        'client_id': 'd340e84f802940fc8309539b6dc5d4fa',
        'lat': searchLat,
        'lng': searchLon,
        'min_timestamp': searchDate,
        'max_timestamp': searchDate + 60*60*24,
        'distance': searchRadius * 1000
      },
      dataType: 'jsonp',
      success: function(data, status) {
        if (data.meta.code == 200 && typeof data.data == 'object') {
          $(data.data).each(function(index) {
            if (searchQuery) {
              // Perform a manual search within the caption.
              if (!this.caption) {
                return;
              }
              if (this.caption.text.toLowerCase().search(searchQuery.toLowerCase()) == -1) {
                return;
              }
            }
          
            var id = 'instagram-' + index;
            var lat = this.location.latitude;
            var lon = this.location.longitude;
            var text = this.caption ? this.caption.text : '';
            var image = this.images.thumbnail.url;
            var video = false;
            var date = strtotime(this.created_time);
            var url = this.link;
            var user = this.user.username;
            var avatar = this.user.profile_picture;
            
            buildShit(id, lat, lon, text, image, video, date, url, user, avatar);
          });
        }
      }
    });
  }

  //
  // Add the results to the map, and create the initial list.
  //
  function buildShit(id, lat, lon, text, image, video, date, url, user, avatar) {
    var node = addToAllYourNodes(id, lat, lon, text, image, video, date, url, user, avatar);

    // Use allYourNodes to add markers to map and build list
    var marker = addMarker(node);
    var $listItem = addListItem(node);
    $listItem.click(function() {
      google.maps.event.trigger(marker, 'click');
    });
    
    
    // Add the markers to the marker clusterer.
    // TODO: Enable the clusterer again, It would need some configuration before
    // it's good to go..
    //markerClusterer.addMarkers(allYourMarkers);    
  }

  function addToAllYourNodes(id, lat, lon, text, image, video, date, url, user, avatar) {
    var node = {
      id: id,
      lat: lat,
      lon: lon,
      text: text,
      image: image,
      video: video,
      date: date,
      url: url,
      user: user,
      avatar: avatar
    }
    allYourNodes.push(node);
    
    return node;
  }

  function addMarker(object) {
    // Set up markers
    var markerImg = sitepath + 'graphics/marker-text.png';
    if(object.video) {
      markerImg = sitepath + 'graphics/marker-video.png';
    } else if(object.image) {
      markerImg = sitepath + 'graphics/marker-image.png';
    }

    var image = new google.maps.MarkerImage(
      markerImg,
      new google.maps.Size(26,38),
      new google.maps.Point(0,0),
      new google.maps.Point(13,38)
    );

    var shadow = new google.maps.MarkerImage(
      sitepath + 'graphics/marker-shadow.png',
      new google.maps.Size(48,38),
      new google.maps.Point(0,0),
      new google.maps.Point(13,38)
    );

    var shape = {
      coord: [17,0,19,1,20,2,21,3,22,4,23,5,23,6,24,7,24,8,24,9,24,10,25,11,25,12,25,13,24,14,24,15,24,16,24,17,23,18,23,19,23,20,22,21,21,22,21,23,20,24,19,25,19,26,18,27,17,28,16,29,16,30,15,31,15,32,14,33,14,34,14,35,14,36,14,37,11,37,11,36,10,35,10,34,10,33,9,32,9,31,8,30,8,29,7,28,6,27,6,26,5,25,4,24,4,23,3,22,2,21,2,20,1,19,1,18,0,17,0,16,0,15,0,14,0,13,0,12,0,11,0,10,0,9,0,8,0,7,1,6,2,5,2,4,3,3,4,2,5,1,7,0,17,0],
      type: 'poly'
    };

    // Create the location.
    var location = new google.maps.LatLng(object.lat, object.lon);

    // Add a marker.
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      icon: image,
      shadow: shadow,
      shape: shape,
      title: object.text
    });

    allYourMarkers.push(marker);

    // Add an info window.
    var infoBubble = new InfoBubble({
      position: location,
      content: 'Loading...'
    });

    allYourInfoWindows.push(infoBubble);

    google.maps.event.addListener(infoBubble, 'domready', function() {
      if (!object.rendered) {        
        var user = '<h3 class="user">' + object.user + '</h3>';
        var avatar = '';
        var text = object.text;
        var media = '';

        if (object.avatar) {
          avatar = '<img class="avatar" src="' + object.avatar + '" />';
        } else {
          avatar = '<img class="avatar" src="' + sitepath + 'graphics/default-avatar.png" />';
        }

        if (object.video) {
          media = object.video;
        } else if (object.image) {
          media = '<img src="' + object.image + '" />';
        }

        // Find urls in the text, and move them to a separate array.
        if (!media.length) {
          var urls = object.text.match(/((http|https):\/\/|www\.)\S+/gi);
          if (urls) {
            for (var index in urls) {
              $.ajax({
                url: 'get.php?url=' + urls[index],
                dataType: 'json',
                async: true,
                complete: function(response, status) {
                  result = $.parseJSON(response.responseText);
                  if (result.image) {
                    media = '<img src="' + result.image + '" width="100" />';
                  }
                  renderInfoBubbleContent(infoBubble, object, avatar, user, text, media);
                }
              });
              if (media.length) {
                break;
              }
            }
          }
          else {
            renderInfoBubbleContent(infoBubble, object, avatar, user, text, media);
          }
        }
        else {
          renderInfoBubbleContent(infoBubble, object, avatar, user, text, media);
        }
      }

      var $activeListItem = $('#list .item#' + object.id).addClass('active');
      $('#list .item').not($activeListItem).removeClass('active');
    });

    google.maps.event.addListener(infoBubble, 'closeclick', function() {
      $('#list .item').removeClass('active');
    });

    // Open the info window on click.
    google.maps.event.addListener(marker, 'click', function(event) {
      $(allYourInfoWindows).each(function() {
        this.close();
      });
      infoBubble.open(map, marker);

      // If we have an event argument, it means that this event was triggered
      // from the marker. Scroll to the list item.
      if (typeof event != 'undefined') {
        $('body').scrollTo('#' + object.id, 250, {});
      }
    });

    object.marker = marker;
    return marker;
  }

  function renderInfoBubbleContent(infoBubble, object, avatar, user, text, media) {
    text = text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi, '<a href="$1" target="_blank">$1</a>'); 

    sender = '<a href="' + object.url + '" class="sender" target="_blank">' + avatar + user + '</a>';
    text = '<p class="text">' + text + '</p>';
    if (media.length) {
      media = '<div class="media">' + media + '</div>';
    }

    closebutton = '<div class="close-button">close</div>';

    object.rendered = true;
    infoBubble.setContent('<div class="bubble">' + sender + text + media + closebutton + '</div>');
    infoBubble.updateContent_();
  }

  function addListItem(object) {
    var content, user;
    if (object.image) {
      content = '<img src="' + object.image + '" />';
    }
    else {
      content = '<p class="pseudo-image">' + object.text + '</p>';
    }

    content = '<div class="content">' + content + '</div>';
    user = '<h3 class="user">' + object.user + '</h3>';

    $listItem = $('<div id="' + object.id + '" class="item subtle-shadow gradient-light-grey">' + user + content + '</div>').appendTo('#list');

    object.$listItem = $listItem;
    return $listItem;
  }


  //
  // Will reset the results, empty our arrays, clear the list and remove the markers.
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
    
    allYourNodes.length = 0;

    // Kill list.
    $('#list').html('');
  }
  

  //
  // getCurrentRadius()
  // Gives you current radius of map
  //
  function getCurrentRadius() {
    var bounds = map.getBounds();
    var center = bounds.getCenter();
    var ne = bounds.getNorthEast();
    var r = 3963.0; // r = radius of the earth in statute miles

    // Convert lat or lng from decimal degrees into radians (divide by 57.2958)
    var lat1 = center.lat() / 57.2958;
    var lon1 = center.lng() / 57.2958;
    var lat2 = ne.lat() / 57.2958;
    var lon2 = ne.lng() / 57.2958;

    // distance = circle radius from center to Northeast corner of bounds
    var disMiles = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
    var disKM = Math.round((disMiles*1.609)*10)/10;
    return disKM;
  }


  //
  // updateParams()
  // Updates front end form with correct values from map
  //
  function updateParams() {
    var hashParams = new Array();
    var curLatLon = map.getCenter();
    hashParams.push('q=' + jQuery('#controls .searchQuery').val());
    hashParams.push('date=' + jQuery('#controls .searchDate').val());
    hashParams.push('lat=' + curLatLon.lat());
    hashParams.push('lon=' + curLatLon.lng());
    hashParams.push('zoom=' + map.getZoom());
    hashParams.push('radius=' + getCurrentRadius());
    
    location.hash = hashParams.join('&');
    jQuery('#controls .jumpToLocation').val('');
  }


  //
  // initForm()
  // Initialize form controls.
  //
  // TODO: Move to interface.js. Probably have to move map variables into a separate namespace.
  //
  function initForm() {
    var controls = $('#controls');
    var mapoverlay = $('#map-overlay');

    controls.submit(function(event) {
      event.preventDefault();
      updateParams();
      doShit();
    });

    // Jump to location input
    controls.find('.jumpToLocation').autocomplete({
      // This bit uses the geocoder to fetch address values
      source: function(request, response) {
        geocoder.geocode({ 'address': request.term }, function(results, status) {
          response($.map(results, function(item) {
            return {
              label: item.formatted_address,
              value: item.formatted_address,
              latitude: item.geometry.location.lat(),
              longitude: item.geometry.location.lng()
            }
          }));
        })
      },
      // This bit is executed upon selection of an address
      select: function(event, ui) {
        var jumpTo = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
        map.panTo(jumpTo);
        updateParams();
      }
    });

    // Custom zoom controls
    mapoverlay.find('#zoom')
      .prepend('<div class="mapZoomer"></div>')
      .prepend('<a href="#" class="zoom-in">+</a>')
      .append('<a href="#" class="zoom-out">-</a>')
      .find('label, input').hide()
      .siblings('.mapZoomer').slider({
        orientation: 'vertical',
        min: 11,
        max: 18,
        value: map.getZoom(),
        slide: function(event, ui) {
          setZoom(ui.value);
        }
      }).siblings()
      .siblings('.zoom-in').click(function(e){
        var zoomLevel = map.getZoom();
        var maxZoom = mapoverlay.find('.mapZoomer').slider('option', 'max');
        if(zoomLevel < maxZoom) {
          setZoom(map.getZoom()+1)
        }
        e.preventDefault();
      })
      .siblings('.zoom-out').click(function(e){
        var zoomLevel = map.getZoom();
        var minZoom = mapoverlay.find('.mapZoomer').slider('option', 'min');
        if(zoomLevel > minZoom) {
          setZoom(map.getZoom()-1)
        }
        e.preventDefault();
      });
  }

  function setZoom(integer) {
    map.setZoom(integer);
    $('#map-overlay .mapZoomer').slider('option', 'value', integer)
      .siblings('.mapZoomLevel').val(integer);
  }


  //
  // Start your engines.
  //
  jQuery(document).ready(function() {
    mapInit();
  });

}());
