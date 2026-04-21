export class MainMenuScreen extends Phaser.Scene{
    constructor() {
        super('MainScreen');
    }

    preload(){
        this.load.image('background', '/assets/images/Background.png');
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1920, 1080, 'background');

        this.add.text(640, 200, 'Galaxy Battles', { 
            fontSize: '16px', fill: '#FFF' 
            }).setOrigin(0.5);

    const startBtn = this.add.text(640,200, 'Level Select', {
        fontSize: '28px',
        backgroundColor: '#000',
        padding: 10
    }).setOrigin(0.5).setInteractive();

    const optionsBtn = this.add.text(640, 400, 'Options', {
        fontSize: '28px',
        backgroundColor: '#000',
        padding: 10 
        }).setOrigin(0.5).setInteractive();

    startBtn.on('pointerdown', () => {
        this.scene.start('Game');
    })

    optionsBtn.on('pointerdown', () => {
        this.scene.start('Options');
    })


    }
}