<?php

$books = [
    1 => [
        'id' => 1,
        'title' => "Banaanid elu",
        'grade' => 5,
        'authorIDs' => [1, 2],
        'isRead' => true
    ],
    2 => [
        'id' => 2,
        'title' => "Banaani elu 2.0",
        'grade' => 3,
        'authorIDs' => [1],
        'isRead' => false
    ],

    3 => [
        'id' => 3,
        'title' => "Narkohollo",
        'grade' => 5,
        'authorIDs' => [3],
        'isRead' => true
    ]
];
$authors = [
    1 => [
        'id' => 1,
        'firstName' => "Ahv",
        'lastName' => "Bob",
        'grade' => 4
    ],

    2 => [
        'id' => 2,
        'firstName' => "Ahv",
        'lastName' => "Jeff",
        'grade' => 2
    ],

    3 => [
        'id' => 3,
        'firstName' => "Aidi",
        'lastName' => "Vallik",
        'grade' => 5
    ],

];

$host = 'db.mkalmo.xyz';
$username = 'kaalte';
$password = '30ed';
$database = 'kaalte';
$address = sprintf('mysql:host=%s;dbname=%s', $host, $database);
try {
    $connection = new PDO($address, $username, $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    throw new \http\Exception\RuntimeException("Can't connect");
}

$statement = $connection->prepare("DROP TABLE author_book");
$statement->execute();

$statement = $connection->prepare("DROP TABLE author");
$statement->execute();

$statement = $connection->prepare("DROP TABLE book");
$statement->execute();

$statement = $connection->prepare("CREATE TABLE book (
book_id INTEGER PRIMARY KEY AUTO_INCREMENT,
title varchar(255),
grade int,
is_read varchar(5))");
$statement->execute();


$statement = $connection->prepare("CREATE TABLE author (
author_id INTEGER PRIMARY KEY AUTO_INCREMENT,
first_name varchar(255),
last_name varchar(255),
grade int)");
$statement->execute();

$statement = $connection->prepare("CREATE TABLE author_book (
author_book_id INTEGER PRIMARY KEY AUTO_INCREMENT,
author_id int,
book_id int,
FOREIGN KEY(author_id) REFERENCES author(author_id),
FOREIGN KEY(book_id) REFERENCES book(book_id))");
$statement->execute();

foreach ($authors as $author) {
    $statement = $connection->prepare("INSERT INTO author(author_id, first_name, last_name, grade) VALUES (:authorId, :firstName, :lastName, :grade)");

    $statement->bindValue(":authorId", $author['id']);
    $statement->bindValue(":firstName", $author['firstName']);
    $statement->bindValue(":lastName", $author['lastName']);
    $statement->bindValue(":grade", $author['grade']);

    $statement->execute();
}

foreach ($books as $book) {
    $statement = $connection->prepare("INSERT INTO book(book_id,title, grade, is_read) VALUES (:bookId, :title, :grade, :isRead)");

    $statement->bindValue(":bookId", $book['id']);
    $statement->bindValue(":title", $book['title']);
    $statement->bindValue(":grade", $book['grade']);
    $statement->bindValue(":isRead", ($book['isRead']) ? 'true' : 'false');

    $statement->execute();
}

foreach ($books as $book) {
    foreach ($book['authorIDs'] as $authorId) {
        $statement = $connection->prepare("INSERT INTO author_book(author_id, book_id) VALUES (:authorId, :bookId)");

        $statement->bindValue(":authorId", $authorId);
        $statement->bindValue(":bookId", $book['id']);

        $statement->execute();
    }
}
$connection = null;


header("Location: index.php");
