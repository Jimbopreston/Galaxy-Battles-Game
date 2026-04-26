import Unit from './Unit.js';

export default class EnemyUnit extends Unit {
    constructor(scene, tile, texture) {
        super(scene, tile, texture);
        this.createHealthBar();
        this.type = 'enemy';
        this.health = 100;
        this.moveRange = 2;
        this.reachableTiles = [];
        this.isAlive = true;
    }

    

    takeTurn() {
        if (!this.isAlive || !this.scene.player.isAlive) return;

        console.log("Enemy turn");

        // 1. Get all tiles the enemy could move to
        const options = this.getMoveOptions().filter(t => !t.occupant);

        if (options.length === 0) return;

        // 2. Find the tile that is geographically closest to the player's tile
        let target = options[0];
        let minDistance = this.scene.hexGrid.hexDistance(target, this.scene.player.currentTile);

        options.forEach(tile => {
            const dist = this.scene.hexGrid.hexDistance(tile, this.scene.player.currentTile);
            if (dist < minDistance) {
                minDistance = dist;
                target = tile;
            }
        });

        // 3. Move to that closest tile
        this.moveTo(target);
    }

    getMoveOptions() {
        return this.scene.hexGrid.getTilesInRange(
            this.currentTile,
            this.moveRange
        );
    }

    // ⚔️ Ene   my attack
    attackPlayer(player) {
        if (!this.isAlive || !player.isAlive) return;

        const damage = 10;

        player.takeDamage(damage);

        console.log("Player hit for", damage);

        // ❌ DO NOT call endPlayerTurn here
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