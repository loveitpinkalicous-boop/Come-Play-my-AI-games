const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Monster properties
let monster = {
    x: 50,
    y: 200,
    width: 80,
    height: 80,
    speed: 2,
    direction: 1,
    velocityY: 0,
    gravity: 0.5,
    isJumping: false
};

// Cloud movement properties
let cloudX = 200;
let cloudY = 60;
let cloudDirection = 1;
let cloudSpeed = 1.5;

// Load unicorn + poop + flies
const unicornImg = new Image();
unicornImg.src = "unicorn_finger_used-removebg-preview.png";

const poopImg = new Image();
poopImg.src = "poop-removebg-preview.png";

const flyImg = new Image();
flyImg.src = "fly_pink-removebg-preview.png";

// Unicorn tilt animation
let unicornTilt = 0;
let tiltDirection = 1;

// Fly animation
let flyOffset = 0;
let flyDirection = 1;

// Draw LONG cloud with text
function drawCloud() {
    ctx.fillStyle = "white";
    ctx.beginPath();

    ctx.arc(cloudX, cloudY, 45, 0, Math.PI * 2);
    ctx.arc(cloudX + 60, cloudY - 20, 40, 0, Math.PI * 2);
    ctx.arc(cloudX + 120, cloudY, 45, 0, Math.PI * 2);
    ctx.arc(cloudX + 180, cloudY - 15, 40, 0, Math.PI * 2);
    ctx.arc(cloudX + 90, cloudY + 30, 55, 0, Math.PI * 2);

    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Come play my games", cloudX - 20, cloudY + 10);
}

// Jump function
function jump() {
    if (!monster.isJumping) {
        monster.velocityY = -10;
        monster.isJumping = true;
    }
}

// Keyboard listener
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        jump();
    }
});

// Draw monster
function drawMonster() {
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.moveTo(monster.x - 40, monster.y - 40);
    ctx.lineTo(monster.x + 40, monster.y - 40);
    ctx.lineTo(monster.x + 40, monster.y + 40);
    ctx.lineTo(monster.x - 40, monster.y + 40);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "pink";
    ctx.lineWidth = 10;

    ctx.beginPath();
    ctx.moveTo(monster.x - 40, monster.y - 10);
    ctx.lineTo(monster.x - 70, monster.y - 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(monster.x + 40, monster.y - 10);
    ctx.lineTo(monster.x + 70, monster.y - 20);
    ctx.stroke();

    ctx.lineWidth = 12;

    ctx.beginPath();
    ctx.moveTo(monster.x - 20, monster.y + 40);
    ctx.lineTo(monster.x - 20, monster.y + 70);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(monster.x + 20, monster.y + 40);
    ctx.lineTo(monster.x + 20, monster.y + 70);
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(monster.x - 20, monster.y - 10, 10, 0, Math.PI * 2);
    ctx.arc(monster.x + 20, monster.y - 10, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(monster.x - 20, monster.y - 10, 5, 0, Math.PI * 2);
    ctx.arc(monster.x + 20, monster.y - 10, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(monster.x, monster.y + 10, 20, 0, Math.PI);
    ctx.stroke();
}

// Draw unicorn + poop + flies
function drawUnicornAndPoop() {
    // Unicorn tilt animation
    unicornTilt += 0.03 * tiltDirection;
    if (unicornTilt > 0.3) tiltDirection = -1;
    if (unicornTilt < -0.3) tiltDirection = 1;

    // Bigger canvas positions
    const unicornX = canvas.width - 220;
    const unicornY = canvas.height - 260;

    const poopX = unicornX + 80;
    const poopY = unicornY + 140;

    // Fly animation (up & down + turn at top)
    flyOffset += 0.7 * flyDirection;

    if (flyOffset > 25) {
        flyDirection = -1; // turn around at top
    }
    if (flyOffset < -25) {
        flyDirection = 1; // turn around at bottom
    }

    // Draw unicorn with tilt
    ctx.save();
    ctx.translate(unicornX + 100, unicornY + 100);
    ctx.rotate(unicornTilt);
    ctx.drawImage(unicornImg, -100, -100, 200, 200);
    ctx.restore();

    // Draw poop (smaller)
    ctx.drawImage(poopImg, poopX, poopY, 70, 70);

    // Draw flies (smaller than poop)
    const flySize = 35; // ⭐ smaller flies

    // Left fly
    ctx.drawImage(flyImg, poopX - 60, poopY - 20 + flyOffset, flySize, flySize);

    // Right fly
    ctx.drawImage(flyImg, poopX + 60, poopY - 20 + flyOffset, flySize, flySize);
}

// Update movement
function updateMonster() {
    monster.x += monster.speed * monster.direction;

    if (monster.x > canvas.width - monster.width / 2) monster.direction = -1;
    if (monster.x < monster.width / 2) monster.direction = 1;

    monster.velocityY += monster.gravity;
    monster.y += monster.velocityY;

    const ground = 200;
    if (monster.y > ground) {
        monster.y = ground;
        monster.velocityY = 0;
        monster.isJumping = false;
    }

    cloudX += cloudSpeed * cloudDirection;

    if (cloudX > canvas.width - 220) cloudDirection = -1;
    if (cloudX < 20) cloudDirection = 1;
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCloud();
    updateMonster();
    drawMonster();
    drawUnicornAndPoop();

    requestAnimationFrame(gameLoop);
}

gameLoop();
