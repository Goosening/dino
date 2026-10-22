const player = document.querySelector(".player");
const obstacle = document.querySelector(".obstacle");
const startButton = document.querySelector(".startbutton");
const scoreDisplay = document.querySelector(".score");

let isJumping = false;
let gameRunning = false;
let gameLoopId;
let obstaclePos = 100;
let score = 0;
let frameCount = 0;

function jump() {
    if (isJumping || !gameRunning) return;
    isJumping = true;
    player.style.transition = "bottom 0.25s ease-out, background-color 0.5s ease";
    player.style.bottom = "calc(20% + 120px)";
    setTimeout(() => {
        player.style.transition = "bottom 0.35s ease-in, background-color 0.5s ease";
        player.style.bottom = "20%";
    }, 450);
    setTimeout(() => {
        isJumping = false;
    }, 800);
}

function checkCollision() {
    const p = player.getBoundingClientRect();
    const o = obstacle.getBoundingClientRect();
    return (
        p.right - 8 > o.left &&
        p.left + 8 < o.right &&
        p.bottom - 4 > o.top &&
        p.top < o.bottom
    );
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(gameLoopId);
    startButton.textContent = "Game Over (Score: " + score + ") - Restart";
    startButton.style.display = "flex";
}

function gameLoop() {
    if (!gameRunning) return;

    frameCount++;
    if (frameCount % 6 === 0) {
        score++;
        scoreDisplay.textContent = "Score: " + score;
        document.body.classList.toggle("inverted", Math.floor(score / 150) % 2 === 1);
    }

    obstaclePos -= 0.7;
    if (obstaclePos < -10) {
        obstaclePos = 100;
    }
    obstacle.style.left = obstaclePos + "%";

    if (checkCollision()) {
        gameOver();
        return;
    }

    gameLoopId = requestAnimationFrame(gameLoop);
}

function startGame() {
    gameRunning = true;
    isJumping = false;
    score = 0;
    frameCount = 0;
    scoreDisplay.textContent = "Score: 0";
    document.body.classList.remove("inverted");
    player.style.transition = "";
    player.style.bottom = "20%";
    obstaclePos = 100;
    obstacle.style.left = "100%";
    startButton.style.display = "none";
    gameLoopId = requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
        jump();
    }
});

startButton.addEventListener("click", startGame);