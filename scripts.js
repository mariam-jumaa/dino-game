// ---------- Canvas setup ----------
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
 
// ---------- Score display ----------
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const resetBtn = document.getElementById("resetBtn");
 
// ---------- Images ----------
const dinoImg = new Image();
dinoImg.src = "img/trex.png";
 
const cactusImg = new Image();
cactusImg.src = "img/cactus.png";
 
// ---------- Game states ----------
// PC4.7
const GAME_STATE = {
  START: "start",
  PLAYING: "playing",
  GAME_OVER: "gameover"
};
 
let gameState = GAME_STATE.START;
 
// ---------- Ground ----------
const groundY = 190;
 
// ---------- Player object ----------
// PC4.3
const player = {
  x: 80,
  y: groundY - 50,
  width: 50,
  height: 50,
  velocityY: 0,
  gravity: 0.8,
  jumpStrength: -12,
  isJumping: false
};
 
// ---------- Obstacles ----------
// PC4.5
let obstacles = [];
 
// ---------- Score ----------
// PC4.8
let score = 0;
let highScore = Number(localStorage.getItem("dinoHighScore")) || 0;
scoreText.textContent = score;
highScoreText.textContent = highScore;
 
// ---------- Timing ----------
let frameCount = 0;
 
// ==========================================
// Drawing functions
// ==========================================
 
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
 
function drawGround() {
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(canvas.width, groundY);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
}
 
function drawPlayer() {
  ctx.drawImage(dinoImg, player.x, player.y, player.width, player.height);
}
 
function drawObstacles() {
  for (let obstacle of obstacles) {
    ctx.drawImage(
      cactusImg,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );
  }
}
 
function drawStartScreen() {
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
 
  ctx.font = "32px Arial";
  ctx.fillText("Press Space to Start", canvas.width / 2, 90);
 
  ctx.font = "20px Arial";
  ctx.fillText("Use Space or Arrow Up to Jump", canvas.width / 2, 130);
 
  ctx.textAlign = "left";
}
 
function drawGameOverScreen() {
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
 
  ctx.font = "32px Arial";
  ctx.fillText("Game Over", canvas.width / 2, 90);
 
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Press R or Reset Game to Play Again", canvas.width / 2, 130);
 
  ctx.textAlign = "left";
}
 
// ==========================================
// Update functions
// ==========================================
 
// PC4.3
function updatePlayer() {
  player.velocityY += player.gravity;
  player.y += player.velocityY;
 
  if (player.y >= groundY - player.height) {
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.isJumping = false;
  }
}
 
// PC4.5
function createObstacle() {
  const obstacle = {
    x: canvas.width,
    y: groundY - 40,
    width: 25,
    height: 40,
    speed: 5
  };
 
  obstacles.push(obstacle);
}
 
// PC4.5
function updateObstacles() {
  for (let obstacle of obstacles) {
    obstacle.x -= obstacle.speed;
  }
 
  obstacles = obstacles.filter(
    obstacle => obstacle.x + obstacle.width > 0
  );
}
 
// PC4.6
function checkCollision() {
  for (let obstacle of obstacles) {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      return true;
    }
  }
 
  return false;
}
 
// PC4.8
function updateScore() {
  score += 1;
  scoreText.textContent = score;
}
 
// PC4.8
function saveHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("dinoHighScore", highScore);
    highScoreText.textContent = highScore;
  }
}
 
// ==========================================
// Game control functions
// ==========================================
 
// PC4.3 + PC4.4
function handleJump() {
  if (!player.isJumping) {
    player.velocityY = player.jumpStrength;
    player.isJumping = true;
  }
}
 
// PC4.7
function resetGame() {
  obstacles = [];
  score = 0;
  frameCount = 0;
 
  player.x = 80;
  player.y = groundY - player.height;
  player.velocityY = 0;
  player.isJumping = false;
 
  scoreText.textContent = score;
  highScoreText.textContent = highScore;
 
  gameState = GAME_STATE.START;
}
 
// PC4.7
function startGame() {
  if (gameState === GAME_STATE.START) {
    gameState = GAME_STATE.PLAYING;
  }
}
 
// PC4.7
function endGame() {
  gameState = GAME_STATE.GAME_OVER;
 
  saveHighScore();
}
 
// ==========================================
// Input handling
// ==========================================
 
// PC4.4
document.addEventListener("keydown", function (event) {
  if (event.code === "Space" || event.code === "ArrowUp") {
    if (gameState === GAME_STATE.START) {
      startGame();
    } else if (gameState === GAME_STATE.PLAYING) {
      handleJump();
    }
  }
 
  if (event.code === "KeyR" && gameState === GAME_STATE.GAME_OVER) {
    resetGame();
  }
});
 
resetBtn.addEventListener("click", resetGame);
 
// ==========================================
// Game loop
// ==========================================
 
// PC4.2
function gameLoop() {
  clearCanvas();
  drawGround();
  drawPlayer();
  drawObstacles();
 
  if (gameState === GAME_STATE.START) {
    drawStartScreen();
  }
 
  if (gameState === GAME_STATE.PLAYING) {
    frameCount++;
 
    updatePlayer();
    updateObstacles();
    updateScore();
 
    if (frameCount % 100 === 0) {
      createObstacle();
    }
 
    if (checkCollision()) {
      endGame();
    }
  }
 
  if (gameState === GAME_STATE.GAME_OVER) {
    drawGameOverScreen();
  }
 
  requestAnimationFrame(gameLoop);
}
 
// ---------- Start the loop ----------
gameLoop();