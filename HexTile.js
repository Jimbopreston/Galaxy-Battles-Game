export default class HexTile {
  constructor(scene, x, y, texture, col, row) {

    this.scene = scene;
    this.col = col;
    this.row = row;

    this.x = x; 
    this.y = y; 

    this.isVisible = true;
    this.isDiscovered = false;
    this.occupant = null;

    // 🧠 CREATE SPRITE
    this.sprite = scene.add.image(x, y, texture);
    this.sprite.setDisplaySize(96, 84);

    // 🧠 MAKE INTERACTIVE (ONLY ON SPRITE)
    this.sprite.setInteractive({ useHandCursor: true });

    // hover effects
    this.sprite.on('pointerover', () => {
      this.sprite.setTint(0xaaaaaa);
    });

  }

  reveal() {
    this.sprite.setAlpha(1);
  }

  hide() {
    this.sprite.setAlpha(0.3);
  }

  setOccupant(unit) {
    this.occupant = unit;
  }

  removeOccupant() {
    this.occupant = null;
  }

  highlight() {
    this.sprite.setTint(0x00ff00);
  }

  clearHighlight() {
    this.sprite.clearTint();
  }
}