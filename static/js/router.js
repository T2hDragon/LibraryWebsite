import authors from "./views/authors.js";
import addAuthor from "./views/addAuthor.js";
import author from "./views/author.js";
import books from "./views/books.js";
import addBook from "./views/addBook.js";
import book from "./views/book.js";

export const navigateTo = (path) => {
    history.pushState(null, null, path);
    router();
}

const removeAllChildNodes = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export const router = async () => {
    const routes = [
        { path: "/", renderView: books},
        { path: "/add-book", renderView: addBook},
        { path: "/books", renderView: books},
        { path: "/book", renderView: book},
        { path: "/add-author", renderView: addAuthor },
        { path: "/authors", renderView: authors },
        { path: "/author", renderView: author }
    ];
    const defaultRoute = routes[0];
    const currentPath = location.pathname;
    const params = new URLSearchParams(location.search);

    const routeMatch = routes.find(route => route.path === currentPath);

    const app = document.getElementById("app");
    removeAllChildNodes(app);
    if (routeMatch) {
        const view = await routeMatch.renderView(params)
        app.appendChild(view);
    } else {
        const view = await defaultRoute.renderView(params);
        app.appendChild(view);
    }
}