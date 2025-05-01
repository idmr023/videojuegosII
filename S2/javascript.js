class Escena extends Phaser.Scene {
    
    preload() {
        this.load.image('fondo', 'img/fondo.jpg');
        this.load.spritesheet('bola', 'img/bola.png', { 
            frameWidth: 100, 
            frameHeight: 100 
        });
        this.load.image('mano1', 'img/mano1.png');
        this.load.image('mano2', 'img/mano2.png');
        this.load.image('leftbtn', 'img/flecha.png');

        //cargar sonidos
        this.load.audio('rebote', 'sounds/rebote.mp3'); // sonido de rebote
        this.load.audio('punto', 'sounds/punto.mp3'); // sonido de punto


    }

    create() {

        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();

        // Crear sonidos
        this.sonidoRebote = this.sound.add('rebote');
        this.sonidoPunto = this.sound.add('punto');

        this.add.sprite(480, 320, 'fondo');
        this.bola = this.physics.add.sprite(480, 320, 'bola');

        this.anims.create({
            key: 'brillar',
            frames: this.anims.generateFrameNumbers('bola', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.bola.play('brillar');

        //Primer jugador
        this.bola.setBounce(1);
        this.mano1 = this.physics.add.sprite(70, 320, 'mano1');
        this.mano1.body.immovable = true;
        this.bola.setBounce(10);
        this.mano1.setSize(60, 250);
        this.physics.add.collider(this.bola, this.mano1, this.emitirSonidoRebote, null, this);
        this.mano1.setCollideWorldBounds(true);

        //Segundo jugador
        this.mano2 = this.physics.add.sprite(882, 320, 'mano2');
        this.mano2.body.immovable = true;
        this.mano2.setBounce(10);
        this.mano2.setSize(60, 250);
        this.physics.add.collider(this.bola, this.mano2, this.emitirSonidoRebote, null, this);
        this.mano2.setCollideWorldBounds(true);

        const velocidad = 500;

        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        const derechaOIzquierda = Math.floor(Math.random() * 2);
        if (derechaOIzquierda === 1) anguloInicial += Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        // Agregar evento para detectar cuando la bola rebota en los bordes
        this.bola.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', this.emitirSonidoRebote, this);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.controlesVisuales({
            x: 50,
            y: 50,
        }, {
            x: 50,
            y: 590,
        }, this.mano1);
        //Controles visuales del segundo jugador
        this.controlesVisuales({
            x: 910,
            y: 50,
        }, {
            x: 910,
            y: 590,
        }, this.mano2);

        this.alguienGano = false;

        this.pintarMarcador();
    }

    update() {
        this.bola.rotation += 0.01;

        if (this.bola.x < 0 && this.alguienGano === false) {
            this.sonidoPunto.play();
            alert('Jugador 2 ha ganado!');
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.colocarBola();
        } else if (this.bola.x > 960 && this.alguienGano === false) {
            this.sonidoPunto.play();
            alert('Jugador 1 ha ganado!');
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.colocarBola();
        }
        
        //Control del primer jugador
        if (this.cursors.up.isDown || this.mano1.getData('direccionVertical') === 1) {
            this.mano1.y = this.mano1.y - 5;
        } else if (this.cursors.down.isDown || this.mano1.getData('direccionVertical') === -1) {
            this.mano1.y = this.mano1.y + 5;
        }

        //Control del segundo jugador
        if (this.cursors.up.isDown || this.mano2.getData('direccionVertical') === 1) {
            this.mano2.y = this.mano2.y - 5;
        } else if (this.cursors.down.isDown || this.mano2.getData('direccionVertical') === -1) {
            this.mano2.y = this.mano2.y + 5;
        }

    }

    pintarMarcador() {
        this.marcadorMano1 = this.add.text(440, 75, '0', {
            fontFamily: 'Arial, sans-serif',
            fontSize: 80,
            fontStyle: 'bold',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'right',
        }).setOrigin(1, 0);
        this.marcadorMano2 = this.add.text(520, 75, '0', {
            fontFamily: 'Arial, sans-serif',
            fontSize: 80,
            fontStyle: 'bold',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 6
        });
        
        // Agregar crédito en la parte inferior
        this.add.text(480, 620, "Elias Morote Loli", {
            fontFamily: 'Arial, sans-serif',
            fontSize: 20,
            fontStyle: 'italic',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 1);
    }

    colocarBola() {
        const velocidad = 500;

        let anguloInicial = Math.random() * (Math.PI / 4 * 3 - Math.PI / 4) + Math.PI / 4;
        const derechaOIzquierda = Math.floor(Math.random() * 2);
        if (derechaOIzquierda === 1) anguloInicial += Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola = this.physics.add.sprite(480, 320, 'bola');
        this.bola.play('brillar');

        this.bola.setBounce(1);
        this.physics.world.enable(this.bola);

        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
        this.physics.add.collider(this.bola, this.mano1, this.emitirSonidoRebote, null, this);
        this.physics.add.collider(this.bola, this.mano2, this.emitirSonidoRebote, null, this);
        this.alguienGano = false;
    }

    controlesVisuales(btn1, btn2, player) {
        const upbtn = this.add.sprite(btn1.x, btn1.y, 'leftbtn').setInteractive();
        const downbtn = this.add.sprite(btn2.x, btn2.y, 'leftbtn').setInteractive();
        downbtn.flipY = true;

        downbtn.on('pointerdown', () => {
            player.setData('direccionVertical', -1);
        });

        upbtn.on('pointerdown', () => {
            player.setData('direccionVertical', 1);
        });

        downbtn.on('pointerup', () => {
            player.setData('direccionVertical', 0);
        });

        upbtn.on('pointerup', () => {
            player.setData('direccionVertical', 0);
        });
    }

    emitirSonidoRebote() {
        this.sonidoRebote.play();
    }
}

const config = {
    type: Phaser.AUTO,
    with: 960,
    height: 640,
    scene: Escena,
    physics: {
        default: 'arcade',
    }
};

new Phaser.Game(config);