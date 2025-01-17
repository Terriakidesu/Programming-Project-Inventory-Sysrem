let accountForm = document.getElementById("accountForm");
let accountSubmitButton = document.getElementById("accountSubmitButtons");


function validateForm(username, password) {

    username = username || "";
    password = password || "";

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

accountForm.addEventListener("submit", async ev => {

    ev.preventDefault();

    let formData = new FormData(accountForm);

    let validation = validateForm(formData.get("username"), formData.get("password"));

    let usernameValid = Object.values(validation.username).every(v => v === true);
    let passwordValid = Object.values(validation.password).every(v => v === true);

    if (!(usernameValid && passwordValid)) {
        window.alert("Invalid Username or Password!");
        setTimeout(() => {
            submitButton.disabled = false;
        }, 500);
        return;
    }

    if (!window.confirm("Are You Sure?")) {
        return;
    }

    await fetch(form.action, {
        method: "POST",
        body: formData,
    }).then(async res => {

        // return;
        if (res.status == 200) {

            let singupStatus = await res.json();
            if (singupStatus.success) {
                submitButton.disabled = false;

                window.alert("Changed Successfully");

            } else {
                setTimeout(() => {
                    submitButton.disabled = false;
                }, 500);
            }
        }

    }).catch((reason) => {
        console.error(reason);
        submitButton.disabled = false;
    });
})
