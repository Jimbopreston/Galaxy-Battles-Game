import { StartScreen } from './scenes/StartScreen.js';
import { MainMenuScreen } from './scenes/MainMenuScreen.js';
import { LevelSelect } from './scenes/LevelSelect.js';
import { Level } from './scenes/Level.js';

const config = {
    type: Phaser.AUTO,
    title: 'Galaxy Battles',
    description: 'This is galaxy battles! A game to teach children maths',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        StartScreen,
        MainMenuScreen,
        LevelSelect,
        Level
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
    }
}
}

new Phaser.Game(config);
            