import { elem } from "../elements.js";

const authors = async (params) => {
    document.title = "Autorid";

    const authors = await fetch("/api/index.php?cmd=findAll&item=author")
        .then(response => response.json());

    const page = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = "Autorid";
    page.appendChild(title);

    const tbody = elem("tbody");
    authors.forEach(author => {
        const row = elem("tr",
            elem("td", author.id),
            elem("td", linkToAuthor(author)),
            elem("td", author.lastName),
            elem("td", author.grade),
            elem("td", deleteContactButton(author))
        );

        tbody.appendChild(row);
    });

    const table = elem("table",
        elem("thead",
            elem("tr",
                elem("th", "ID"),
                elem("th", "Eesnimi"),
                elem("th", "Perenimi"),
                elem("th", "Hinne"),
                elem("th")
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
        fetch(`/api/index.php?cmd=delete&item=author&id=${author.id}`, { method: "POST" })
            .then(response => {
                if (response.ok) {
                    e.target.closest("tr").remove();
                }
            });
    });


    return button;
}

function linkToAuthor(author) {
    const link = elem("a", author.firstName);
    link.href = `/author?id=${encodeURIComponent(author.id)}`;
    link.setAttribute("data-link", "");
    return link;
}

export default authors;