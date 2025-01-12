
function renderProduct(index, data) {

    let inventoryItems = document.querySelector("div.inventoryItems");

    let keys = Object.keys(data);

    let inventoryItem = document.createElement("div");
    inventoryItem.classList.add("inventoryItem");

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
    actionsSpan.appendChild(editButton);

    let deleteButton = document.createElement("span");
    deleteButton.classList.add("actionButton");
    deleteButton.classList.add("red");
    let deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-solid fa-trash-can";
    deleteButton.appendChild(deleteIcon);
    actionsSpan.appendChild(deleteButton);


    inventoryItem.appendChild(actionsSpan);

    inventoryItems.appendChild(inventoryItem)
}

async function loadProducts() {

    await fetch("/api/products/all", {
        "method": "get"
    }).then(async (res) => {

        let data = await res.json();

        for (let i = 0; i < data.length; i++) {

            renderProduct(i, data[i]);
        }

    })
}

window.addEventListener("DOMContentLoaded", async () => {

    await loadProducts();

    // setInterval(async () => {
    //     loadProducts();
    // }, 1000);
});
