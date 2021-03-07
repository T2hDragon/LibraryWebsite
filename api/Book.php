<?php


class Book
{
    public string $title;
    public int $grade;
    public bool $isRead;
    public array $authors;
    public $id;

    public function __construct($id, $title, $grade, $isRead, $authors) {
        $this->title = $title;
        $this->grade = $grade;
        $this->isRead = $isRead;
        if (!$authors){
            $this->authors = [];
        } else {
            $this->authors = $authors;
        }
        $this->id = $id;
    }


    public function validate() {
        $errors = [];
        if (strlen($this->title) < 3){
            $errors[] = 'Pealkiri peab sisaldama vähemalt 3 tähte';

        } else if (strlen($this->title) > 23){
            $errors[] = 'Pealkiri peab sisaldama alla 24 tähte';
        }
        return $errors;
    }


    public function addAuthor($author)
    {
        $this->authors[] = $author;
    }


    public static function fromAssocArray($array) {
        return new Book(null, $array['title'], $array['grade'], $array['isRead'], $array['authors']);
    }
}