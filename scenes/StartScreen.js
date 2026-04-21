export class StartScreen extends Phaser.Scene{
    constructor()  {
        super('Start')
    }

    preload(){
        this.load.image('background', '/assets/images/Background.png');
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1920, 1080, 'background');

        this.add.text(640, 200, 'Galaxy Battles', { 
            fontSize: '32px', fill: '#FFFFFF' 
            }).setOrigin(0.5);
        

    const startBtn = this.add.text(640,640, 'Start Game', {
        fontSize: '32px',
        color: '#ffffff',
        backgroundColor: '#222',
        padding: { x: 20, y: 10 },
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5).setInteractive();

    startBtn.on('pointerdown', () => {
        this.scene.start('MainScreen');
    })

    startBtn.on('pointerover', () => {
    startBtn.setStyle({ backgroundColor: '#000000' });
    startBtn.setScale(1.1);
    });

    startBtn.on('pointerout', () => {
    startBtn.setStyle({ backgroundColor: '#000000' });
    startBtn.setScale(1);
    });

    startBtn.on('pointerdown', () => {
    startBtn.setScale(0.95);
    });

    startBtn.on('pointerup', () => {
    startBtn.setScale(1.1);
    this.scene.start('Game');
    });
    }

    update() {
        

        const speed = 200;
        
    }
}