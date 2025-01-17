let form = document.getElementById("loginForm");
let submitButton = document.getElementById("submitButton");
let showHideButton = document.getElementById("showHideButton");
let passwordInput = document.getElementById("passwordInput");
let warning = document.getElementById("warning");
let warningMessage = document.getElementById("warningMessage");

function validateForm(username, password) {

    username = username || "";
    password = password || "";

    // RegExp patterns for username/password verfication
    let usernamePattern = /(?=.*[:-@\[-^`{-~\s]).*/
    let passwordPatterns = {
        "space": /(?=.*\s).*/,
        "validCharacters": /(?=.*[:-@\[-^`{-~]).*/,
    };

    let isValidUsername = {
        "validCharacters": !usernamePattern.test(username) && username.length > 0,
        "length": username.length >= 4
    };

    let isValidPassword = {
        "hasNoSpace": !passwordPatterns.space.test(password) && password.length > 0,
        "validCharacters": !passwordPatterns.validCharacters.test(password) && password.length > 0,
        "length": password.length >= 8
    };

    return {
        "username": isValidUsername,
        "password": isValidPassword
    };

}

function updateFormInfos(ev) {
    let formData = new FormData(form);

    let validation = validateForm(formData.get("username"), formData.get("password"));

    if (ev.target.id === "usernameInput") {
        let keys = Object.keys(validation.username);

        let usernameInfo = document.querySelectorAll("div#usernameInfoContainer>span.info");

        for (let i = 0; i < usernameInfo.length; i++) {
            let iconSpan = usernameInfo[i].querySelector("span>svg:first-child");
            let value = validation.username[keys[i]];


            if (value) {
                usernameInfo[i].classList.replace("red", "green");
                iconSpan.classList.replace("fa-xmark", "fa-check");
            } else {
                usernameInfo[i].classList.replace("green", "red");
                iconSpan.classList.replace("fa-check", "fa-xmark");
            }
        }

    }


    if (ev.target.id === "passwordInput") {
        let keys = Object.keys(validation.password);

        let passwordInfos = document.querySelectorAll("div#passwordInfoContainer>span.info");

        for (let i = 0; i < passwordInfos.length; i++) {
            let iconSpan = passwordInfos[i].querySelector("span>svg:first-child");
            let value = validation.password[keys[i]];

            if (value) {
                passwordInfos[i].classList.replace("red", "green");
                iconSpan.classList.replace("fa-xmark", "fa-check");
            } else {
                passwordInfos[i].classList.replace("green", "red");
                iconSpan.classList.replace("fa-check", "fa-xmark");
            }
        }
    }

}

function showWarning(message, duration) {
    warningMessage.innerText = message;

    if (warning.classList.contains("hide")) {
        warning.classList.remove("hide");

        setTimeout(() => {
            warning.classList.toggle("hide");
        }, duration);
    }
}

form.addEventListener("input", (ev) => {
    updateFormInfos(ev);
});

form.addEventListener("change", (ev) => {
    updateFormInfos(ev);
});


form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    submitButton.disabled = true;

    let formData = new FormData(form);

    let validation = validateForm(formData.get("username"), formData.get("password"));

    let usernameValid = Object.values(validation.username).every(v => v === true);
    let passwordValid = Object.values(validation.password).every(v => v === true);

    if (!(usernameValid && passwordValid)) {
        showWarning("Invalid Username or Password!", 2000);
        setTimeout(() => {
            submitButton.disabled = false;
        }, 500);
        return;
    }

    await fetch(form.action, {
        method: "POST",
        body: formData,
    }).then(async res => {

        if (res.status == 200) {

            let singupStatus = await res.json();
            if (singupStatus.success) {
                submitButton.disabled = false;

                location.reload();
            } else {
                showWarning(singupStatus.message, 2000);
                setTimeout(() => {
                    submitButton.disabled = false;
                }, 500);
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
