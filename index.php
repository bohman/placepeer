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
  <script type="text/javascript" src="js/jqueryuicustom.js"></script>
  <?php /* <script type="text/javascript" src="js/jquery.noisy.min.js"></script> */ ?>
  <script type="text/javascript" src="js/pp-utils.js"></script>
  <script type="text/javascript" src="js/pp-map.js"></script>
  <script type="text/javascript" src="js/pp-interface.js"></script>
</head>
<body>
  
  <div id="header">
    <a id="logo" href="/"><b>Placepeer</b></a>
    <div class="addthis_toolbox addthis_default_style ">
      <a class="addthis_button_facebook_like" fb:like:layout="button_count"></a>
      <a class="addthis_button_tweet"></a>
      <a class="addthis_button_google_plusone" g:plusone:size="medium"></a>
      <a class="addthis_counter addthis_pill_style"></a>
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
