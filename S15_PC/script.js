var juego = new Phaser.Game(370, 700, Phaser.CANVAS, 'bloque_juego');

var fondoJuego;
var jugador;
var enemigos;
var balas;
var sonidoDisparo;
var sonidoExplosion;
var musicaFondo;
var botonInicio;
var teclaIzquierda;
var teclaDerecha;
var puedeDisparar = true;
var juegoTerminado = false;
var nivel = 1;

var estadoInicio = {
    preload: function () {
        juego.load.image('fondoInicio', 'img/fondo.png');
        juego.load.audio('inicioSonido', 'audio/music.mp3');
        juego.load.image('boton', 'img/boton.png');
    },

    create: function () {
        fondoJuego = juego.add.tileSprite(0, 0, 370, 900, 'fondoInicio');

        var texto = juego.add.text(juego.world.centerX, 200, "Ivan Daniel Manrique Roa", {
            font: "24px Arial",
            fill: "#ffffff"
        });
        texto.anchor.set(0.5);

        botonInicio = juego.add.button(juego.world.centerX, 400, 'boton', function () {
            if (!musicaFondo || !musicaFondo.isPlaying) {
                musicaFondo = juego.add.audio('inicioSonido');
                musicaFondo.volume = 0.3;
                musicaFondo.loopFull();
            }
            juego.state.start('Juego');
        }, this);
        botonInicio.anchor.setTo(0.5);
    }
};

var estadoJuego = {
    preload: function () {
        juego.load.image('fondo', 'img/fondo.png');
        juego.load.image('fondoNivel2', 'img/fondo2.png');
        juego.load.spritesheet('jugador', 'img/spritesheet1.png', 256, 256);
        juego.load.image('enemigo', 'img/enemigo1.png');
        juego.load.image('enemigo2', 'img/enemigo2.png');
        juego.load.image('bala', 'img/laser.png');
        juego.load.audio('disparo', 'audio/laser.mp3');
        juego.load.audio('explosion', 'audio/colision.mp3');
        juego.load.audio('musica', 'audio/music.mp3');
        juego.load.image('botonReiniciar', 'img/boton.png');
    },

    create: function () {
        fondoJuego = juego.add.tileSprite(0, 0, 370, 900, 'fondo');

        jugador = juego.add.sprite(juego.width / 2, 600, 'jugador');
        jugador.anchor.setTo(0.5);
        juego.physics.arcade.enable(jugador);

        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(20, 'bala');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 1);
        balas.setAll('outOfBoundsKill', true);
        balas.setAll('checkWorldBounds', true);

        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        this.crearOleada();

        juego.add.tween(enemigos).to({ x: 150 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

        sonidoDisparo = juego.add.audio('disparo');
        sonidoDisparo.volume = 1;

        sonidoExplosion = juego.add.audio('explosion');
        sonidoExplosion.volume = 1;

        teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        var barra = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        barra.onDown.add(this.disparar, this);

        var footer = juego.add.text(juego.world.centerX, juego.height - 20, "Ivan Daniel Manrique Roa", {
            font: "14px Arial",
            fill: "#ffffff"
        });
        footer.anchor.set(0.5);
    },

    update: function () {
        if (juegoTerminado) return;

        if (teclaIzquierda.isDown && jugador.x > 20) {
            jugador.x -= 5;
        } else if (teclaDerecha.isDown && jugador.x < juego.width - 20) {
            jugador.x += 5;
        }

        juego.physics.arcade.overlap(balas, enemigos, this.colision, null, this);
    },

    disparar: function () {
        if (!puedeDisparar) return;
        puedeDisparar = false;
        juego.time.events.add(Phaser.Timer.SECOND * 0.25, function () {
            puedeDisparar = true;
        });

        var bala = balas.getFirstExists(false);
        if (bala) {
            bala.reset(jugador.x, jugador.y);
            bala.body.velocity.y = -300;
            sonidoDisparo.play();
        }
    },

    crearOleada: function () {
        var posiciones = [
            [0, 0], [70, 0], [140, 0], [210, 0],
            [0, 70], [70, 70], [140, 70], [210, 70],
            [0, 140], [70, 140], [140, 140], [210, 140]
        ];

        for (var i = 0; i < posiciones.length; i++) {
            var spriteEnemigo = (nivel === 1) ? 'enemigo' : 'enemigo2';
            enemigos.create(posiciones[i][0], posiciones[i][1], spriteEnemigo);
        }
    },

    colision: function (bala, enemigo) {
        bala.kill();
        enemigo.kill();
        sonidoExplosion.play();

        if (enemigos.countLiving() === 0) {
            if (nivel === 1) {
                nivel = 2;
                fondoJuego.loadTexture('fondoNivel2');
                this.crearOleada();
            } else {
                this.mostrarMensajeFinal();
            }
        }
    },

    mostrarMensajeFinal: function () {
        juegoTerminado = true;
        juego.world.removeAll();
        fondoJuego = juego.add.tileSprite(0, 0, 370, 900, 'fondoNivel2');

        var mensaje1 = juego.add.text(juego.world.centerX, 250, "Felicitaciones, Ivan Daniel Manrique Roa", {
            font: "24px Arial",
            fill: "#ffffff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 300
        });
        mensaje1.anchor.set(0.5);

        var mensaje2 = juego.add.text(juego.world.centerX, 320, "Has completado el juego exitosamente.\nGracias por jugar.", {
            font: "20px Arial",
            fill: "#ffffff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 300
        });
        mensaje2.anchor.set(0.5);

        var botonReiniciar = juego.add.button(juego.world.centerX, 450, 'botonReiniciar', function () {
            nivel = 1;
            juegoTerminado = false;
            if (musicaFondo && musicaFondo.isPlaying) musicaFondo.stop();
            juego.state.start('Inicio');
        }, this);
        botonReiniciar.anchor.set(0.5);
    }
};

juego.state.add('Inicio', estadoInicio);
juego.state.add('Juego', estadoJuego);
juego.state.start('Inicio');