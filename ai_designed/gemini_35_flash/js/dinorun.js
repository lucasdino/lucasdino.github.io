// Retro Dino Game Engine
// Built in vanilla JavaScript for Gemini 3.5 Flash

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("dino-canvas");
    const player = document.getElementById("dino-player");
    const obstacle = document.getElementById("dino-obstacle");
    const scoreEl = document.getElementById("game-score");
    const jumpBtn = document.getElementById("jump-btn");
    const gameOverScreen = document.getElementById("game-over-screen");

    if (!canvas || !player || !obstacle || !scoreEl || !jumpBtn || !gameOverScreen) {
        // Fallback or early return if elements do not exist
        return;
    }

    // Game Variables
    let isPlaying = false;
    let isJumping = false;
    let score = 0;
    let obstacleX = -60; // Start offscreen
    let obstacleSpeed = 6;
    let baseSpeed = 6;
    let playerY = 0;
    let playerVelocity = 0;
    const gravity = 0.6;
    const jumpPower = -11.5;
    let gameLoopId = null;

    // Reset Game State
    function resetGame() {
        score = 0;
        obstacleX = canvas.clientWidth;
        obstacleSpeed = baseSpeed;
        playerY = 0;
        playerVelocity = 0;
        isJumping = false;
        
        player.style.bottom = "0px";
        player.classList.remove("jumping");
        obstacle.style.left = obstacleX + "px";
        scoreEl.textContent = "0000";
        gameOverScreen.style.display = "none";
    }

    // Start Game Loop
    function startGame() {
        if (isPlaying) return;
        isPlaying = true;
        resetGame();
        gameLoop();
    }

    // Stop Game
    function gameOver() {
        isPlaying = false;
        cancelAnimationFrame(gameLoopId);
        gameOverScreen.style.display = "flex";
    }

    // Jump function
    function jump() {
        if (!isPlaying) {
            startGame();
            return;
        }
        if (!isJumping && playerY === 0) {
            isJumping = true;
            playerVelocity = jumpPower;
            player.classList.add("jumping");
        }
    }

    // Bounding Box Collision
    function checkCollision(r1, r2) {
        return !(
            r1.right < r2.left ||
            r1.left > r2.right ||
            r1.bottom < r2.top ||
            r1.top > r2.bottom
        );
    }

    // Main Game Loop
    function gameLoop() {
        if (!isPlaying) return;

        // 1. Update Player Physics (Jumping)
        if (isJumping) {
            playerVelocity += gravity;
            playerY -= playerVelocity;

            if (playerY <= 0) {
                playerY = 0;
                playerVelocity = 0;
                isJumping = false;
                player.classList.remove("jumping");
            }
        }
        player.style.bottom = playerY + "px";

        // 2. Move Obstacle (Meteor)
        obstacleX -= obstacleSpeed;
        if (obstacleX < -40) {
            obstacleX = canvas.clientWidth;
            // Scale difficulty with score
            obstacleSpeed = baseSpeed + Math.floor(score / 150);
        }
        obstacle.style.left = obstacleX + "px";

        // 3. Increment Score
        score++;
        const padScore = String(score).padStart(4, "0");
        scoreEl.textContent = padScore;

        // 4. Collision Detection
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        // Slightly shrink hitboxes for better gameplay feel
        const playerHitbox = {
            left: playerRect.left + 10,
            right: playerRect.right - 10,
            top: playerRect.top + 8,
            bottom: playerRect.bottom - 2
        };

        const obstacleHitbox = {
            left: obstacleRect.left + 8,
            right: obstacleRect.right - 8,
            top: obstacleRect.top + 8,
            bottom: obstacleRect.bottom - 2
        };

        if (checkCollision(playerHitbox, obstacleHitbox)) {
            gameOver();
            return;
        }

        gameLoopId = requestAnimationFrame(gameLoop);
    }

    // Event Listeners
    // Keyboard listener for Space
    window.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            // Prevent default page scroll on Space
            e.preventDefault();
            jump();
        }
    });

    // Tap/Click controls on canvas
    canvas.addEventListener("click", (e) => {
        e.preventDefault();
        jump();
    });

    // Jump button listener
    jumpBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        jump();
    });

    // Initialize Game Screen
    resetGame();
    // Start automatically
    startGame();
});
