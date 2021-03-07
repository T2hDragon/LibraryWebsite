<?php

require_once("./Author.php");

class AuthorDao {

    private $connection;

    public function __construct() {
        $this->connection = $this->createConnection();
    }

    private function createConnection() {
        $host = 'db.mkalmo.xyz';
        $username = 'kaalte';
        $password = '30ed';
        $database = 'kaalte';
        $address = sprintf('mysql:host=%s;dbname=%s', $host, $database);
        try {
            return new PDO($address, $username, $password,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        } catch (PDOException $e) {
            throw new \http\Exception\RuntimeException("Can't connect");
        }
    }

    function findAll() {
        $connection = $this->createConnection();

        $statement = $connection->prepare("SELECT * FROM author");


        $statement->execute();

        $authors = [];
        foreach ($statement->fetchAll() as $authorDataArray) {
            $authors[] = new Author(intval($authorDataArray["author_id"]), $authorDataArray["first_name"], $authorDataArray["last_name"], intval($authorDataArray["grade"]));
        }


        return $authors;
    }

    public function findById($id) {
        $connection = $this->createConnection();

        $statement = $connection->prepare("SELECT * FROM author WHERE author_id = :author_id");

        $statement->bindValue(":author_id", $id);

        $statement->execute();
        $authorDataArray = $statement->fetchAll()[0];

        return new Author(intval($authorDataArray["author_id"]), $authorDataArray["first_name"], $authorDataArray["last_name"], intval($authorDataArray["grade"]));
    }

    public function save($author) {
        $connection = $this->createConnection();

        $statement = $connection->prepare("INSERT INTO author(first_name, last_name, grade) VALUES (:first_name, :last_name, :grade)");

        $statement->bindValue(":first_name", $author->firstName);
        $statement->bindValue(":last_name", $author->lastName);
        $statement->bindValue(":grade", $author->grade);

        $statement->execute();

        return $connection->lastInsertId();
    }

    public function update($author) {
        $connection = $this->createConnection();

        $statement = $connection->prepare("UPDATE author SET first_name = :first_name,last_name = :last_name,grade = :grade WHERE author_id = :author_id");

        $statement->bindValue(":first_name", $author->firstName);
        $statement->bindValue(":last_name", $author->lastName);
        $statement->bindValue(":grade", $author->grade);
        $statement->bindValue(":author_id", $author->id);

        $statement->execute();
    }

    public function deleteById($id) {

        $connection = $this->createConnection();

        $statement = $connection->prepare("DELETE FROM author_book WHERE author_id = :author_id");

        $statement->bindValue(":author_id", $id);

        $statement->execute();

        $statement = $connection->prepare("DELETE FROM author WHERE author_id = :author_id");

        $statement->bindValue(":author_id", $id);

        $statement->execute();
    }

}
