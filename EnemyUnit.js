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

        // 1. Calculate current distance to player
        const distToPlayer = this.scene.hexGrid.hexDistance(this.currentTile, this.scene.player.currentTile);

        // 2. If already in range (1 tile away), attack instead of moving
        if (distToPlayer === 1) {
            console.log("Enemy is in range! Attacking player.");
            this.attackPlayer(this.scene.player);
            return;
        }

        // 3. Otherwise, find the best tile to move closer
        const options = this.getMoveOptions().filter(t => !t.occupant);
        if (options.length === 0) return;

        let target = options[0];
        let minDistance = this.scene.hexGrid.hexDistance(target, this.scene.player.currentTile);

        options.forEach(tile => {
            const dist = this.scene.hexGrid.hexDistance(tile, this.scene.player.currentTile);
            if (dist < minDistance) {
                minDistance = dist;
                target = tile;
            }
        });

        this.moveTo(target);

        // 4. Check again after moving: if now adjacent, attack!
        const newDist = this.scene.hexGrid.hexDistance(target, this.scene.player.currentTile);
        if (newDist === 1) {
            // Small delay so move finishes before attack starts
            this.scene.time.delayedCall(300, () => {
                this.attackPlayer(this.scene.player);
            });
        }
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

        // DO NOT call endPlayerTurn here
    }

    takeDamage(amount) {
        if (!this.isAlive) return;

        this.health -= amount;

        console.log(this.type + " took " + amount);

        // 🔴 FLASH RED EFFECT
        this.sprite.setTint(0xff0000);

        this.scene.time.delayedCall(150, () => {
            if (this.sprite) {
                this.sprite.clearTint();
            }
        });

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