// player move logic
class Player {
    constructor(ele, health, id, gun) {
        this.ele = ele;
        this.health = health;
        this.id = id;
        this.gun = gun;
    }
}
class Gun {
    constructor(id, ammo, max_ammo) {
        this.id = id;
        this.ammo = ammo;
        this.max_ammo = max_ammo;
    }
}
var level = 0;
var play = null;
var player = null;
var player1Obj = null;
var ground = document.getElementsByClassName("container")[0];
var onReload = null;
var startTime = null;
var healthCount = null;
var freezeCount = null;
var freezefactor = null;
var Keys = {
    up: false,
    down: false,
    left: false,
    right: false
};


function init() {
    //console.log("init");
    player = document.getElementById("player");
    healthCount = 1;
    freezefactor = 1;
    freezeCount = 1;
    startTime = new Date().getTime();
    player1Obj = new Player(player, 100, 1, new Gun(1, 10, 10));
    onReload = false;
    player.style.position = "relative";
    player.style.left = "500px";
    player.style.top = "10px";
    setInterval("move()", 45);
    zombieGenerator();
    ammoInit(player1Obj);
    setInterval("checkHealth()", 100);
    setInterval("isGameOver()",100);
    setTimeout("missionPassed()", 30000);
}

function getKeyAndMove(e) {
    var key_code = e.which || e.keyCode;
    switch (key_code) {
        case 37: //left arrow key
            Keys.left = true;
            break;
        case 38: //Up arrow key
            Keys.up = true;
            break;
        case 39: //right arrow key
            Keys.right = true;
            break;
        case 40: //down arrow key
            Keys.down = true;
            break;
    }
}

function getKeyAndStop(e) {
    var key_code = e.which || e.keyCode;
    switch (key_code) {
        case 37: //left arrow key
            Keys.left = false;
            break;
        case 38: //Up arrow key
            Keys.up = false;
            break;
        case 39: //right arrow key
            Keys.right = false;
            break;
        case 40: //down arrow key
            Keys.down = false;
            break;
    }
}

function move() {
    if (Keys.up)
        moveUp();
    if (Keys.down)
        moveDown();
    if (Keys.left)
        moveLeft();
    if (Keys.right)
        moveRight();
}
function moveLeft() {
    player.style.left = parseInt(player.style.left) - 5 + "px";
}
function moveUp() {
    player.style.top = parseInt(player.style.top) - 5 + "px";
}
function moveRight() {
    player.style.left = parseInt(player.style.left) + 5 + "px";
}
function moveDown() {
    player.style.top = parseInt(player.style.top) + 5 + "px";
}


//window.onload = init;

// player aim logic

ground.addEventListener('mousemove', (event) => {

    var x = event.clientX;
    var y = event.clientY;
    var q1 = false;
    var q2 = false;
    var q3 = false;
    var q4 = false;
    var xdiff = (x - player.offsetLeft) + 19;
    var ydiff = (y - player.offsetTop) + 15;
    //console.log(x+" "+player.offsetLeft+" "+y+" "+player.offsetTop);
    if (xdiff == 0)
        xdiff += 0.0001;
    if (ydiff == 0)
        ydiff += 0.0001;
    if (ydiff < 0 && xdiff > 0) q1 = true;
    if (ydiff > 0 && xdiff > 0) q2 = true;
    if (ydiff > 0 && xdiff < 0) q3 = true;
    if (ydiff < 0 && xdiff < 0) q4 = true;

    var tan = ydiff / xdiff;
    var rad = Math.atan(tan);
    var deg = (rad * 180 / Math.PI);
    if (deg > 0) deg *= -1;
    if (q2) deg = -1 * deg;
    if (q3) deg = 180 + deg;
    if (q4) deg = 180 - deg;
    //if((x-player.offsetLeft)==0)
    //console.log(deg+" "+(x-player.offsetLeft)+" "+(y-player.offsetTop));
    document.getElementById("player").style.transform = "rotate(" + deg + "deg)";
});

// player shoot logic

ground.addEventListener('click', (event) => {
    if (!onReload) {
        var fire = document.getElementById("fire");
        fire.style.visibility = "visible";
        var playerImage = document.getElementById("player-image");
        playerImage.style.width = "82px";

        setTimeout(stopFire, 100);
        player1Obj.gun.ammo -= 1;
        if (player1Obj.gun.ammo == 0) {
            onReload = true;
            setTimeout(finishReload, 2000, player1Obj);
        }
        ammoUpdate(player1Obj);
        killZombie(event);
    }
});

function finishReload(player) {
    onReload = false;
    player.gun.ammo = player.gun.max_ammo;
    ammoInit(player);
}

function stopFire() {
    var fire = document.getElementById("fire");
    var playerImage = document.getElementById("player-image");
    playerImage.style.width = "80px";
    fire.style.visibility = "hidden";
}

// zombies
var zombies = [];
var moveIds = [];
var rotateIds = [];
var zombieCount = 0;
var zombieType = ["zombie/z.gif", "zombie/z2.gif", "zombie/b1.gif", "zombie/b2.gif"];
class Zombie {
    constructor(e, id, type) {
        this.ele = e;
        this.id = id;
        this.type = type;
    }
}

var zombieId = null;
function createZombie(x, y) {
    var x = 200 + (Math.random() * (window.screen.width - 200));
    var y = window.screen.height;
    //console.log(zombies);
    var zombie = document.createElement("div");
    zombie.setAttribute("id", "z" + zombieId);

    zombie.style.maxWidth = "100px";
    zombie.style.maxHeight = "100px";
    zombie.style.position = "absolute";
    zombie.style.pointerEvents = "none";
    zombie.style.transformOrigin = "center";
    zombie.style.top = y + "px";
    zombie.style.left = x + "px";
    //zombie.style.backgroundColor = "white";

    var zombieImage = document.createElement("img");
    zombieImage.setAttribute("id", "zi" + zombieId);
    var zid = Math.floor(Math.random() * level);
    if (zid == 1)
        zombieImage.style.transform = "rotate(-90deg)";
    if (zid == 2)
        zombieImage.style.transform = "rotate(90deg)";
    if (zid == 3)
        zombieImage.style.transform = "rotate(90deg)";
    zombieImage.src = zombieType[zid];
    zombieImage.style.maxWidth = "100px";
    zombieImage.style.maxHeight = "100px";

    zombie.appendChild(zombieImage);
    ground.appendChild(zombie);

    var z = new Zombie(zombie, zombieId, zid);
    //console.log("new zom: " + z.id);
    var rid = setInterval(rotateZombie, 40, z, player);
    var mid = setInterval(moveZombie, 40, z, player);

    zombies.push(z);
    moveIds.push(mid);
    rotateIds.push(rid);
    zombieCount++;
    zombieId++;
}

function rotateZombie(zombie, target) {
    //console.log(zombie);
    // face towards target
    var x = target.offsetLeft - 20;
    var y = target.offsetTop - 20;
    var q1 = false;
    var q2 = false;
    var q3 = false;
    var q4 = false;
    var xdiff = (x - zombie.ele.offsetLeft) + 19;
    var ydiff = (y - zombie.ele.offsetTop) + 15;
    //console.log(x+" "+player.offsetLeft+" "+y+" "+player.offsetTop);
    if (xdiff == 0)
        xdiff += 0.0001;
    if (ydiff == 0)
        ydiff += 0.0001;
    if (ydiff < 0 && xdiff > 0) q1 = true;
    if (ydiff > 0 && xdiff > 0) q2 = true;
    if (ydiff > 0 && xdiff < 0) q3 = true;
    if (ydiff < 0 && xdiff < 0) q4 = true;

    var tan = ydiff / xdiff;
    var rad = Math.atan(tan);
    var deg = (rad * 180 / Math.PI);
    if (deg > 0) deg *= -1;
    if (q2) deg = -1 * deg;
    if (q3) deg = 180 + deg;
    if (q4) deg = 180 - deg;
    //if((x-player.offsetLeft)==0)
    //console.log(deg+" "+(x-player.offsetLeft)+" "+(y-player.offsetTop));
    zombie.ele.style.transform = "rotate(" + deg + "deg)";
}

function moveZombie(zombie, target) {
    // run towards target
    //target.style.backgroundColor = "red";
    //zombie.ele.style.backgroundColor = "white";
    var y1 = target.offsetTop + 30;
    var x1 = target.offsetLeft + 20; //-40px
    var y2 = zombie.ele.offsetTop + 50;
    var x2 = zombie.ele.offsetLeft + 50;

    //console.log((y1 - y2)+" "+(x1 - x2));
    var typeFactor = (zombie.type / 4.0) + 1;
    var dy = (typeFactor * (y1 - y2)) / (freezefactor * 100.0);
    var dx = (typeFactor * (x1 - x2)) / (freezefactor * 100.0);
    //console.log("loop in");
    while (Math.abs(dy) < 1 && Math.abs(dx) < 1 && freezefactor==1 && !(Math.abs(dy) == 0 && Math.abs(dx) == 0)) {
        //console.log(dx+" "+dy);
        dy *= 5;
        dx *= 5;
    }
    //console.log("loop out");
    var newy = y2 + dy;
    var newx = x2 + dx;
    if (Math.abs(y1 - y2) + Math.abs(x1 - x2) < 70) {
        // kill player logic
        player1Obj.health -= 1;
    }
    zombie.ele.style.top = (newy - 50) + "px";
    zombie.ele.style.left = (newx - 50) + "px";
}

// game logics

function missionPassed() {
    clearInterval(play);
    setInterval("checkMissionPassed()", 100);

}
function checkMissionPassed() {
    // count zombies

    if (zombieCount == 0 && player1Obj.health > 0) {
        var passed = document.getElementById("mission-passed");
        passed.style.visibility = "visible";
        //for (var i = 0; i < zombies.length; i++) {
        //   zombies[i].ele.remove();
        //}

        setTimeout(function () {
            location.reload();
        }, 5000);
    }

}

function isGameOver() {

    if (player1Obj.health <= 0) {
        clearInterval(play);
        document.getElementById("over").style.visibility = "visible";
        //for (var i = 0; i < zombies.length; i++) {
        //    zombies[i].ele.remove();
        //}
        setTimeout(function () {
            location.reload();
        }, 5000);
    }

}
function zombieGenerator() {

    play = setInterval(createZombie, 450-(50*level));
    //createZombie(600, 600);
}

// kill zombie

function killZombie(event) {
    var aimX = event.clientX;
    var aimY = event.clientY;
    var playerX = player.offsetLeft;
    var playerY = player.offsetTop + 40;

    var m = (aimY - playerY) / (aimX - playerX);
    var c = aimY - (m * aimX);

    // ax + by + c = 0

    var a = -1 * m;
    var b = 1;
    c = -1 * c;

    for (var i = 0; i < zombies.length; i++) {

        var zx = zombies[i].ele.offsetLeft + 50;
        var zy = zombies[i].ele.offsetTop + 50;
        var d = Math.abs((a * zx) + (b * zy) + c) / Math.sqrt((a * a) + (b * b));
        //console.log((playerX - zx)+" "+(playerY - zy));
        if (Math.abs(playerX - zx) > 5 && Math.abs(playerY - zy) > 5) {
            //console.log("into");
            if (!(((playerX <= aimX && playerX <= zx) || (playerX >= aimX && playerX >= zx)) && ((playerY >= aimY && playerY >= zy) || (playerY <= aimY && playerY <= zy)))) {
                //console.log("into 2");
                continue;
            }

        }

        if (d < 35) {
            var curTime = new Date().getTime();
            if (healthCount > 0 && curTime - startTime > 10000) {
                healthCount--;
                sendHealth(zx, zy);
            }
            else if (freezeCount > 0 && curTime - startTime > 20000) {
                freezeCount--;
                sendFreeze(zx, zy);
            }
            else {
                var zi = document.createElement("img");
                zi.src = "zombie/blood.png";
                zi.style.position = "absolute";
                zi.style.left = (zx - 50) + "px";
                zi.style.top = (zy - 50) + "px";
                zi.style.height = "100px";
                zi.style.width = "100px";
                zi.style.zIndex = "-2";
                zi.style.pointerEvents = "none";
                ground.append(zi);
            }
            clearInterval(moveIds[zombies[i].id]);
            clearInterval(rotateIds[zombies[i].id]);
            zombies[i].ele.remove();
            //console.log(zombies);
            zombies.splice(i, 1);
            //console.log(zombies);
            zombieCount--;

            break;
        }

    }
}

// send health

function sendHealth(zx, zy) {
    var health = document.createElement("img");
    health.src = "game/health.gif";
    health.style.position = "absolute";
    health.style.left = (zx - 50) + "px";
    health.style.top = (zy - 50) + "px";
    health.style.height = "100px";
    health.style.width = "100px";
    health.style.zIndex = "-1";
    health.style.pointerEvents = "none";
    ground.append(health);
    var check = null;
    check = setInterval(function () {
        var px = player.offsetLeft;
        var py = player.offsetTop;
        //console.log(Math.abs(px - zx + 50) + Math.abs(py - zy + 50));
        if (Math.abs(px - zx + 50) + Math.abs(py - zy + 50) < 100) {
            player1Obj.health = 100;
            clearInterval(check);
            health.remove();
        }
    }, 50);
    setTimeout(function () {
        clearInterval(check);
        health.remove();
    }, 10000);
}

// send freeze

function sendFreeze(zx, zy) {
    var freeze = document.createElement("img");
    freeze.src = "game/freeze.gif";
    freeze.style.position = "absolute";
    freeze.style.left = (zx - 50) + "px";
    freeze.style.top = (zy - 50) + "px";
    freeze.style.height = "80px";
    freeze.style.width = "80px";
    freeze.style.zIndex = "-1";
    freeze.style.pointerEvents = "none";
    ground.append(freeze);
    var check = null;
    check = setInterval(function () {
        var px = player.offsetLeft;
        var py = player.offsetTop;
        //console.log(Math.abs(px - zx + 50) + Math.abs(py - zy + 50));
        if (Math.abs(px - zx + 50) + Math.abs(py - zy + 50) < 100) {
            freezefactor = 50;
            setTimeout(function () {
                freezefactor = 1;
            }, 4000);
            freeze.remove();
        }
    }, 50);
    setTimeout(function () {
        clearInterval(check);
        freeze.remove();
    }, 10000);
}

// player health [bar width: 500px]


function checkHealth() {
    var player1Hb = document.getElementById("bar1");
    if (player1Obj.health <= 0)
        player1Hb.style.width = "0px";
    else
        player1Hb.style.width = player1Obj.health * 5 + "px";
}

// ammo logic

function ammoInit(player) {

    var player1Ammo = document.getElementById("ammo1");
    for (var i = 0; i < player.gun.ammo; i++) {
        var bullet = document.createElement("img");
        bullet.setAttribute("id", "b1" + i);
        bullet.src = "bullets/bullet.png";
        bullet.style.width = "15px";
        bullet.style.height = "15px";
        bullet.style.marginTop = "2px";

        player1Ammo.append(bullet);
    }
}
function ammoUpdate(player) {
    var bullet = document.getElementById("b1" + player.gun.ammo);
    bullet.remove();
}

// start screen



function openFullscreen() {
    //console.log("in");
    var elem = document.getElementById("body");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

function loadStart() {
    //console.log(window.screen.width);
    level = 1;
    var demo = document.getElementById("demo");
    if (window.screen.width < 1000) {
        window.alert("please use laptop/desktop");
    }
    else {
        openFullscreen();
        demo.style.visibility = "visible";
        setTimeout(function () {
            document.getElementById("welcome").style.visibility = "hidden";
            demo.style.visibility = "hidden";
            ground.style.visibility = "visible";
            init();
        }, 5000);
    }
    //location.replace("game.html");
}

function loadLevel1() {
    //console.log(window.screen.width);
    level = 2;
    var demo = document.getElementById("demo");
    if (window.screen.width < 1000) {
        window.alert("please use laptop/desktop");
    }
    else {
        openFullscreen();
        demo.style.visibility = "visible";
        ground.style.backgroundImage = "url('level1/bg.png')";
        setTimeout(function () {
            document.getElementById("welcome").style.visibility = "hidden";
            demo.style.visibility = "hidden";
            ground.style.visibility = "visible";
            init();
        }, 5000);
    }
    //location.replace("game.html");
}

function loadLevel2() {
    //console.log(window.screen.width);
    level = 3;
    var demo = document.getElementById("demo");
    if (window.screen.width < 1000) {
        window.alert("please use laptop/desktop");
    }
    else {
        openFullscreen();
        demo.style.visibility = "visible";
        ground.style.backgroundImage = "url('level2/bg.png')";
        setTimeout(function () {
            document.getElementById("welcome").style.visibility = "hidden";
            demo.style.visibility = "hidden";
            ground.style.visibility = "visible";
            init();
        }, 5000);
    }
    //location.replace("game.html");
}

function loadLevel3() {
    //console.log(window.screen.width);
    level = 4;
    var demo = document.getElementById("demo");
    if (window.screen.width < 1000) {
        window.alert("please use laptop/desktop");
    }
    else {
        openFullscreen();
        demo.style.visibility = "visible";
        ground.style.backgroundImage = "url('level3/bg.png')";
        setTimeout(function () {
            document.getElementById("welcome").style.visibility = "hidden";
            demo.style.visibility = "hidden";
            ground.style.visibility = "visible";
            init();
        }, 5000);
    }
    //location.replace("game.html");
}