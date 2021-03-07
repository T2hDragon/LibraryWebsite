import { elem } from "../elements.js";

const books = async (params) => {
    document.title = "Raamatud";

    const books = await fetch("/api/index.php?cmd=findAll&item=book")
        .then(response => response.json());

    const page = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = "Raamatud";
    page.appendChild(title);

    const tbody = elem("tbody");
    books.forEach(book => {
        const row = elem("tr",
            elem("td", linkToBook(book)),
            elem("td", authorsToString(book.authors)),
            elem("td", book.grade),
        );

        tbody.appendChild(row);
    });

    const table = elem("table",
        elem("thead",
            elem("tr",
                elem("th", "Tiitel"),
                elem("th", "Autorid"),
                elem("th", "Hinne")
            )
        ),
        tbody
    )
    table.className = "table";

    if (params.get('saved') && params.get('saved') === "true") {
        const alert = elem("div", "Salvestamine õnnestus");
        alert.className = "alert alert-success";
        alert.role = "alert";

        page.appendChild(alert);
    } else  if (params.get('updated') && params.get('updated') === "true") {
        const alert = elem("div", "Uuendamine õnnestus");
        alert.className = "alert alert-success";
        alert.role = "alert";

        page.appendChild(alert);
    } else if (params.get('deleted') && params.get('deleted') === "true") {
        const alert = elem("div", "Kustutamine õnnestus");
        alert.className = "alert alert-success";
        alert.role = "alert";

        page.appendChild(alert);
    }

    page.appendChild(table);
    return page;
}

function deleteContactButton(author) {
    const button = elem("button", "Kustuta");
    button.className = "btn btn-danger";
    button.type = "button";

    button.addEventListener("click", e => {
        fetch(`/api/index.php?cmd=delete&item=book&id=${author.id}`, { method: "POST" })
            .then(response => {
                if (response.ok) {
                    e.target.closest("tr").remove();
                }
            });
    });


    return button;
}

function linkToBook(book) {
    const link = elem("a", book.title);
    link.href = `/book?id=${encodeURIComponent(book.id)}`;
    link.setAttribute("data-link", "");
    return link;
}

function authorsToString(authors){
    let authorsString = "";
    authors.forEach(author => {
            if (author) {
                if (authorsString.length !== 0) {
                    authorsString += ", "
                }
                authorsString += author.firstName + " " + author.lastName;
            }
        }
    );
    return authorsString;
}

export default books;