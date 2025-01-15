let form = document.getElementById("loginForm");
let submitButton = document.getElementById("submitButton");
let showHideButton = document.getElementById("showHideButton");
let passwordInput = document.getElementById("passwordInput");
let warning = document.getElementById("warning");
let warningMessage = document.getElementById("warningMessage");

function showWarning(message, duration) {
    warningMessage.innerText = message;

    if (warning.classList.contains("hide")) {
        warning.classList.remove("hide");

        setTimeout(() => {
            warning.classList.toggle("hide");
        }, duration);
    }
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    submitButton.disabled = true;

    let formData = new FormData(form);
    await fetch(form.action, {
        method: "POST",
        body: formData,
    }).then(async res => {

        if (res.status == 200) {

            let loginStatus = await res.json();
            if (loginStatus.success) {
                submitButton.disabled = false;

                location.reload();
            } else {
                showWarning(loginStatus.message, 2000);
                setTimeout(() => {
                    submitButton.disabled = false;
                }, 500)
            }
        }

    }).catch((reason) => {
        console.error(reason);
        submitButton.disabled = false;
    });

});


showHideButton.addEventListener("click", (event) => {

    showHideButton.querySelector(":first-child").classList.toggle("fa-eye");
    showHideButton.querySelector(":first-child").classList.toggle("fa-eye-slash");

    if (passwordInput.type == "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
})


