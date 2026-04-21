export default class HexTile {
  constructor(scene, x, y, texture, col, row) {
    this.scene = scene;

    this.col = col;
    this.row = row;

    this.isVisible = true;
    this.isDiscovered = false;

    this.occupant = null;

    this.sprite = scene.add.image(x, y, texture);

    this.setInteractive({ useHandCursor: true });

    this.on('pointerover', () => {
        this.setTint(0xaaaaaa); 
    }); 

    this.on('pointerout', () => {
        this.clearTint();
    });

    this.on('pointerdown', () => {
        console.log(`Clicked tile at ${this.q}, ${this.r}`);
        this.setTint(0x00ff00);
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