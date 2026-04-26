export default class Unit {
  constructor(scene, tile, texture) {
    this.scene = scene;
    this.texture = texture;

    // store tile
    this.currentTile = tile;
    this.tile = tile;

    // ✅ CREATE IMAGE HERE
    this.sprite = scene.add.image(tile.x, tile.y, texture);

    // optional but recommended
    this.sprite.setDisplaySize(60, 60);
    this.sprite.setDepth(1);

    // link unit to tile
    tile.setOccupant(this);
    this.maxHealth = 100;
    this.health = 100;

    this.healthBarBg = null;
    this.healthBarFill = null;
  }

  moveTo(tile) {
    if (this.currentTile) {
      this.currentTile.removeOccupant();
    }

    this.currentTile = tile;
    this.tile = tile;
    tile.setOccupant(this);

    this.scene.tweens.add({
      targets: this.sprite,
      x: tile.x,
      y: tile.y,
      duration: 200
    });
    this.updateHealthBar();
  }

  createHealthBar() {
    const x = this.sprite.x;
    const y = this.sprite.y - 40;

    // background (red)
    this.healthBarBg = this.scene.add.rectangle(x, y, 40, 6, 0xff0000);
    this.healthBarBg.setDepth(10);

    // fill (green)
    this.healthBarFill = this.scene.add.rectangle(x, y, 40, 6, 0x00ff00);
    this.healthBarFill.setDepth(11);
  }

  updateHealthBar() {
    if (!this.healthBarBg || !this.healthBarFill) return;

    const percent = this.health / this.maxHealth;

    this.healthBarFill.width = 40 * percent;

    const x = this.sprite.x;
    const y = this.sprite.y - 40;

    this.healthBarBg.x = x;
    this.healthBarBg.y = y;

    this.healthBarFill.x = x - (40 * (1 - percent)) / 2;
    this.healthBarFill.y = y;
  }
}