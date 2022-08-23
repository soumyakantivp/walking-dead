

var elem = document.getElementById("body");
function openFullscreen() {
    //console.log("in");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

function loadStart() {
    
    openFullscreen();
    location.replace("game.html");
}