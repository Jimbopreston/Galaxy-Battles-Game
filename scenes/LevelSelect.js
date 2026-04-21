export class LevelSelect extends Phaser.Scene{
    constructor(){
        super(LevelSelect)
    }

   preload(){
    this.load.image('background', '/assets/images/Background.png');
   } 
}