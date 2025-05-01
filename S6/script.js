const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

// Sonidos
const sonidoRebote = new Audio('audio/rebote.mp3');
const musicaFondo = new Audio('audio/musica.mp3');
musicaFondo.loop = true;
musicaFondo.volume = 0.3;

// Parámetros del juego
const paddleWidth = 10, paddleHeight = 100;
let paddleSpeed = 6;
const ballSize = 10;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 3;

let scorePlayer = 0;
let scoreEnemy = 0;
let nivel2Mostrado = false;

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#fff';
  context.fillRect(10, leftPaddleY, paddleWidth, paddleHeight);
  context.fillRect(canvas.width - 20, rightPaddleY, paddleWidth, paddleHeight);

  context.beginPath();
  context.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
  context.fill();
  context.closePath();

  context.font = "20px Arial";
  context.fillText(`Jugador: ${scorePlayer}`, 20, 20);
  context.fillText(`Enemigo: ${scoreEnemy}`, canvas.width - 140, 20);
}

function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= canvas.height) {
    ballSpeedY = -ballSpeedY;
    sonidoRebote.play();
  }

  if (ballX < 20 && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
    sonidoRebote.play();
  }

  if (ballX > canvas.width - 20 && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
    sonidoRebote.play();
  }

  if (ballX <= 0) {
    scoreEnemy++;
    reiniciarPelota();
  }

  if (ballX >= canvas.width) {
    scorePlayer++;
    reiniciarPelota();
  }

  if (scorePlayer === 5 && !nivel2Mostrado) {
    alert("¡Nivel 2 desbloqueado!");
    ballSpeedX *= 1.5;
    ballSpeedY *= 1.5;
    paddleSpeed += 2;
    nivel2Mostrado = true;
  }

  if (scorePlayer === 10) {
    alert("¡Felicitaciones Juan Pérez, ganaste!");
    document.location.reload();
  }

  if (scoreEnemy === 10) {
    alert("Perdiste. Intenta nuevamente.");
    document.location.reload();
  }
}

function reiniciarPelota() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
}

document.onkeydown = function (e) {
  switch (e.key) {
    case 'w':
      if (leftPaddleY > 0) leftPaddleY -= paddleSpeed;
      break;
    case 's':
      if (leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;
      break;
    case 'ArrowUp':
      if (rightPaddleY > 0) rightPaddleY -= paddleSpeed;
      break;
    case 'ArrowDown':
      if (rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;
      break;
  }
};

function gameLoop() {
  draw();
  update();
  requestAnimationFrame(gameLoop);
}

function iniciarJuego() {
  document.getElementById('portada').style.display = 'none';
  canvas.style.display = 'block';
  musicaFondo.play();
  gameLoop();
}