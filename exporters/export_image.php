<?php

$dst_width = $_GET['w'];
$dst_height = $_GET['h'];

$base_url = "http://localhost/charts3d/files/";

if (isset($GLOBALS["HTTP_RAW_POST_DATA"])){
  // Get the data
  $image_data=$GLOBALS['HTTP_RAW_POST_DATA'];
  $filter_data=substr($image_data, strpos($image_data, ",")+1);
  $decoded_data=base64_decode($filter_data);
    
  $filename = '../files/'.strtotime("now").'.png';
    
  // Save file.
  if ( $fp = fopen( $filename, 'wb' ) ){
    fwrite( $fp, $decoded_data);
    fclose( $fp );
    echo 'Your image is <a href="'.$base_url
                                  .$filename.'" target="_blank">here</a>';
  }else{
    echo "Failed to save image";
  }

}else{
  echo "No image to upload!";
}
  

?>