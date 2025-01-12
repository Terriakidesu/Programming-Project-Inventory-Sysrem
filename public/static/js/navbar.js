
document.querySelectorAll("div.navigationMenuContainer>span.navigationMenu").forEach(element => {

    
    element.addEventListener("click", (event) =>  {
        let next = element.getAttribute("href");

        location.assign(next);
    })

});