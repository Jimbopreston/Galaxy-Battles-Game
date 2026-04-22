export default class HexTile {
  constructor(scene, x, y, texture, col, row) {
    this.scene = scene;
    this.col = col;
    this.row = row;

    this.isVisible = true;
    this.isDiscovered = false;
    this.occupant = null;

    this.sprite = scene.add.image(x, y, texture);

    // make interactive ON THE SPRITE
    this.sprite.setInteractive({ useHandCursor: true });

    this.sprite.on('pointerover', () => {
      this.sprite.setTint(0xaaaaaa);
    });

    this.sprite.on('pointerout', () => {
      this.sprite.clearTint();
    });

    this.sprite.on('pointerdown', () => {
      console.log(`Clicked tile at ${this.col}, ${this.row}`);
      this.sprite.setTint(0x00ff00);
    });
  }

  reveal() {
    this.isVisible = true;
    this.sprite.setAlpha(1);
  }

  hide() {
    this.isVisible = false;
    this.sprite.setAlpha(0.3);
  }

  setOccupant(ship) {
    this.occupant = ship;
  }

  removeOccupant() {
    this.occupant = null;
  }
}