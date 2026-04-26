export class StartScreen extends Phaser.Scene{
    constructor()  {
        super('Start')
    }

    preload(){
        this.load.image('background', '/assets/images/Background.png');
        this.load.audio('menutheme', '/assets/audio/menuTheme.mp3')
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1920, 1080, 'background');

        if (!this.sound.get('bgMusic')) {
            const music = this.sound.add('menutheme', {
            volume: 0.7,
            loop: true
            });

            music.play();
        }

        this.add.text(640, 200, 'Galaxy Battles', { 
          fontSize: '72px',
          fill: '#FFD700',
          stroke: '#000000',
          strokeThickness: 6
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