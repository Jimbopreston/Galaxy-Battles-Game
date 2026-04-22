import HexGrid from '../HexGrid.js';
export class Level extends Phaser.Scene {

  constructor(){
    super('Level');
  }

  preload(){
    this.load.image('hex', 'assets/tiles/SpaceHexTile.png');
  }

  create(){
    this.hexGrid = new HexGrid(this, {
      rows: 10,
      cols: 10,
      hexWidth: 64,
      hexHeight: 64,
      texture: 'hex',
      offsetX: 100,
      offsetY: 100
    });

    this.hexGrid.generate();
  }
}
