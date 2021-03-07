export function elem(tagName, ...nodes) {
    const element = document.createElement(tagName);

    for (let node of nodes) {
        if (typeof node === "string" || typeof node === "number") {
            const textNode = document.createTextNode(node);
            element.appendChild(textNode);
        } else {
            element.appendChild(node);
        }
    }

    return element;
}



export function textInput(className, id, value) {
    const input = elem("input");
    input.className = className;
    input.id = id;
    input.name = id;
    input.type = "text";
    if (value) {
        input.value = value;
    }
    return input;
}
export function checkboxInput(className, id, checked) {
    const input = elem("input");
    input.className = className;
    input.type = "checkbox";
    input.id = id;
    if (checked) {
        input.checked = true;
    }
    return input;
}



export function radioInput (className, id, value = 1, amount) {
    const grades = elem("div");

    for (let i = 1; i <= amount; i++) {
        const input = elem("input");
        input.id = id;
        input.value = i;
        input.type = "radio";
        input.name = "grade"
        const label = elem("label");
        if (i === value){
            input.checked = true;
        }
        label.appendChild(input)
        label.appendChild(document.createTextNode(i));
        label.className = className;
        grades.appendChild(label)
    }
    return grades;
}

export function authorSelectionInput(className, selectId, inputId, value, authors) {
    const select = elem("select");
    select.className = className;
    select.id = selectId;
    select.appendChild(elem("option"))

    authors.then(authors =>{
        authors.forEach(author => {
            const option = elem("option");
            option.value = author.id;
            option.appendChild(document.createTextNode(author.firstName + " " + author.lastName));
            if (author.id === inputId){
                option.selected = true;
            }
            select.appendChild(option);
        });
    })

    return select;
}

export function formGroup(labelValue, inputId, inputValue, type="text", amount=1, authors=null) {
    const label = elem("label", labelValue);
    label.for = inputId;
    let input = textInput("form-control", inputId, inputValue);
    if (type === "checkbox"){
        input = checkboxInput("checkbox", inputId, inputValue);
    } else if (type ==="radio"){
        input = radioInput("grade", inputId, inputValue, amount);
    } else if (type ==="authorSelection"){
        input = authorSelectionInput("form-control", inputId, inputValue, amount, authors);
    }

    const group = elem("div", label, input);
    group.className = "form-group";

    return group;
}

export function errorBlock(errors) {
    const errorBlock = elem("div");
    errorBlock.id = "errors";
    errorBlock.className = "alert alert-danger";
    errorBlock.role = "alert";

    const list = elem("ul");
    for (let err of errors) {
        const listItem = elem("li", err);
        list.appendChild(listItem);
    }
    errorBlock.appendChild(list);

    return errorBlock;
}

export function displayErrors(errorList) {
    clearExistingErrorBlock();
    const errors = errorBlock(errorList);

    const page = document.getElementById("page-container");
    page.prepend(errors);
}

function clearExistingErrorBlock() {
    const errorBlock = document.getElementById("errors");
    if (errorBlock) {
        errorBlock.remove();
    }
}