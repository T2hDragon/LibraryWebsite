import { navigateTo } from "../router.js";
import { elem, formGroup, displayErrors } from "../elements.js";

const author = async (params) => {
    document.title = "Autor";
    const page = elem("div");
    page.id = "page-container";

    const authorId = params.get("id");
    let author;
    if (authorId) {
        author = await fetch(`/api/index.php?cmd=findById&item=author&id=${encodeURIComponent(authorId)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response;
            })
            .then(response => response.json())
            .catch(error => console.log("Author not found"));
    }

    if (author) {
        const contactEditForm = createContactEditForm(author);
        page.appendChild(contactEditForm);
    } else {
        const alert = elem("div", "Autorit ei leitud");
        alert.className = "alert alert-danger";
        alert.role = "alert";
        page.appendChild(alert);
    }

    return page;
}

function createContactEditForm(author) {
    const firstNameGroup = formGroup("Autori eesnimi", "firstName", author.firstName);
    const lastNameGroup = formGroup("Autori perenimi", "lastName", author.lastName);
    const gradeGroup = formGroup("Autori hinne", "grade", author.grade);

    const submitButton = elem("button", "Salvesta");
    submitButton.className = "btn btn-primary";
    submitButton.type = "button";
    submitButton.addEventListener("click", e => {
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const grade = document.getElementById("grade").value;

        const update = {
            firstName,
            lastName,
            grade
        };

        fetch(`/api/index.php?cmd=edit&item=author&id=${encodeURIComponent(author.id)}`, {
            method: "POST",
            body: JSON.stringify(update)
            })
            .then(async response => {
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
                navigateTo("/?updated=true", );
            })
            .catch(error => displayErrors(error.errorBody.errors));

    });

    return elem("form",
        firstNameGroup,
        lastNameGroup,
        gradeGroup,
        submitButton);
}

export default author;