import { navigateTo } from "../router.js";
import { elem, formGroup, displayErrors } from "../elements.js";

const book = async (params) => {
    document.title = "Raamat";
    const page = elem("div");
    page.id = "page-container";

    const authorId = params.get("id");
    let book;
    if (authorId) {
        book = await fetch(`/api/index.php?cmd=findById&title=book&id=${encodeURIComponent(authorId)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response;
            })
            .then(response => response.json())
            .catch(error => console.log("Book not found"));
    }
    if (book) {
        const contactEditForm = createContactEditForm(book);
        page.appendChild(contactEditForm);
    } else {
        const alert = elem("div", "Raamatut ei leitud");
        alert.className = "alert alert-danger";
        alert.role = "alert";
        page.appendChild(alert);
    }

    return page;
}

function createContactEditForm(book) {

    const authors = fetch("/api/index.php?cmd=findAll&item=author")
        .then(response => response.json());

    let authorIds =[];
    authorIds[0] = (book.authors.length > 0) ? book.authors[0].id : -1;
    authorIds[1] = (book.authors.length > 1)? book.authors[1].id : -1;


    const titleGroup = formGroup("Raamatu tiitel", "title", book.title);
    const gradeGroup = formGroup("Raamatu hinne", "grade", book.grade, "radio", 5);
    const isReadGroup = formGroup("Loetud", "isRead", book.isRead, "checkbox");
    const author1Group = formGroup("Esimene autor", "author1", authorIds[0], "authorSelection", 1, authors);
    const author2Group = formGroup("Teine autor", "author2", authorIds[1], "authorSelection", 2, authors);

    const deleteButton = elem("div", deleteContactButton(book));
    const submitButton = elem("button", "Salvesta");
    submitButton.className = "btn btn-primary submitButton";
    submitButton.type = "button";
    submitButton.id = "submitButton"
    submitButton.name = "submitButton"
    let clickCount = 0;
    submitButton.addEventListener("click", e => {
        if (clickCount === 0) {
            clickCount++;            //activate on first click only to avoid hiding again on multiple clicks
            // code here. // It will execute only once on multiple clicks

        const title = document.getElementById("title").value;
        const isRead = document.getElementById("isRead").checked;
        const author1 = document.getElementById("author1").value;
        const author2 = document.getElementById("author2").value;
        const authors = [];
        if (author1) {
            authors.push(author1);
        }
        if (author2 && author2 !== author1) {
            authors.push(author2);
        }

        let grade = null;
        const inputElements = document.getElementsByName('grade');
        for (let i = 0; inputElements[i]; ++i) {
            if (inputElements[i].checked) {
                grade = inputElements[i].value;
                break;
            }
        }
        const update = {
            title,
            grade,
            isRead,
            authors
        };

        fetch(`/api/index.php?cmd=edit&item=book&id=${encodeURIComponent(book.id)}`, {
            method: "POST",
            body: JSON.stringify(update)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                return response.json().then(errorBody => {
                    const error = new Error(response.statusText);
                    error.errorBody = errorBody;
                    throw error;
                });
            })
            .then(data => {
                navigateTo("/?updated=true",);
            })
            .catch(error => displayErrors(error.errorBody.errors));
    }

    });

    return elem("form",
        titleGroup,
        author1Group,
        author2Group,
        isReadGroup,
        gradeGroup,
        submitButton,
        deleteButton);
}

function deleteContactButton(author) {
    const button = elem("button", "Kustuta");
    button.className = "btn btn-primary";
    button.type = "button";
    button.id = "deleteButton"
    button.name = "deleteButton"
    let clickCount = 0;
    button.addEventListener("click", e => {
        if (clickCount === 0) {
            clickCount++;
            fetch(`/api/index.php?cmd=delete&item=book&id=${author.id}`, {method: "POST"}).then(() => navigateTo("/?deleted=true",))
        }
    });


    return button;
}

export default book;