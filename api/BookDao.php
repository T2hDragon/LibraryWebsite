<?php

require_once("./Book.php");
require_once("./Author.php");


class BookDao
{

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

    function save(Book $book) : int
    {
        $connection = $this->createConnection();

        $statement = $connection->prepare("INSERT INTO book(title, grade, is_read) VALUES (:title, :grade, :isRead)");

        $statement->bindValue(":title", $book->title);
        $statement->bindValue(":grade", $book->grade);
        $statement->bindValue(":isRead", ($book->isRead ? "true" : "false"));

        $statement->execute();

        $this->addAuthorsLinksByIds($connection->lastInsertId(), $book->authors);

        return $connection->lastInsertId();
    }

    function update(Book $book)
    {
        $connection = $this->createConnection();

        $statement = $connection->prepare("UPDATE book SET title = :title, grade = :grade, is_read = :isRead WHERE book_id = :bookId");

        $statement->bindValue(":title", $book->title);
        $statement->bindValue(":grade", $book->grade);
        $statement->bindValue(":isRead", ($book->isRead ? "true" : "false"));
        $statement->bindValue(":bookId", $book->id);

        $statement->execute();


        $this->deleteAuthorLinksById($book->id);
        $this->addAuthorsLinksByIds($book->id, $book->authors);

    }



    function deleteById($bookId)
    {

        $this->deleteAuthorLinksById($bookId);

        $connection = $this->createConnection();


        $statement = $connection->prepare("DELETE FROM book WHERE book_id = :book_id");

        $statement->bindValue(":book_id", $bookId);

        $statement->execute();


    }

    function findById($bookId) : Book
    {
        $connection = $this->createConnection();

        $statement = $connection->prepare("SELECT book.book_id, book.title AS book_title, book.grade AS book_grade, book.is_read AS book_is_read, author.author_id, author.first_name AS author_first_name, author.last_name AS author_last_name, author.grade as author_grade FROM book
                                                                                                                                                 LEFT JOIN author_book ON book.book_id = author_book.book_id
                                                                                                                                                 LEFT JOIN author ON author.author_id = author_book.author_id WHERE book.book_id = $bookId");
        $statement->execute();

        $bookDataArray = $statement->fetchAll();
        $book = new Book(
            intval($bookDataArray[0]['book_id']),
            $bookDataArray[0]['book_title'],
            intval($bookDataArray[0]["book_grade"]),
            $bookDataArray[0]["book_is_read"] === 'true',
            []
        );
        if (isset($bookDataArray[0]['author_id'])){
            foreach ($bookDataArray as $bookData) {
                $author = new Author(
                    intval($bookData["author_id"]),
                    $bookData["author_first_name"],
                    $bookData["author_last_name"],
                    intval($bookData["author_grade"])
                );
                $book->addAuthor($author);
            }
        }
        return $book;
    }

    function findAll() : array
    {
        $connection = $this->createConnection();

        $statement = $connection->prepare("SELECT book.book_id, book.title AS book_title, book.grade AS book_grade, book.is_read AS book_is_read, author.author_id, author.first_name AS author_first_name, author.last_name AS author_last_name, author.grade as author_grade FROM book
                                                                                                                                                 LEFT JOIN author_book ON book.book_id = author_book.book_id
                                                                                                                                                 LEFT JOIN author ON author.author_id = author_book.author_id");
        $statement->execute();
        $references = [];
        $booksArray = [];
        foreach ($statement->fetchAll() as $bookData) {
            $bookId = $bookData["book_id"];
            $author = ($bookData["author_id"] == null)
                ? ''
                : new Author(
                    intval($bookData["author_id"]),
                    $bookData["author_first_name"],
                    $bookData["author_last_name"],
                    intval($bookData["author_grade"])
                );

            if (!(array_key_exists($bookId, $references))) {
                $references[$bookData['book_id']] = count($booksArray);
                $booksArray[] = new Book(
                    intval($bookData['book_id']),
                    $bookData['book_title'],
                    intval($bookData["book_grade"]),
                    $bookData["book_is_read"] === 'true',
                    [$author]
                );
            } else {
                $booksArray[$references[$bookId]]->addAuthor($author);
            }

        }
        return $booksArray;
    }


    private function getAuthorsById($bookId) : array
    {
        $connection = $this->createConnection();

        $statement = $connection->prepare("SELECT * FROM author WHERE author_id IN 
                           (SELECT author_id FROM author_book WHERE book_id = :book_id);");

        $statement->bindValue(":book_id", $bookId);

        $statement->execute();

        $authors = [];
        foreach ($statement->fetchAll() as $authorData) {
            $authors[] = new Author(
                intval($authorData['author_id']),
                $authorData['first_name'],
                $authorData['last_name'],
                intval($authorData['grade'])
            );
        }
        return $authors;
    }



    private function addAuthorsLinksByIds($bookId, $authorIds)
    {
        if (count($authorIds) != 0) {
            $connection = $this->createConnection();
            foreach ($authorIds as $authorId) {
                $statement = $connection->prepare("INSERT INTO author_book(author_id, book_id) VALUES (:author_id, :book_id)");

                $statement->bindValue(":author_id", $authorId);
                $statement->bindValue(":book_id", $bookId);

                $statement->execute();
            }


        }
    }

    private function deleteAuthorLinksById($bookId)
    {
        $connection = $this->createConnection();

        $statement = $connection->prepare("DELETE FROM author_book WHERE book_id = :book_id");

        $statement->bindValue(":book_id", $bookId);

        $statement->execute();


    }

}