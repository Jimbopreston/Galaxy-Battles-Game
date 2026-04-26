import Unit from './Unit.js';

export default class PlayerUnit extends Unit {
    constructor(scene, tile, texture) {
        super(scene, tile, texture);
        this.createHealthBar();
        this.type = 'player';
        this.health = 100;
        this.moveRange = 3;
        this.reachableTiles = [];
        this.isAlive = true;
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
        if (tile.occupant || !this.isAlive) return false;

        if (this.currentTile) {
            this.currentTile.setOccupant(null);
        }

        this.currentTile = tile;
        tile.setOccupant(this);

        this.sprite.x = tile.x;
        this.sprite.y = tile.y;

        return true;
    }

    takeDamage(amount) {
        if (!this.isAlive) return;

        this.health -= amount;

        console.log(this.type + " took " + amount);

        this.updateHealthBar();

        if (this.health <= 0) {
            this.isAlive = false;

            if (this.currentTile) {
                this.currentTile.setOccupant(null);
            }

            this.sprite.destroy();

            if (this.healthBarBg) this.healthBarBg.destroy();
            if (this.healthBarFill) this.healthBarFill.destroy();
        }
    }
}