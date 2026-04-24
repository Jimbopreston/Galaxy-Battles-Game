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
  }
}