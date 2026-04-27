export class LevelSelect extends Phaser.Scene{
    constructor(){
        super('LevelSelect');
    }

   preload(){
    this.load.image('background', '/assets/images/Background.png');
   } 

   create(){
    this.background = this.add.tileSprite(640, 360, 1920, 1080, 'background');

    this.add.text(640, 100, 'Galaxy Battles', { 
        fontSize: '32px', fill: '#FFF' 
        }).setOrigin(0.5);
   
    const levelOneBtn = this.add.text(640,250, 'Level One', {
        fontSize: '28px',
        backgroundColor: '#2f0254',
        padding: 10
    }).setOrigin(0.5).setInteractive();

    levelOneBtn.on('pointerdown', () => {
        this.scene.start('Level', { levelKey: 'level1' });
    })

    const levelTwoBtn = this.add.text(640,350, 'Level Two', {
        fontSize: '28px',
        backgroundColor: '#2f0254',
        padding: 10
    }).setOrigin(0.5).setInteractive();

    levelTwoBtn.on('pointerdown', () => {
        this.scene.start('Level', { levelKey: 'level2' });
    })

    const levelThreeBtn = this.add.text(640,450, 'Level Three', {
        fontSize: '28px',
        backgroundColor: '#2f0254',
        padding: 10
    }).setOrigin(0.5).setInteractive();

    levelThreeBtn.on('pointerdown', () => {
        this.scene.start('Level', { levelKey: 'level3' });
    })

    const levelFourBtn = this.add.text(640,550, 'Level Four', {
        fontSize: '28px',
        backgroundColor: '#2f0254',
        padding: 10
    }).setOrigin(0.5).setInteractive();

    levelFourBtn.on('pointerdown', () => {
        this.scene.start('Level', { levelKey: 'level4' });
    })

   }
}