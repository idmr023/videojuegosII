class Escena extends Phaser.Scene {
    preload() {
        this.load.image('fondo', 'img/fondo.jpg');
            this.load.spritesheet('bola', 'img/bola.png',{
                frameWidth: 100,
                frameHeight: 100
            });
    }
    
    create() {
        this.add.sprite(480, 320, 'fondo');
        this.bola = this.add.sprite(480, 320, 'bola');
        this.anims.create({
            key: 'brillar',
            frames: this. anims.generateFrameNumbers ('bola',{
            start: 0,
            end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.bola.play('brillar');
        
        }
    
}
    
const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scene: Escena,
};

new Phaser.Game(config);

