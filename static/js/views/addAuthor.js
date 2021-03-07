import { elem, formGroup, displayErrors} from "../elements.js";
import { navigateTo } from "../router.js";

const addAuthor = async () => {
    document.title = "Autori lisamine";

    const page = elem("div");
    page.id = "page-container";
    const title = elem("h1", "Lisa Autor");
    const form = createContactAddForm();

    page.appendChild(title);
    page.appendChild(form);
    return page;
}

function createContactAddForm() {
    const firstNameGroup = formGroup("Autori eesnimi", "firstName");
    const lastNameGroup = formGroup("Autori perenimi", "lastName");
    const gradeGroup = formGroup("Autori hinne", "grade");

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

        fetch(`/api/index.php?cmd=add&item=author`, {
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
                navigateTo("/?saved=true", );
            })
            .catch(error => displayErrors(error.errorBody.errors));

    });

    return elem("form",
        firstNameGroup,
        lastNameGroup,
        gradeGroup,
        submitButton);
}

export default addAuthor;