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

    // 🧠 TILE TYPES (NEW)
    this.blocked = false;        // stops movement
    this.planet = false;         // planet tile
    this.planetSprite = null;

    this.terrain = false;        // terrain tile
    this.terrainSprite = null;

    // 🧠 CREATE SPRITE
    this.sprite = scene.add.image(x, y, texture);
    this.sprite.setDisplaySize(96, 84);

    // 🧠 MAKE INTERACTIVE (ONLY ON SPRITE)
    this.sprite.setInteractive({ useHandCursor: true });

    // hover effects
    this.sprite.on('pointerover', () => {
      this.sprite.setTint(0xaaaaaa);
    });

    this.sprite.on('pointerout', () => {
      this.sprite.clearTint();
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
    this.occupant = null; // ✅ ONLY remove unit (DO NOT touch terrain/planet)
  }

  highlight() {
    this.sprite.setTint(0x00ff00);
  }

  clearHighlight() {
    this.sprite.clearTint();
  }
}