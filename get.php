<?php

  if ($_GET['url']) {
    $curl = curl_init($_GET['url']);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, TRUE);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
    $response = curl_exec($curl);
    curl_close($curl);

    //parsing begins here:
    $doc = new DOMDocument();
    @$doc->loadHTML($response);
    $metas = $doc->getElementsByTagName('meta');

    $return = array();
    foreach ($metas as $meta) {
      if ($meta->getAttribute('property') == 'og:image') {
        $return['image'] = $meta->getAttribute('content');
      }
      elseif ($meta->getAttribute('property') == 'og:video') {
        $return['video'] = $meta->getAttribute('content');
      }
    }

    print json_encode($return);
  }

?>