<?php

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header('Access-Control-Allow-Credentials: false');
    header('Access-Control-Max-Age: 0');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers:   {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
}


// Récupérer les données du formulaire
$nom = htmlspecialchars($_POST['nom']);
$prenom = htmlspecialchars($_POST['prenom']);
$lieu = htmlspecialchars($_POST['lieu']);
$message = htmlspecialchars($_POST['message']);

// var_dump($nom,$prenom,$message);
// Valider les données
$errors = [];

if (empty($nom)) {
    $errors[] = "Le champ Nom est obligatoire.";
}

if (empty($prenom)) {
    $errors[] = "Le champ Prénom est obligatoire.";
}

if (empty($lieu)) {
    $errors[] = "Le champ Lieu est obligatoire.";
}

if (empty($message)) {
    $errors[] = "Le champ Message est obligatoire.";
}

// Si des erreurs sont présentes, renvoyer une réponse JSON avec les erreurs
if (!empty($errors)) {
    $response = array('success' => false, 'errors' => $errors);
    echo json_encode($response);
    exit();
}

// Enregistrement des données dans un fichier JSON
$comment = array(
    'nom' => $nom,
    'prenom' => $prenom,
    'lieu' => $lieu,
    'message' => $message,
    'date' => date('Y-m-d H:i:s')
);

$commentsFile = 'comments.json';

if (!file_exists($commentsFile)) {
    file_put_contents($commentsFile, '[]');
}

$comments = json_decode(file_get_contents($commentsFile), true);
$comments[] = $comment;

file_put_contents($commentsFile, json_encode($comments));

// Envoyer une réponse JSON indiquant le succès de l'enregistrement
$response = array('success' => true, 'message' => 'Votre message d\'hommage enregistré avec succès');
echo json_encode($response);


?>
