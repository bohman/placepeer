<!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Placepeer</title>
  <link rel="stylesheet" id="jquery-ui-css"  href="css/zoomer-base/jquery-ui-1.8.20.custom.css" type="text/css" media="all" />
  <link rel="stylesheet" id="placepeer-css"  href="css/style.css" type="text/css" media="all" />
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
  <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyCBZ5stPtmfRqLgbtjwd-SCGApkG_OlnDU&sensor=false"></script>
  <script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobubble/src/infobubble.js"></script>
  <script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js"></script>
  <script type="text/javascript" src="https://www.google.com/jsapi"></script>
  <script type="text/javascript" src="js/jqueryuicustom.js"></script>
  <?php /* <script type="text/javascript" src="js/jquery.noisy.min.js"></script> */ ?>
  <script type="text/javascript" src="js/jquery.scrollTo-1.4.2-min.js"></script>
  <script type="text/javascript" src="js/pp-utils.js"></script>
  <script type="text/javascript" src="js/pp-map.js"></script>
  <script type="text/javascript" src="js/pp-interface.js"></script>
</head>
<body>
  
  <div id="header">
    <a id="logo" href="/"><b>Placepeer</b><p>About this project<br />Beta 0.7</p></a>
    <div class="addthis_toolbox addthis_32x32_style addthis_default_style">
        <a class="addthis_button_facebook"></a>
        <a class="addthis_button_twitter"></a>
    </div>
    <script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4f53724c3a21b3bc"></script>
  </div>

  <div id="list-wrapper">
    <form id="controls" method="get" action="<?php $_SERVER['REQUEST_URI']; ?>">
      <ul class="tabs">
        <li><a href="#" data-tab="filter" class="active">Search</a></li>
        <li><a href="#" data-tab="list">Results</a></li>
      </ul>
      <div id="tab-content">
        <div id="filter">
          <div class="form-item geo">
            <label for="jumpToLocation">Jump to location:</label>
            <input type="text" name="jumpToLocation" class="jumpToLocation" placeholder="Jump to location" />
            <input type="hidden" name="searchLat" class="searchLat" value="" />
            <input type="hidden" name="searchLon" class="searchLon" value="" />
            <input type="hidden" name="searchRadius" class="searchRadius" value="" />
          </div>
          <div class="form-item keyword">
            <label for="searchQuery">Search for keyword:</label>
            <input type="text" name="searchQuery" class="searchQuery" value="<?php echo $_GET['searchQuery']; ?>" placeholder="Search for keyword" />
          </div>
          <div class="form-item date">
            <div class="datepicker"></div>
            <label for="searchDate">Date:</label>
            <input type="text" name="searchDate" class="searchDate" value="<?php echo $_GET['searchDate']; ?>" />
          </div>
        </div>
        <div id="list"></div>
      </div>
      <div class="always-show">
        <a href="#" id="toggle-sidebar"><b>Toggle</b></a>
        <div class="zoom">
          <label for="zoom">Zoom:</label>
          <input type="text" name="mapZoomLevel" class="mapZoomLevel" value="" />
        </div>
        <input class="submit" type="submit" value="Go!" />
      </div>
    </form>
  </div>

  <div id="map">
    <div id="map-canvas"></div>
  </div>

  <div id="about-placepeer" class="overlay hidden">
    <div class="overlay-back"></div>
    <div class="overlay-content">
      <a href="#" class="overlay-close">close</a>
      <div class="overlay-header">
        <h2 class="pp-logo"><b>Placepeer</b></h2>
      </div>
      <p>Placepeer fetches time- and geotagged information to show you what and where stuff happens.</p>
      <p>Right now we fetch stuff from Youtube, Twitter, Flickr and Instagram, but we might add more services in the future. You get a chance to stumble upon events that would never show in the usual media flow.</p>
      <p>Simply put: We place stuff on a map to make exploring fun. Yay!</p>
      <p>This is pretty much just a proof of concept. An awesome proof of concept of course, but there are a few errors here and there. Some are due to API limitations. Some might be because we had too much coffe while building it. Feel free to message us on Twitter or Github to let us know about your finding. Or better yet - fix the problem yourself!</p>
      <ul>
        <li class="companies">Sponsored by <a href="http://oddhill.se">Odd Hill</a>, <a href="http://040.se">040</a> and <a href="http://mediegymnasiet.net">Mediegymnasiet</a></li>
        <li class="people">Built by <a href="http://twitter.com/jensgrip">Jens Grip</a>, <a href="http://twitter.com/bjornalbertsson">Björn Albertsson</a>, <a href="http://twitter.com/ojohansson">Olof Johansson</a>, <a href="http://twitter.com/punktlars">Lars Berggren</a> and <a href="http://twitter.com/linusbohman">Linus Bohman</a></li>
        <li class="code">We're <a href="https://github.com/bohman/placepeer">open source on Github</a>!</li>
      </ul>
    </div>
  </div>

  <script type="text/javascript">
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-29696179-1']);
    _gaq.push(['_trackPageview']);
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  </script>
</body>
</html>
