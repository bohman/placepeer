<!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Placepeer</title>
  <link rel='stylesheet' id='placepeer-css'  href='css/style.css' type='text/css' media='all' />
  <script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'></script>
  <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyCBZ5stPtmfRqLgbtjwd-SCGApkG_OlnDU&sensor=false"></script>
  <script type='text/javascript' src='utils.js'></script>
  <script type='text/javascript' src='map.js'></script>
  <script type='text/javascript' src='interface.js'></script>
</head>
<body>
  
  <div id="header">
    <a id="logo" href=""><img src="graphics/logo.png"></a>
    <div class="dropdown">
      List
    </div>
    <div class="addthis_toolbox addthis_default_style ">
      <a class="addthis_button_facebook_like" fb:like:layout="button_count"></a>
      <a class="addthis_button_tweet"></a>
      <a class="addthis_button_google_plusone" g:plusone:size="medium"></a>
      <a class="addthis_counter addthis_pill_style"></a>
    </div>
    <script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4f53724c3a21b3bc"></script>
  </div>
  
  <!--<div id="list-wrapper">
    en list-wrapper!
  </div>-->
  
  <div id="map">
    <div id="map-canvas"></div>
  </div>

  <form id="controls" method="get" action="<?php $_SERVER['REQUEST_URI']; ?>">
    <p><label for="searchQuery">Query:</label> <input type="text" name="searchQuery" class="searchQuery" /></p>
    <p><label for="searchDate">Date:</label> <input type="text" name="searchDate" class="searchDate" /></p>
    <p>
      <input type="hidden" name="searchLat" class="searchLat" value="" />
      <input type="hidden" name="searchLon" class="searchLon" value="" />
      <input type="hidden" name="searchRadius" class="searchRadius" value="" />
      <input type="hidden" name="mapZoomLevel" class="mapZoomLevel" value="" />
      <input class="submit" type="submit" value="Go" />
    </p>
  </form>

  <!--<div id="timeline">
    timeline
  </div>-->

  <!--<div id="footer">
    footer
  </div>-->

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
