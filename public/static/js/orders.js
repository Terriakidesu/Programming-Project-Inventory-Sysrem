let searchResults = [];
let isSearching = false;

/**
 * Loads the available products and display them.
 */
async function loadProducts() {

    let productItems = document.getElementById("orderDetailItems");

    await fetch("/api/products/all").then(async res => {

        let results = await res.json();

        // clears the elements children
        productItems.replaceChildren();

        for (let product of results) {
            // if the product is not the search result skip it
            if (!searchResults.includes(product.id) && isSearching) continue;
            // add the product as an element
            addProductItem(product);
        }
    });
}

/**
 * Loads the available orders and display them
 */
async function loadOrders() {
    let orderItems = document.getElementById("orderItems");

    await fetch("/api/orders/all").then(async res => {

        let results = await res.json();

        orderItems.replaceChildren();

        for (let order of results) {
            addOrderItem(order);
        }

    });
}

/**
 * Adds the product as an HTML element
 * @param {Object} product 
 */
function addProductItem(product) {

    let productItems = document.getElementById("orderDetailItems");

    const orderItem = document.createElement('div');
    orderItem.className = 'orderDetailItem';
    orderItem.setAttribute("product-id", product.id);

    const orderItemTitles = document.createElement('div');
    orderItemTitles.className = 'orderDetailItemTitles';

    titleElement = document.createElement('div');
    titleElement.id = 'orderDetailItemTitle';
    titleElement.textContent = product.name;
    orderItemTitles.appendChild(titleElement);


    const sizeLabel = document.createElement('div');
    sizeLabel.className = 'orderDetailItemLabel';
    const sizeSpan = document.createElement('span');
    sizeSpan.textContent = 'Size';
    const sizeValue = document.createElement('span');
    sizeValue.setAttribute('name', 'size');
    sizeValue.textContent = product.size;
    sizeLabel.appendChild(sizeSpan);
    sizeLabel.appendChild(sizeValue);
    orderItemTitles.appendChild(sizeLabel);

    const priceLabel = document.createElement('div');
    priceLabel.className = 'orderDetailItemLabel';
    const priceSpan = document.createElement('span');
    priceSpan.textContent = 'Price';
    const priceValue = document.createElement('span');
    priceValue.setAttribute('name', 'price_per_piece');
    priceValue.textContent = product.per_piece_price;
    priceLabel.appendChild(priceSpan);
    priceLabel.appendChild(priceValue);
    orderItemTitles.appendChild(priceLabel);

    const wholesaleQuantityLabel = document.createElement('div');
    wholesaleQuantityLabel.className = 'orderDetailItemLabel';
    const wholesaleQuantitySpan = document.createElement('span');
    wholesaleQuantitySpan.textContent = 'Wholesale Quantity';
    const wholesaleQuantityValue = document.createElement('span');
    wholesaleQuantityValue.setAttribute('name', 'wholesale_quantity');
    wholesaleQuantityValue.textContent = product.wholesale_quantity;
    wholesaleQuantityLabel.appendChild(wholesaleQuantitySpan);
    wholesaleQuantityLabel.appendChild(wholesaleQuantityValue);
    orderItemTitles.appendChild(wholesaleQuantityLabel);

    const wholesalePriceLabel = document.createElement('div');
    wholesalePriceLabel.className = 'orderDetailItemLabel';
    const wholesalePriceSpan = document.createElement('span');
    wholesalePriceSpan.textContent = 'Wholesale Price';
    const wholesalePriceValue = document.createElement('span');
    wholesalePriceValue.setAttribute('name', 'wholesale_price');
    wholesalePriceValue.textContent = product.wholesale_price;
    wholesalePriceLabel.appendChild(wholesalePriceSpan);
    wholesalePriceLabel.appendChild(wholesalePriceValue);
    orderItemTitles.appendChild(wholesalePriceLabel);

    orderItem.appendChild(orderItemTitles);

    const orderItemDetails = document.createElement('div');
    orderItemDetails.className = 'orderDetailItemDetails';

    const costLabel = document.createElement('div');
    costLabel.className = 'orderDetailItemLabel';
    const costSpan = document.createElement('span');
    costSpan.textContent = 'Cost';
    const costValue = document.createElement('span');
    const costIcon = document.createElement('i');
    costIcon.className = 'fa solid fa-peso-sign';
    const costValueText = document.createElement("span");
    costValueText.setAttribute("name", "cost");
    costValueText.textContent = '0';
    costValue.appendChild(costIcon);
    costValue.append(costValueText);
    costLabel.appendChild(costSpan);
    costLabel.appendChild(costValue);
    orderItemDetails.appendChild(costLabel);

    const quantityTitle = document.createElement('div');
    quantityTitle.className = 'orderDetailItemQuantityTitle';
    quantityTitle.textContent = 'Quantity';
    orderItemDetails.appendChild(quantityTitle);

    const orderItemButtons = document.createElement('div');
    orderItemButtons.className = 'orderDetailItemButtons';

    const buttonMinusWholesale = document.createElement('button');
    buttonMinusWholesale.type = 'button';
    const minusIconWholesale = document.createElement('i');
    minusIconWholesale.className = 'fa-solid fa-minus';
    buttonMinusWholesale.appendChild(minusIconWholesale);
    const wholesaleQuantitySpan10 = document.createElement('span');
    wholesaleQuantitySpan10.setAttribute('name', 'wholesale_quantity');
    wholesaleQuantitySpan10.textContent = product.wholesale_quantity;
    buttonMinusWholesale.appendChild(wholesaleQuantitySpan10);
    orderItemButtons.appendChild(buttonMinusWholesale);

    const buttonMinus = document.createElement('button');
    buttonMinus.type = 'button';
    const minusIcon = document.createElement('i');
    minusIcon.className = 'fa-solid fa-minus';
    buttonMinus.appendChild(minusIcon);
    orderItemButtons.appendChild(buttonMinus);

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.className = 'orderItemQuantity';
    quantityInput.min = 0;
    quantityInput.value = 0;
    orderItemButtons.appendChild(quantityInput);

    const buttonPlus = document.createElement('button');
    buttonPlus.type = 'button';
    const plusIcon = document.createElement('i');
    plusIcon.className = 'fa-solid fa-plus';
    buttonPlus.appendChild(plusIcon);
    orderItemButtons.appendChild(buttonPlus);

    const buttonPlusWholesale = document.createElement('button');
    buttonPlusWholesale.type = 'button';
    const plusIconWholesale = document.createElement('i');
    plusIconWholesale.className = 'fa-solid fa-plus';
    buttonPlusWholesale.appendChild(plusIconWholesale);
    const wholesaleQuantitySpan10Plus = document.createElement('span');
    wholesaleQuantitySpan10Plus.setAttribute('name', 'wholesale_quantity');
    wholesaleQuantitySpan10Plus.textContent = product.wholesale_quantity;
    buttonPlusWholesale.appendChild(wholesaleQuantitySpan10Plus);
    orderItemButtons.appendChild(buttonPlusWholesale);

    orderItemDetails.appendChild(orderItemButtons);

    orderItem.appendChild(orderItemDetails);

    document.body.appendChild(orderItem);

    productItems.appendChild(orderItem);

    /**
     * Calculate the product's total cost
     */
    function setTotalCost() {

        let quantity = quantityInput.valueAsNumber;

        // get the wholesale quantity
        let quantity_wholesale = Math.floor(quantity / product.wholesale_quantity);
        // get the inidividual quantity without the wholesale
        let quantity_individual = Math.abs((quantity_wholesale * product.wholesale_quantity) - quantity);

        let wholesale_total_cost = quantity_wholesale * product.wholesale_price;
        let individual_total_cost = quantity_individual * product.per_piece_price;

        let totalCost = wholesale_total_cost + individual_total_cost;

        costValueText.textContent = totalCost;

        orderItem.setAttribute("cost", totalCost);
        orderItem.setAttribute("quantity", quantity);

        setOrderDetails();
    }



    buttonMinusWholesale.addEventListener("click", () => {
        quantityInput.valueAsNumber -= product.wholesale_quantity;
        if (quantityInput.valueAsNumber < 0) {
            quantityInput.valueAsNumber = 0;
        }
        setTotalCost();
    });

    buttonMinus.addEventListener("click", () => {
        quantityInput.valueAsNumber -= 1;
        if (quantityInput.valueAsNumber < 0) {
            quantityInput.valueAsNumber = 0;
        }
        setTotalCost();
    });

    buttonPlusWholesale.addEventListener("click", () => {
        quantityInput.valueAsNumber += product.wholesale_quantity;
        setTotalCost();
    });

    buttonPlus.addEventListener("click", () => {
        quantityInput.valueAsNumber += 1;
        setTotalCost();
    });
}

/**
 * Adds the Order as an HTML element
 * @param {Object} order 
 */
function addOrderItem(order) {

    let dt = new Date(order.date)
    let orderDate = `${dt.toDateString()} ${dt.toLocaleTimeString()}`;

    let orderItems = document.getElementById("orderItems");

    const orderItem = document.createElement("div");
    orderItem.className = "orderItem";
    orderItem.setAttribute("product-id", order.id);

    const orderItemHeader = document.createElement("div");
    orderItemHeader.className = "orderItemHeader";

    const orderItemTitle = document.createElement("span");
    orderItemTitle.className = "orderItemTitle";
    orderItemTitle.textContent = order.id;

    orderItemHeader.appendChild(orderItemTitle);
    orderItem.appendChild(orderItemHeader);

    const orderItemDetails = document.createElement("div");
    orderItemDetails.className = "orderItemDetails";

    const customerDiv = document.createElement("div");
    customerDiv.className = "orderItemDetail";
    const customerLabel = document.createElement("span");
    customerLabel.textContent = "Customer";
    const customerValue = document.createElement("span");
    customerValue.textContent = order.name;
    customerDiv.appendChild(customerLabel);
    customerDiv.appendChild(customerValue);

    const orderDateDiv = document.createElement("div");
    orderDateDiv.className = "orderItemDetail";
    const orderDateLabel = document.createElement("span");
    orderDateLabel.textContent = "Order Date";
    const orderDateValue = document.createElement("span");
    orderDateValue.setAttribute("date", order.date);
    orderDateValue.textContent = orderDate;
    orderDateDiv.appendChild(orderDateLabel);
    orderDateDiv.appendChild(orderDateValue);

    const orderDetailsDiv = document.createElement("div");
    orderDetailsDiv.className = "orderItemDetail2";

    const orderDetailsLabel = document.createElement("span");
    orderDetailsLabel.textContent = "Order Details";

    const orderDetailsInnerDiv = document.createElement("div");
    orderDetailsInnerDiv.className = "orderItemDetail";

    const quantityDiv = document.createElement("div");
    quantityDiv.className = "orderItemDetail";
    const quantityLabel = document.createElement("span");
    quantityLabel.textContent = "Quantity";
    const quantityValue = document.createElement("span");
    quantityValue.textContent = order.total_quantity;
    quantityDiv.appendChild(quantityLabel);
    quantityDiv.appendChild(quantityValue);

    const costDiv = document.createElement("div");
    costDiv.className = "orderItemDetail";
    const costLabel = document.createElement("span");
    costLabel.textContent = "Cost";
    const costSpan = document.createElement("span");
    costSpan.className = "orderItemCost";
    const costIcon = document.createElement("i");
    costIcon.className = "fa-solid fa-peso-sign";
    const costValue = document.createElement("span");
    costValue.textContent = order.total_price;
    costSpan.appendChild(costIcon);
    costSpan.appendChild(costValue);
    costDiv.appendChild(costLabel);
    costDiv.appendChild(costSpan);

    orderDetailsInnerDiv.appendChild(quantityDiv);
    orderDetailsInnerDiv.appendChild(costDiv);

    orderDetailsDiv.appendChild(orderDetailsLabel);
    orderDetailsDiv.appendChild(orderDetailsInnerDiv);

    orderItemDetails.appendChild(customerDiv);
    orderItemDetails.appendChild(orderDateDiv);
    orderItemDetails.appendChild(orderDetailsDiv);

    const orderItemButtons = document.createElement("div");
    orderItemButtons.className = "orderItemButtons";

    const editButton = document.createElement("button");
    editButton.className = "orderItemButton";
    const editIcon = document.createElement("i");
    editIcon.className = "fa-solid fa-pen";
    editButton.appendChild(editIcon);
    editButton.appendChild(document.createTextNode(" Edit"));
    editButton.addEventListener("click", async () => {

        await fetch(`/api/orders/${order.id}`,
            {
                method: "post"
            }
        ).then(async res => {
            let order = await res.json();

            let form = document.getElementById("form");
            form.action = "/api/orders/edit"

            await loadProducts();
            setFormData(order);
            setOrderDetails();
            openViewer();
        });


    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "orderItemButton";
    deleteButton.setAttribute("name", "delete");
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-solid fa-trash-can";
    deleteButton.appendChild(deleteIcon);
    deleteButton.appendChild(document.createTextNode(" Delete"));
    deleteButton.addEventListener("click", async () => {
        if (window.confirm("Are you sure?")) {

            await fetch(`/api/orders/delete/${order.id}`, {
                method: "post"
            }).then(async res => {

                let data = await res.json();
                if (data.success) return loadOrders();
                window.alert(data.message);

            })
            await loadOrders();
        }
    });

    orderItemButtons.appendChild(editButton);
    orderItemButtons.appendChild(deleteButton);

    orderItem.appendChild(orderItemDetails);
    orderItem.appendChild(orderItemButtons);

    orderItems.appendChild(orderItem);
};


/**
 * Sets the Order Form's Details
 */
function setOrderDetails() {

    let totalCostSpan = document.getElementById("orderTotalCost");
    let totalQuantitySpan = document.getElementById("orderTotalQuantity");

    let orderSearchItems = document.getElementById("orderDetailItems");
    let orderItems = orderSearchItems.querySelectorAll(".orderDetailItem");

    let totalCost = 0;
    let totalQuantity = 0;
    for (let orderItem of orderItems) {
        let cost = orderItem.getAttribute("cost") || 0;
        let quantity = orderItem.getAttribute("quantity") || 0;

        totalCost += parseFloat(cost);
        totalQuantity += parseInt(quantity);
    }

    totalCostSpan.textContent = totalCost;
    totalQuantitySpan.textContent = totalQuantity;

}

/**
 * Resets the Order Form's details.
 */
function resetOrderDetails() {
    let orderSearchItems = document.getElementById("orderDetailItems");
    let totalCostSpan = document.getElementById("orderTotalCost");
    let totalQuantitySpan = document.getElementById("orderTotalQuantity");
    let form = document.getElementById("form");

    let orderItems = orderSearchItems.querySelectorAll(".orderItem");
    for (let orderItem of orderItems) {
        orderItem.setAttribute("cost", 0);
        orderItem.setAttribute("quantity", 0);

        let quantityInput = orderItem.querySelector("input.orderItemQuantity");
        quantityInput.valueAsNumber = 0;
    }

    form["id"].value = "";

    totalCostSpan.textContent = 0;
    totalQuantitySpan.textContent = 0;

    setOrderDetails();
}

/**
 * Adds the product into the database
 */
async function addProduct() {

    let dateSpan = document.getElementById("orderDate");

    let form = document.getElementById("form");
    form.action = "/api/orders/add";

    document.querySelector("input#customerName").value = "";

    let dt = new Date();

    dateSpan.textContent = `${dt.toDateString()} ${dt.toLocaleTimeString()}`;
    dateSpan.setAttribute("date", dt.getTime());

    resetOrderDetails();
    openViewer();
    await loadProducts();
}

/**
 * Get's the data from the Order's Form.
 * @returns FormData
 */
function getFormData() {

    let formData = new FormData();

    let form = document.getElementById("form");
    let orderDetailItems = document.getElementById("orderDetailItems");
    let orderItems = orderDetailItems.querySelectorAll(".orderDetailItem");
    let dateSpan = document.getElementById("orderDate");
    let totalCostSpan = document.getElementById("orderTotalCost");
    let totalQuantitySpan = document.getElementById("orderTotalQuantity");

    let productsOrdered = [];
    let index = 0;
    for (let orderItem of orderItems) {

        let orderedItem = {
            product_id: orderItem.getAttribute("product-id"),
            quantity: orderItem.getAttribute("quantity"),
            total_price: orderItem.getAttribute("cost")
        };

        if (orderedItem.quantity > 0) {

            productsOrdered.push(orderedItem);
            index++;
        }
    }

    formData.set("id", form["id"].value);
    formData.set("name", form["name"].value);
    formData.set("date", dateSpan.getAttribute("date"));
    formData.set("orders", JSON.stringify(productsOrdered));
    formData.set("total_price", parseFloat(totalCostSpan.textContent));
    formData.set("total_quantity", parseInt(totalQuantitySpan.textContent));

    return formData;

}

/**
 * Sets the data of the Order's Form
 * @param {Object} order 
 */
function setFormData(order) {
    let form = document.getElementById("form");
    let orderDetailItems = document.getElementById("orderDetailItems");
    let orderItems = orderDetailItems.querySelectorAll(".orderDetailItem");
    let dateSpan = document.getElementById("orderDate");
    let totalCostSpan = document.getElementById("orderTotalCost");
    let totalQuantitySpan = document.getElementById("orderTotalQuantity");

    let orders = order.orders

    for (let order of orders) {
        let orderItem = orderDetailItems.querySelector(`div[product-id="${order.product_id}"]`);

        orderItem.setAttribute("product-id", order.product_id);
        orderItem.setAttribute("quantity", order.quantity);
        orderItem.setAttribute("cost", order.total_price);

        orderItem.querySelector("input.orderItemQuantity").value = order.quantity;
        orderItem.querySelector("span[name=cost]").textContent = order.total_price;

    }

    let dt = new Date(order.date);

    form["id"].value = order.id;
    form["name"].value = order.name;
    dateSpan.textContent = `${dt.toDateString()} ${dt.toLocaleTimeString()}`;
    dateSpan.setAttribute("date", order.date);
    totalCostSpan.textContent = order.total_price;
    totalQuantitySpan.textContent = order.total_quantity;
}

window.addEventListener("DOMContentLoaded", async () => {

    // event stream for checking the database status
    const eventSource = new EventSource("/api/database/status");

    let lastChangedValue = false;
    let hasChanged = false;

    eventSource.addEventListener("databaseStatus", async (event) => {
        let data = JSON.parse(event.data);
        // if the database has changed reload the orders
        if (data.changed) {
            if (!hasChanged) {
                await loadOrders();
                hasChanged = true;
            };

            if (data.changed !== lastChangedValue) hasChanged = false;
        }

        lastChangedValue = data.changed;

    });

    let orderSearch = document.getElementById("orderSearch");

    orderSearch.addEventListener("input", async ev => {
        ev.preventDefault();

        let formData = new FormData();
        formData.set("query", orderSearch.value);

        await fetch("/api/products/searchID", {
            method: "post",
            body: formData
        }).then(async res => {

            searchResults = await res.json();
            isSearching = !(formData.get("query").trim() === "")

            loadProducts();
        });
    });

    await loadProducts();
    await loadOrders();

    let form = document.getElementById("form");

    form.addEventListener("submit", async ev => {
        ev.preventDefault();

        let formData = getFormData();

        await fetch(form.action, {
            method: form.method,
            body: formData
        }).then(async res => {

            let result = await res.json();

            if (result.success) {
                closeViewer();
                await loadOrders();
                return;
            } else {
                alert("Saving Unsuccessful! " + result.message);
            }

        });
    });

});
