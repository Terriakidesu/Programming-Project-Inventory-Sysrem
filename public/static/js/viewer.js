

let closeButton = document.getElementById("closeButton");

closeButton.addEventListener("click", ev => {
    closeViewer();
});

function closeViewer() {

    let viewer = document.getElementById("viewer");

    if (!viewer.classList.contains("viewerHide")) {
        viewer.classList.add("viewerHide")
    }

}

function openViewer() {
    let viewer = document.getElementById("viewer");

    if (viewer.classList.contains("viewerHide")) {
        viewer.classList.remove("viewerHide")
    }
}