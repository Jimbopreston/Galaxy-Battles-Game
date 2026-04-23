import Unit from './Unit.js';

export default class EnemyUnit extends Unit{
  constructor(scene, tile, texture) {
    super(scene, tile, texture);

    this.type = 'enemy';
    this.health = 100;
    this.moveRange = 3;
    this.reachableTiles = [];
  }

  takeTurn() {
    console.log("Enemy turn triggered");

    const neighbors = this.scene.hexGrid.getNeighbors(
        this.tile.col,
        this.tile.row
    );

    console.log("neighbors:", neighbors.length);

    const validTiles = neighbors.filter(t => !t.occupant);

    console.log("valid tiles:", validTiles.length);

    if (validTiles.length > 0) {
        const randomTile = validTiles[
        Math.floor(Math.random() * validTiles.length)
        ];

        console.log("Moving to:", randomTile.col, randomTile.row);

        this.moveTo(randomTile);
        } else {
            console.log("No valid tiles to move");
        }
    }

    getMoveOptions() {
        return this.scene.hexGrid.getTilesInRange(
            this.currentTile,
            this.moveRange
        );
    }

    takeTurn() {
        const options = this.getMoveOptions();
        const target = options[Math.floor(Math.random() * options.length)];
        if (!target) return;
        this.moveTo(target);
    }
}