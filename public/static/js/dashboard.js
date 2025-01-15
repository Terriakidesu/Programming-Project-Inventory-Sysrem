


window.addEventListener("DOMContentLoaded", async ev => {
    const eventSource = new EventSource("/api/dashboard/stats");


    eventSource.addEventListener("dashboardStats", async (event) => {
        let productCountSpan = document.getElementById("productCount");
        let orderCountSpan = document.getElementById("orderCount");
        let profitsSpan = document.getElementById("profits");

        let data = JSON.parse(event.data);

        productCountSpan.textContent = data.products;
        orderCountSpan.textContent = data.orders;
        profitsSpan.textContent = data.profits;


    });
});