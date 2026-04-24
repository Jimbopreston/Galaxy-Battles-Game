import HexGrid from '../HexGrid.js';
import PlayerUnit from '../PlayerUnit.js';
import EnemyUnit from '../EnemyUnit.js';
export class Level extends Phaser.Scene {

  constructor(){
    super('Level');
  }

  endPlayerTurn() {
    this.currentTurn = 'enemy';

    this.time.delayedCall(300, () => {
      this.enemies.forEach(enemy => enemy.takeTurn());

      this.currentTurn = 'player';
    });
  }

  preload(){
    this.load.image('background', '/assets/images/Background.png');
    this.load.image('hex', 'assets/tiles/SpaceHexTile.png');
    this.load.image('ship', 'assets/units/ship.png');
    this.load.image('playerShip', 'assets/images/playerShip.png');
    this.load.image('enemyShip', 'assets/images/enemyship.png');
  }

  create(){
  this.background = this.add.tileSprite(640, 360, 1920, 1080, 'background');

  this.selectedUnit = null;
  this.currentTurn = 'player';

  this.hexGrid = new HexGrid(this, {
    rows: 7,
    cols: 13,
    hexWidth: 64,
    hexHeight: 64,
    texture: 'hex',
    offsetX: 100,
    offsetY: 100
  });

  this.hexGrid.generate();

  const playerTile = this.hexGrid.grid[2][2];
  const enemyTile = this.hexGrid.grid[5][5];

  // ✅ CREATE PLAYER ONLY ONCE
  this.player = new PlayerUnit(this, playerTile, 'playerShip');

  this.enemies = [];
  this.enemies.push(new EnemyUnit(this, enemyTile, 'enemyShip'));

  // =========================
  // 🧠 TILE CLICK LOGIC
  // =========================

  this.hexGrid.tiles.forEach(tile => {

    tile.sprite.setInteractive();

tile.sprite.on('pointerdown', () => {

  // only allow movement during player's turn
  if (this.currentTurn !== 'player') return;

  // player must click/select their ship first
  const unit = this.selectedUnit;

  if (!unit) return;
  if (!unit.reachableTiles) return;

  // only move if tile is highlighted and empty
  if (unit.reachableTiles.includes(tile) && !tile.occupant) {

    unit.clearSelection();
    unit.moveTo(tile);

    this.selectedUnit = null;

    this.endPlayerTurn();
  }
});
  });

  // =========================
  // 🧍 UNIT CLICK LOGIC
  // =========================

  this.player.sprite.setInteractive();

this.player.sprite.on('pointerdown', () => {
  if (this.currentTurn !== 'player') return;

  this.selectedUnit = this.player;
  this.player.select();
});
}
}
