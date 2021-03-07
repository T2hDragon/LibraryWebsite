import {elem, formGroup, displayErrors, textInput} from "../elements.js";
import { navigateTo } from "../router.js";

const addBook = async () => {
    document.title = "Raamatu lisamine";

    const page = elem("div");
    page.id = "page-container";
    const title = elem("h1", "Lisa Raamat");
    const form = await createContactAddForm();

    page.appendChild(title);
    page.appendChild(form);
    return page;
}

function createContactAddForm() {

    const authors = fetch("/api/index.php?cmd=findAll&item=author")
        .then(response => response.json());
    const titleGroup = formGroup("Raamatu tiitel", "title");
    const gradeGroup = formGroup("Raamatu hinne", "grade", 4, "radio", 5);
    const isReadGroup = formGroup("Loetud", "isRead", false, "checkbox");
    const author1Group = formGroup("Esimene Autor", "author1", -1, "authorSelection", 1, authors);
    const author2Group = formGroup("Teine autor", "author2", -1, "authorSelection", 2, authors);


    const submitButton = elem("button", "Salvesta");
    submitButton.name = 'submitButton';
    submitButton.className = "btn btn-primary submitButton";
    submitButton.type = "button";
    submitButton.id = "submitButton";
    let clickCount = 0
    submitButton.addEventListener("click", e => {
        if (clickCount === 0) {
            clickCount++;
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
        fetch(`/api/index.php?cmd=add&item=book`, {
            method: "POST",
            body: JSON.stringify(update)
        })
            .then(async response => {
                if (response.ok) {
                    return await response.json();
                }
                return await response.json().then(errorBody => {
                    const error = new Error(response.statusText);
                    error.errorBody = errorBody;
                    throw error;
                });
            })
            .then(data => {
                navigateTo("/?saved=true",);
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
        submitButton);
}

export default addBook;