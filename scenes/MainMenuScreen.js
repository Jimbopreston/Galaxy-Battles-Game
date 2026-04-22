export class MainMenuScreen extends Phaser.Scene{
    constructor() {
        super('MainScreen');
    }

    preload(){
        this.load.image('background', '/assets/images/Background.png');
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1920, 1080, 'background');

        this.add.text(640, 100, 'Galaxy Battles', { 
            fontSize: '32px', fill: '#FFF' 
            }).setOrigin(0.5);

    const levelBtn = this.add.text(640,250, 'Level Select', {
        fontSize: '28px',
        backgroundColor: '#000',
        padding: 10
    }).setOrigin(0.5).setInteractive();

    const optionsBtn = this.add.text(640, 350, 'Options', {
        fontSize: '28px',
        backgroundColor: '#000',
        padding: 10 
        }).setOrigin(0.5).setInteractive();

    levelBtn.on('pointerdown', () => {
        this.scene.start('LevelSelect');
    })
    

    optionsBtn.on('pointerdown', () => {
        this.scene.start('Options');
    })


    }
}