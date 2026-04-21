export default class HexGrid {
  constructor(scene, config) {
    this.scene = scene;

    this.rows = config.rows;
    this.cols = config.cols;
    this.hexWidth = config.hexWidth;
    this.hexHeight = config.hexHeight;
    this.texture = config.texture;

    this.offsetX = config.offsetX || 0;
    this.offsetY = config.offsetY || 0;

    this.grid = [];
  }

  generate() {
    for (let col = 0; col < this.cols; col++) {
      this.grid[col] = [];

      for (let row = 0; row < this.rows; row++) {

        const x = col * this.hexWidth * 0.75 + this.offsetX;
        const y = row * this.hexHeight + (col % 2) * (this.hexHeight / 2) + this.offsetY;

        const tile = new HexTile(this.scene, x, y, this.texture, col, row);
        this.grid[col][row] = tile;

        this.grid[col][row] = tile;
      }
    }
  }
}