const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Sonido al recolectar moneda
const collisionSound = new Audio('audio/colision.mp3');

// Botón de inicio para activar sonido
document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('startButton').style.display = 'none';
    canvas.style.display = 'block';
    gameLoop();
});

// Teclas presionadas
let keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Jugador
const player = { x: 50, y: 50, w: 30, h: 30, color: 'red', speed: 3 };

// Niveles
const levels = [
    {
        obstacles: [
            { x: 100, y: 150, w: 400, h: 20 },
            { x: 300, y: 250, w: 20, h: 100 }
        ],
        coins: [
            { x: 500, y: 50, collected: false },
            { x: 50, y: 300, collected: false }
        ]
    },
    {
        obstacles: [
            { x: 200, y: 100, w: 200, h: 20 },
            { x: 200, y: 200, w: 20, h: 100 },
            { x: 400, y: 200, w: 20, h: 100 }
        ],
        coins: [
            { x: 50, y: 50, collected: false },
            { x: 550, y: 350, collected: false },
            { x: 300, y: 50, collected: false }
        ]
    },
    {
        obstacles: [
            { x: 100, y: 100, w: 400, h: 20 },
            { x: 100, y: 300, w: 400, h: 20 },
            { x: 100, y: 120, w: 20, h: 180 },
            { x: 480, y: 120, w: 20, h: 80 } // Deja puerta inferior derecha
        ],
        coins: [
            { x: 275, y: 200, collected: false }
        ]
    }
];

let currentLevel = 0;

// Colisión entre rectángulos
function rectsCollide(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

// Dibujo de rectángulos
function drawRect(obj) {
    ctx.fillStyle = obj.color || 'white';
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
}

// Lógica del juego
function update() {
    const level = levels[currentLevel];

    // Movimiento
    if (keys['ArrowUp']) player.y -= player.speed;
    if (keys['ArrowDown']) player.y += player.speed;
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;

    // Límites del canvas
    if (player.x < 0) player.x = 0;
    if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;
    if (player.y < 0) player.y = 0;
    if (player.y + player.h > canvas.height) player.y = canvas.height - player.h;

    // Colisiones con obstáculos (sin sonido)
    for (let obs of level.obstacles) {
        if (rectsCollide(player, obs)) {
            if (keys['ArrowUp']) player.y += player.speed;
            if (keys['ArrowDown']) player.y -= player.speed;
            if (keys['ArrowLeft']) player.x += player.speed;
            if (keys['ArrowRight']) player.x -= player.speed;
        }
    }

    // Colisiones con monedas (con sonido)
    for (let coin of level.coins) {
        if (!coin.collected) {
            if (
                player.x < coin.x + 15 &&
                player.x + player.w > coin.x &&
                player.y < coin.y + 15 &&
                player.y + player.h > coin.y
            ) {
                coin.collected = true;
                collisionSound.pause();
                collisionSound.currentTime = 0;
                collisionSound.play();
            }
        }
    }

    // Paso de nivel
    const allCollected = level.coins.every(c => c.collected);
    if (allCollected) {
        if (currentLevel < levels.length - 1) {
            currentLevel++;
            resetLevel();
        } else {
            alert("¡Felicitaciones! Ivan Daniel Manrique Roa");
            currentLevel = 0;
            resetLevel();
        }
    }
}

// Reiniciar nivel
function resetLevel() {
    player.x = 50;
    player.y = 50;
    keys = {};
    levels[currentLevel].coins.forEach(c => c.collected = false);
}

// Dibujo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(player);

    const level = levels[currentLevel];

    for (let obs of level.obstacles) {
        drawRect({ ...obs, color: 'gray' });
    }

    for (let coin of level.coins) {
        if (!coin.collected) {
            ctx.fillStyle = 'gold';
            ctx.beginPath();
            ctx.arc(coin.x + 7.5, coin.y + 7.5, 7.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Nivel: ${currentLevel + 1} - Ivan Daniel Manrique Roa`, 10, 20);
}

// Loop del juego
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}