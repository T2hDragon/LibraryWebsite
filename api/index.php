<?php
require_once("Author.php");
require_once("AuthorDao.php");
require_once("BookDao.php");
require_once("Book.php");
require_once("functions.php");

$authorDao = new AuthorDao();
$bookDao = new BookDao();

$cmd = "findAll";
if (isset($_GET["cmd"])) {
    $cmd = $_GET["cmd"];
}

$item = "book";
$currentDao = new BookDao();
if (isset($_GET["item"])){
    $item = $_GET['item'];
    if ($item == "author"){
        $currentDao = new AuthorDao();
    }

}

if ($cmd === "findAll") {

    $objects = [];

    $objects = $currentDao->findAll();

    printJson($objects);

} else if ($cmd === "findById") {

    $id = intval($_GET["id"]);

    $object = $currentDao->findById($id);

    if ($object == null) {
        http_response_code(404);
    } else {
        printJson($object);
    }

} else if ($cmd === "add") {

    $json = file_get_contents("php://input");
    $data = json_decode($json, true);
    if($item ==="book"){
        $object =  Book::fromAssocArray($data);
    } else {
        $object =  Author::fromAssocArray($data);
    }
    $errors = $object->validate();

    if (count($errors) > 0) {
        http_response_code(400);
        printJson(["errors" => $errors]);
    } else {
        $currentDao->save($object);

        printJson($object);
    }

} else if ($cmd === "edit") {

    $json = file_get_contents("php://input");
    $data = json_decode($json, true);
    $id = $_GET["id"];
    if($item ==="book"){
        $object = Book::fromAssocArray($data);
    } else {
        $object = Author::fromAssocArray($data);
    }
    $object->id = $id;
    $errors = $object->validate();

    if (count($errors) > 0) {
        http_response_code(400);
        printJson(["errors" => $errors]);
    } else {
        $currentDao->update($object);
        printJson($object);
    }

} else if ($cmd === "delete") {

    $id = intval($_GET["id"]);
    $currentDao->deleteById($id);
    http_response_code(204);

} else {
    http_response_code(400);
    printJson(["error" => "Unknown command: ${cmd}"]);
}