export default class Unit {
  constructor(scene, tile, texture) {
    this.scene = scene;
    this.tile = tile;

    // link unit to tile
    tile.setOccupant(this);
  }
}