
window.addEventListener("DOMContentLoaded", ev => {
    let loginIconClicked = 0;
    let loginIconTimeout;

    let loginIcon = document.getElementById("loginIcon");

    loginIcon.addEventListener("click", ev => {

        loginIconClicked++;

        let deg = (360 / 10) * loginIconClicked;
        let child = loginIcon;

        child.style.transform = `rotate(${deg}deg)`;

        if (!loginIconTimeout) {
            loginIconTimeout = setTimeout(() => {
                loginIconClicked = 0;
                deg = (360 / 5) * loginIconClicked;

                child.style.transform = `rotate(${deg}deg)`
                loginIconTimeout = null;
            }, 2000);
        }

        if (loginIconClicked >= 5) {
            location.assign("/easter-egg");
            loginIconClicked = 0;
            deg = (360 / 5) * loginIconClicked;

            child.style.transform = `rotate(${deg}deg)`
            clearTimeout(loginIconTimeout);
            loginIconTimeout = null;
        }

    });
});