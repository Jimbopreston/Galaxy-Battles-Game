import Unit from './Unit.js';

export default class PlayerUnit extends Unit {
    constructor(scene, tile, texture) {
        super(scene, tile, texture);
        this.type = 'player';
        this.health = 100;
        this.moveRange = 3;
        this.reachableTiles = [];
        this.sprite = scene.add.image(tile.x, tile.y, texture);
        this.currentTile = tile;
        tile.setOccupant(this);
    }

    takeTurn() {
        console.log("Player turn");
    }

    select() {
        this.clearSelection();

        this.reachableTiles = this.scene.hexGrid.getTilesInRange(
            this.currentTile,
            this.moveRange
        );

        this.reachableTiles.forEach(tile => tile.highlight());
    }

    clearSelection() {
        this.reachableTiles.forEach(tile => tile.clearHighlight());
        this.reachableTiles = [];
    }

    moveTo(tile) {

        if (!this.sprite) {
            console.error("Sprite missing on unit!");
            return;
        }

        if (this.currentTile) {
            this.currentTile.removeOccupant();
        }

        this.currentTile = tile;
        tile.setOccupant(this);

        this.scene.tweens.add({
            targets: this.sprite,
            x: tile.x,
            y: tile.y,
            duration: 200
        });
    }
}