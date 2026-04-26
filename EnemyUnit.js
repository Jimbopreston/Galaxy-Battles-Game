import Unit from './Unit.js';

export default class EnemyUnit extends Unit {
    constructor(scene, tile, texture) {
        super(scene, tile, texture);
        this.createHealthBar();
        this.type = 'enemy';
        this.health = 100;
        this.moveRange = 3;
        this.reachableTiles = [];
        this.isAlive = true;
    }

    takeTurn() {
        if (!this.isAlive || !this.scene.player.isAlive) return;

        console.log("Enemy turn");

        const options = this.getMoveOptions().filter(t => !t.occupant);

        if (options.length === 0) return;

        const target = options[Math.floor(Math.random() * options.length)];

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