const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Jugador - un aventurero
const player = {
  x: 100,
  y: 300,
  width: 30,
  height: 30,
  color: "#1e90ff",
  speed: 4,
  vx: 0,
  vy: 0,
  jumping: false
};

// Enemigo - una esfera roja que rastrea al jugador
const enemy = {
  x: 700,
  y: 300,
  radius: 20,
  color: "#ff3333",
  speed: 1.5
};

// Portal giratorio
const portal = {
  x: 600,
  y: 180,
  size: 50,
  angle: 0,
  color: "#00cc66"
};

const gravity = 0.5;
const ground = 330;

const keys = {};
let bgHue = 200;

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function updatePlayer() {
  // Movimiento horizontal
  player.vx = 0;
  if (keys["ArrowLeft"]) player.vx = -player.speed;
  if (keys["ArrowRight"]) player.vx = player.speed;

  // Salto controlado
  if (keys["Space"] && !player.jumping) {
    player.vy = -10;
    player.jumping = true;
  }

  player.vy += gravity;
  player.x += player.vx;
  player.y += player.vy;

  if (player.y > ground) {
    player.y = ground;
    player.vy = 0;
    player.jumping = false;
  }
}

function updateEnemy() {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 250) {
    enemy.x += (dx / dist) * enemy.speed;
    enemy.y += (dy / dist) * enemy.speed;
  }
}

function updatePortal() {
  portal.angle += 0.03;
}

function updateBackground() {
  bgHue = (bgHue + 0.1) % 360;
  canvas.style.backgroundColor = `hsl(${bgHue}, 50%, 90%)`;
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemy() {
  ctx.fillStyle = enemy.color;
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawPortal() {
  ctx.save();
  ctx.translate(portal.x, portal.y);
  ctx.rotate(portal.angle);
  ctx.strokeStyle = portal.color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, portal.size, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-portal.size, 0);
  ctx.lineTo(portal.size, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -portal.size);
  ctx.lineTo(0, portal.size);
  ctx.stroke();
  ctx.restore();
}

function drawGround() {
  ctx.fillStyle = "#444";
  ctx.fillRect(0, ground + 30, canvas.width, 50);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateBackground();
  updatePlayer();
  updateEnemy();
  updatePortal();

  drawGround();
  drawPortal();
  drawPlayer();
  drawEnemy();

  requestAnimationFrame(gameLoop);
}

gameLoop();