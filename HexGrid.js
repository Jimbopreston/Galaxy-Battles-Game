import HexTile from './HexTile.js';

export default class HexGrid {
  constructor(scene, config) {
    this.scene = scene;

    this.rows = config.rows;
    this.cols = config.cols;
    this.hexWidth = config.hexWidth;
    this.hexHeight = config.hexHeight;
    this.texture = config.texture;
    this.offsetX = this.scene.scale.width / 4;
    this.offsetY = 100;
    this.grid = [];
  }

  generate() {
  const w = this.hexWidth;
  const h = this.hexHeight;

  const xOffset = w * 0.75;   // correct horizontal spacing
  const yOffset = h;

  for (let col = 0; col < this.cols; col++) {
    this.grid[col] = [];

    for (let row = 0; row < this.rows; row++) {

      const x = col * xOffset + this.offsetX;
      const y = row * yOffset + (col % 2) * (h / 2) + this.offsetY;

      const tile = new HexTile(
        this.scene,
        x,
        y,
        this.texture,
        col,
        row
      );

      this.grid[col][row] = tile;
    }
  }
}
}