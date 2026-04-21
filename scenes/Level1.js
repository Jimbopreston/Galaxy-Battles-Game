import HexGrid from '../HexGrid.js';

this.hexGrid = new HexGrid(this, {
  rows: 10,
  cols: 10,
  hexWidth: 64,
  hexHeight: 64,
  texture: 'hex',
  offsetX: 100,
  offsetY: 100
});

this.hexGrid.generate();