import HexTile from './HexTile.js';

export default class HexGrid {
  constructor(scene, config) {
    this.scene = scene;

    this.rows = config.rows;
    this.cols = config.cols;
    this.hexWidth = config.hexWidth;
    this.hexHeight = config.hexHeight;
    this.texture = config.texture;

    this.offsetX = this.scene.scale.width / 6;
    this.offsetY = 100;

    this.grid = [];
    this.tiles = []; // ✅ ADD THIS (IMPORTANT)
  }

  generate() {
    const w = 96;
    const h = 84;
    const xOffset = w * 0.75;
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

        // ✅ IMPORTANT: store coords for distance system
        tile.q = col;
        tile.r = row;

        this.grid[col][row] = tile;
        this.tiles.push(tile); // ✅ FLAT LIST FOR RANGE + INPUT
      }
    }
  }

  getNeighbors(col, row) {
    const even = (col % 2 === 0);

    const directions = even
      ? [[1,0],[-1,0],[0,1],[0,-1],[-1,-1],[1,-1]]
      : [[1,0],[-1,0],[0,1],[0,-1],[-1,1],[1,1]];

    const neighbors = [];

    for (let [dc, dr] of directions) {
      const c = col + dc;
      const r = row + dr;

      if (this.grid[c] && this.grid[c][r]) {
        neighbors.push(this.grid[c][r]);
      }
    }

    return neighbors;
  }

  hexDistance(a, b) {
    return (Math.abs(a.q - b.q)
      + Math.abs(a.q + a.r - b.q - b.r)
      + Math.abs(a.r - b.r)) / 2;
  }

  getTilesInRange(startTile, range) {
    let result = [];

    this.tiles.forEach(tile => {
      let dist = this.hexDistance(startTile, tile);

      if (dist <= range) {
        result.push(tile);
      }
    });

    return result;
  }
}