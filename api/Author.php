<?php

class Author {
    public string $firstName;
    public string $lastName;
    public $id;
    public int $grade;

    public function __construct($id, $firstName, $lastName,  $grade) {
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->id = $id;
        $this->grade = $grade;
    }

    public function validate() {
        $errors = [];
        if (strlen($this->firstName) < 1){
            $errors[] = 'Eesnimi peab sisaldama vähemalt 1 tähte';

        } else if (strlen($this->firstName) > 21){
            $errors[] = 'Eesnimi peab sisaldama alla 22 tähte';
        }

        if (strlen($this->lastName) < 2){
            $errors[] = 'Perenimi peab sisaldama vähemalt 2 tähte';

        } else if (strlen($this->lastName) > 22){
            $errors[] = 'Perenimi peab sisaldama alla 23 tähte';
        }
        if (strlen($this->grade) < 0){
            $errors[] = 'Hinne peab olema vähemalt 0';

        } else if (strlen($this->grade) > 5){
            $errors[] = 'Hinne peab olema alla 6';
        }

        return $errors;
    }


    public static function fromAssocArray($array) {
        return new Author(null, $array['firstName'], $array['lastName'], $array['grade']);
    }
}
