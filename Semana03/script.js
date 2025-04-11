var juego = new Phaser.Game(370, 700, Phaser.CANVAS, 'bloque_juego');

var fondoJuego;
var jugador;
var enemigos;
var balas;
var sonidoDisparo;
var sonidoExplosion;
var botonInicio;
var teclaIzquierda;
var teclaDerecha;

var estadoInicio = {
    preload: function() {
        juego.load.image('fondoInicio', 'img/fondo.png');
        juego.load.audio('inicioSonido', 'audio/music.mp3');
        juego.load.image('boton', 'img/boton.png');
    },

    create: function() {
        fondoJuego = juego.add.tileSprite(0, 0, 370, 900, 'fondoInicio');

        var texto = juego.add.text(juego.world.centerX, 200, "Ivan Daniel Manrique Roa", {
            font: "24px Arial",
            fill: "#ffffff"
        });
        texto.anchor.set(0.5);

        botonInicio = juego.add.button(juego.world.centerX, 400, 'boton', function() {
            var sonido = juego.add.audio('inicioSonido');
            sonido.play();
            juego.state.start('Juego');
        }, this);
        botonInicio.anchor.setTo(0.5);
    }
};

var estadoJuego = {
    preload: function() {
        juego.load.image('fondo', 'img/fondo.png');
        juego.load.spritesheet('jugador', 'img/spritesheet1.png', 256, 256); // Asegúrate que los frames sean correctos
        juego.load.image('enemigo', 'img/enemigo1.png');
        juego.load.image('bala', 'img/laser.png');
        juego.load.audio('disparo', 'assets/disparo.mp3');
        juego.load.audio('explosion', 'assets/explosion.mp3');
    },

    create: function() {
        fondoJuego = juego.add.tileSprite(0, 0, 370, 900, 'fondo');

        jugador = juego.add.sprite(juego.width / 2, 600, 'jugador');
        jugador.anchor.setTo(0.5);
        juego.physics.arcade.enable(jugador);
        jugador.animations.add('caminar', [0, 1, 2, 3, 4], 10, true);
        jugador.animations.play('caminar');

        // Grupo de balas
        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(20, 'bala');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 1);
        balas.setAll('outOfBoundsKill', true);
        balas.setAll('checkWorldBounds', true);

        // Grupo de enemigos
        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        this.crearOleada();

        // Movimiento lateral del grupo de enemigos
        juego.add.tween(enemigos).to({ x: 150 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

        // Sonidos
        sonidoDisparo = juego.add.audio('disparo');
        sonidoExplosion = juego.add.audio('explosion');

        // Controles
        teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        juego.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    },

    update: function() {
        if (teclaIzquierda.isDown) {
            jugador.x -= 5;
        } else if (teclaDerecha.isDown) {
            jugador.x += 5;
        }

        if (juego.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.disparar();
        }

        juego.physics.arcade.overlap(balas, enemigos, this.colision, null, this);
    },

    disparar: function() {
        var bala = balas.getFirstExists(false);
        if (bala) {
            bala.reset(jugador.x, jugador.y);
            bala.body.velocity.y = -300;
            sonidoDisparo.play();
        }
    },

    crearOleada: function() {
        var posiciones = [
            [0, 0], [70, 0], [140, 0], [210, 0],
            [0, 70], [70, 70], [140, 70], [210, 70],
            [0, 140], [70, 140], [140, 140], [210, 140]
        ];

        for (var i = 0; i < posiciones.length; i++) {
            var enemigo = enemigos.create(posiciones[i][0], posiciones[i][1], 'enemigo');
        }
    },

    colision: function(bala, enemigo) {
        bala.kill();
        enemigo.kill();
        sonidoExplosion.play();
    }
};

juego.state.add('Inicio', estadoInicio);
juego.state.add('Juego', estadoJuego);
juego.state.start('Inicio');