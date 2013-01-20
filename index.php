<?php
  // Normalize the input variables.
  date_default_timezone_set('Europe/Stockholm');
  $search_date = date('Y-m-d');
?>

<!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Placepeer</title>
  <link href='http://fonts.googleapis.com/css?family=Montez' rel='stylesheet' type='text/css'>
  <link href='http://fonts.googleapis.com/css?family=Ubuntu:300,400,500' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" id="jquery-ui-css"  href="css/zoomer-base/jquery-ui-1.8.20.custom.css" type="text/css" media="all">
  <link rel="stylesheet" id="placepeer-reusables"  href="css/reusables.css" type="text/css" media="all">
  <link rel="stylesheet" id="placepeer-animations"  href="css/animations.css" type="text/css" media="all">
  <link rel="stylesheet" id="placepeer-style"  href="css/style.css" type="text/css" media="all">
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
  <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyCBZ5stPtmfRqLgbtjwd-SCGApkG_OlnDU&sensor=false&libraries=geometry"></script>
  <script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobubble/src/infobubble.js"></script>
  <script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js"></script>
  <script type="text/javascript" src="https://www.google.com/jsapi"></script>
  <script type="text/javascript" src="js/jqueryuicustom.js"></script>
  <?php /* <script type="text/javascript" src="js/jquery.noisy.min.js"></script> */ ?>
  <script type="text/javascript" src="js/jquery.scrollTo-1.4.2-min.js"></script>
  <script type="text/javascript" src="js/jquery.cookie.js"></script>
  <script type="text/javascript" src="js/pp-utils.js"></script>
  <script type="text/javascript" src="js/pp-map.js"></script>
  <script type="text/javascript" src="js/pp-interface.js"></script>
</head>
<body>

  <div id="header" class="gradient-blue subtle-shadow">
    <a id="logo" href="/"><h1 class="placepeer">Placepeer</h1><p class="version">Beta 0.8</p><p class="about">About this project</p></a>
    <div class="social-media">
      <p>Donate</p>
      <a class="flattr" href="http://flattr.com/thing/834017/Placepeer" target="_blank">Flattr Placepeer!</a>
      <p>Share</p>
      <a class="facebook" href="http://www.facebook.com/sharer.php?s=100&p[title]=Placepeer&p[summary]=Placepeer%20-%20an%20awesome%20way%20to%20see%20what's%20happening%20where!&p[url]=http%3A%2F%2Fplacepeer.com&p[images][0]=http://placepeer.com/graphics/logo.png" target="_blank">Share Placepeer on Facebook</a>
      <a class="twitter" href="http://twitter.com/share?url=http%3A%2F%2Fplacepeer.com&text=Placepeer%20-%20an%20awesome%20way%20to%20see%20what's%20happening%20where!" target="_blank">Share Placepeer on Twitter</a>
    </div>
  </div>

  <form id="controls" method="get" action="<?php print $_SERVER['REQUEST_URI']; ?>">
    <div id="sidebar" class="subtle-shadow">
      <div class="form-item geo gradient-light-grey">
        <label for="jumpToLocation">Jump to location:</label>
        <input type="text" name="jumpToLocation" class="jumpToLocation" placeholder="Jump to location" />
      </div>
      <div class="form-item keyword gradient-light-grey">
        <label for="searchQuery">Search for keyword:</label>
        <input type="text" name="searchQuery" class="searchQuery" placeholder="Search for keyword" />
      </div>
      <div class="form-item date gradient-light-grey">
        <label for="searchDate">Date:</label>
        <input type="text" name="searchDate" class="searchDate" value="<?php print $search_date; ?>" />
      </div>
      <div class="form-item submit gradient-dark-grey">
        <input class="submit" type="submit" value="Search and display" />
      </div>
      <div id="list"></div>
    </div>

    <div id="map">
      <div id="map-canvas"></div>
      <div id="map-overlay">
        <?php /*
          The following link should only be shown in small resolutions (read: phones). Commented out for now.
          <a href="#" id="toggle-sidebar"><b>Toggle</b></a>
        */ ?>
        <div id="zoom">
          <label for="zoom">Zoom:</label>
        </div>
      </div>
    </div>
  </form>

  <div id="about-placepeer" class="overlay hidden">
    <div class="overlay-back"></div>
    <div class="overlay-content">
      <a href="#" class="close-button">close</a>
      <div class="overlay-header gradient-blue">
        <h2 class="placepeer">Placepeer</h2>
      </div>
      <p>Placepeer fetches information to show you what and where stuff happens.</p>
      <p>Want to find pics from the concert you attended, find someone who is reporting live from a war zone or just find out where the hipsters are having their coffee? This is the place for you.</p>
      <p>We place social media content on a map and make it fun to explore. This way you get a chance to stumble upon events and people that would never show in the usual media flow. Yay!</p>
      <p>This is pretty much just a proof of concept. An awesome proof of concept of course, but there might be a few errors here and there. Some are due to API limitations. Some might be because we had too much coffee while building it. Feel free to contact us on Twitter or Github to let us know about your finding. Or better yet - fix the problem yourself!</p>
      <ul>
        <li class="companies">Sponsored by <a href="http://oddhill.se">Odd Hill</a>, <a href="http://040.se">040</a> and <a href="http://mediegymnasiet.net">Mediegymnasiet</a></li>
        <li class="people">Built by <a href="http://twitter.com/jensgrip">Jens Grip</a>, <a href="http://twitter.com/bjornalbertsson">Björn Albertsson</a>, <a href="http://twitter.com/ojohansson">Olof Johansson</a>, <a href="http://twitter.com/punktlars">Lars Berggren</a> and <a href="http://twitter.com/linusbohman">Linus Bohman</a></li>
        <li class="code">We're <a href="https://github.com/bohman/placepeer">open source on Github</a>!</li>
      </ul>
    </div>
  </div>

  <?php /* Google Aalytics */ ?>
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
