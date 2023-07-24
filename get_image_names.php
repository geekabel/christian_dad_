<?php
// Directory path to the images folder
$imagesFolder = 'assets/img/';

// Initialize an array to hold the image names
$imageNames = [];

// Open the images folder
if ($handle = opendir($imagesFolder)) {
    // Read all the files in the directory
    while (false !== ($file = readdir($handle))) {
        // Check if the file is a valid image (you can add more image extensions if needed)
        $validExtensions = array('jpg', 'jpeg', 'png', 'gif');
        $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($extension, $validExtensions)) {
            // Add the image name to the array
            $imageNames[] = $file;
        }
    }
    // Close the directory handle
    closedir($handle);
}

// Encode the image names array as JSON and send the response
header('Content-type: application/json');
echo json_encode($imageNames);
