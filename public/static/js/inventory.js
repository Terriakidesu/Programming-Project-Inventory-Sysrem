
let searchResults = [];
let isSearching = false;

function renderProduct(index, id, data) {

    let inventoryItems = document.querySelector("div.inventoryItems");

    let keys = Object.keys(data);
    keys = keys.splice(2, keys.length - 1);

    let inventoryItem = document.createElement("div");
    inventoryItem.classList.add("inventoryItem");


    if (!searchResults.includes(id) && isSearching) {
        inventoryItem.classList.add("hidden");
    }

    inventoryItem.setAttribute("product-id", id)

    let indexSpan = document.createElement("span");
    indexSpan.classList.add("inventoryItemLabel");
    indexSpan.textContent = index + 1;
    inventoryItem.appendChild(indexSpan);

    for (let i = 0; i < 6; i++) {
        let span = document.createElement("span");
        span.classList.add("inventoryItemLabel");

        span.textContent = data[keys[i]];
        inventoryItem.appendChild(span);
    }

    let actionsSpan = document.createElement("span");
    actionsSpan.classList.add("inventoryItemLabel");

    let editButton = document.createElement("span");
    editButton.classList.add("actionButton");
    let editIcon = document.createElement("i");
    editIcon.className = "fa-solid fa-pen";
    editButton.appendChild(editIcon);

    editButton.addEventListener("click", async ev => {
        await editProduct(id);
    });

    actionsSpan.appendChild(editButton);


    let deleteButton = document.createElement("span");
    deleteButton.classList.add("actionButton");
    deleteButton.classList.add("red");
    let deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-solid fa-trash-can";
    deleteButton.appendChild(deleteIcon);

    deleteButton.addEventListener("click", async ev => {
        await deleteProduct(id);
    })

    actionsSpan.appendChild(deleteButton);

    inventoryItem.appendChild(actionsSpan);
    inventoryItems.appendChild(inventoryItem)
}


async function loadProducts() {

    await fetch("/api/products/all", {
        "method": "get"
    }).then(async (res) => {

        let data = await res.json();
        let inventoryItems = document.querySelector("div.inventoryItems");

        inventoryItems.replaceChildren();

        for (let i = 0; i < data.length; i++) {

            let product_id = data[i]["id"];

            renderProduct(i, product_id, data[i]);
        }

    }).catch(reason => {
        console.error(reason)
    });

}


async function editProduct(id) {

    let form = document.getElementById("form");
    form.action = "/api/products/edit";

    await fetch(`/api/products/${id}`).then(async res => {

        let data = await res.json();

        let keys = Object.keys(data);

        for (let key of keys) {
            let element = document.querySelector(`input[name=${key}]`);
            element.value = data[key];
        }

    });

    openViewer();
}

function addProduct() {

    let form = document.getElementById("form");
    form.action = "/api/products/save";
    let formData = new FormData(form);

    for (let key of formData.keys()) {

        let elem = document.querySelector(`input[name=${key}]`);

        if (elem.type == "text" || elem.type == "hidden") elem.value = ""
        else if (elem.type == "number") elem.value = 0

    }

    openViewer();

}

async function deleteProduct(id) {
    if (window.confirm("Are you sure?")) {

        await fetch(`/api/products/delete/${id}`, {
            method: "post"
        }).then(async res => {

            let data = await res.json();
            if (data.success) return loadProducts();
            window.alert(data.message);

        })

    }

}

window.addEventListener("DOMContentLoaded", async () => {

    loadProducts();

    const eventSource = new EventSource("/api/database/status");

    let lastChangedValue = false;
    let hasChanged = false;

    eventSource.addEventListener("databaseStatus", async (event) => {
        let data = JSON.parse(event.data);

        if (data.changed) {
            if (!hasChanged) {
                await loadProducts();
                hasChanged = true;
            };

            if (data.changed !== lastChangedValue) hasChanged = false;
        }

        lastChangedValue = data.changed;

    });

    let form = document.getElementById("form");

    form.addEventListener("submit", async ev => {
        ev.preventDefault();

        let formData = new FormData(form);

        await fetch(form.action, {
            method: form.method,
            body: formData
        }).then(async res => {
            let result = await res.json();

            if (result.success) {
                loadProducts();
                closeViewer();
                return;
            } else {
                alert("Saving Unsuccessful! " + result.message);
            }

        });
    });

    let searchForm = document.getElementById("searchForm");

    searchForm.addEventListener("input", async ev => {
        ev.preventDefault();

        let formData = new FormData(searchForm);

        await fetch(searchForm.action, {
            method: searchForm.method,
            body: formData
        }).then(async res => {

            searchResults = await res.json();

            isSearching = !(formData.get("query").trim() === "")

            loadProducts();
        });


    });

});
