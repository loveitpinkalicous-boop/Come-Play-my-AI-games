// =========================
// MAIN SNAKE GAME CANVAS
// =========================
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

// =========================
// FULL‑PAGE FALLING CANVAS
// =========================
const fallCanvas = document.getElementById("fallCanvas");
fallCanvas.width = window.innerWidth;
fallCanvas.height = window.innerHeight;
const fallCtx = fallCanvas.getContext("2d");

// ⭐ Bigger snake + food images
let box = 50;

// ⭐ Load your images
const snakeImg = new Image();
snakeImg.src = "snake_Cat.png";      // snake body

const foodImg = new Image();
foodImg.src = "Michael_cat.png";     // food

const fallImg = new Image();
fallImg.src = "Michael_cat.png";     // falling background squares

// ⭐ Wiggle animation variables
let foodOffset = 0;
let foodDirection = 1;

// ⭐ Falling squares array (full page)
let fallingSquares = [];
for (let i = 0; i < 20; i++) {
    fallingSquares.push({
        x: Math.random() * fallCanvas.width,
        y: Math.random() * -fallCanvas.height,
        speed: 2 + Math.random() * 3
    });
}

function drawFallingBackground() {
    fallCtx.clearRect(0, 0, fallCanvas.width, fallCanvas.height);

    for (let sq of fallingSquares) {

        // ⭐ BIGGER falling images (100×100)
        fallCtx.drawImage(fallImg, sq.x, sq.y, 100, 100);

        sq.y += sq.speed;

        // Loop back to top
        if (sq.y > fallCanvas.height) {
            sq.y = -100;
            sq.x = Math.random() * fallCanvas.width;
        }
    }

    requestAnimationFrame(drawFallingBackground);
}

drawFallingBackground();

// =========================
// SNAKE GAME VARIABLES
// =========================
let snake;
let direction;
let food;
let score;
let speed = 150;
let selfHitBuffer;

// ⭐ Food spawns safely inside canvas
function newFood() {
    return {
        x: Math.floor(Math.random() * ((canvas.width / box) - 2) + 1) * box,
        y: Math.floor(Math.random() * ((canvas.height / box) - 2) + 1) * box
    };
}

function resetGame() {
    snake = [{ x: 5 * box, y: 5 * box }];
    direction = "RIGHT";
    food = newFood();
    score = 0;
    selfHitBuffer = 1;
    foodOffset = 0;
    foodDirection = 1;
}

resetGame();

// =========================
// CONTROLS
// =========================
document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// =========================
// MAIN GAME LOOP
// =========================
function drawGame() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ⭐ Animate food side-to-side
    foodOffset += 0.5 * foodDirection;
    if (foodOffset > 10 || foodOffset < -10) {
        foodDirection *= -1;
    }

    // ⭐ Draw animated food (Michael_cat.png)
    ctx.drawImage(foodImg, food.x + foodOffset, food.y, box, box);

    // ⭐ Draw snake body (snake_Cat.png)
    for (let i = 0; i < snake.length; i++) {
        ctx.drawImage(snakeImg, snake[i].x, snake[i].y, box, box);
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;

    // ⭐ Eat food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = newFood();
        foodOffset = 0; // reset wiggle
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // ⭐ Wall bounce
    if (snakeX < 0) snakeX = 0;
    if (snakeX >= canvas.width) snakeX = canvas.width - box;
    if (snakeY < 0) snakeY = 0;
    if (snakeY >= canvas.height) snakeY = canvas.height - box;

    newHead = { x: snakeX, y: snakeY };

    // ⭐ Self collision buffer
    if (collision(newHead, snake)) {
        if (selfHitBuffer > 0) {
            selfHitBuffer--;
        } else {
            alert("Game Over! Score: " + score);
            resetGame();
            return;
        }
    }

    snake.unshift(newHead);

    // ⭐ Score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, canvas.height - 10);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

let game = setInterval(drawGame, speed);

// ⭐ Restart button
document.getElementById("restartBtn").onclick = function () {
    resetGame();
};
