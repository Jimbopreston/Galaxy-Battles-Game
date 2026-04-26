import HexGrid from '../HexGrid.js';
import PlayerUnit from '../PlayerUnit.js';
import EnemyUnit from '../EnemyUnit.js';
import MathSystem from '../MathSystem.js';

export class Level extends Phaser.Scene {

  constructor() {
    super('Level');
  }

  endPlayerTurn() {
    if (!this.player.isAlive) return;

    this.currentTurn = 'enemy';

    this.time.delayedCall(300, () => {
      this.enemies.forEach(enemy => {
        if (enemy.isAlive) enemy.takeTurn();
      });

      if (this.player.isAlive) {
        this.currentTurn = 'player';
      }
    });
  }

  preload() {
    this.load.image('background', '/assets/images/Background.png');
    this.load.image('hex', 'assets/tiles/SpaceHexTile.png');
    this.load.image('playerShip', 'assets/images/playerShip.png');
    this.load.image('enemyShip', 'assets/images/enemyship.png');
  }

  create() {
    this.background = this.add.tileSprite(640, 360, 1920, 1080, 'background');

    this.combatUI = null;
    this.answerInput = null;
    this.submitButton = null;

    this.selectedUnit = null;
    this.currentTurn = 'player';

    this.mathSystem = new MathSystem();

    this.questionText = this.add.text(100, 100, '', {
      fontSize: '32px',
      fill: '#fff'
    });

    this.hexGrid = new HexGrid(this, {
      rows: 7,
      cols: 13,
      hexWidth: 64,
      hexHeight: 64,
      texture: 'hex',
      offsetX: 100,
      offsetY: 100
    });

    this.hexGrid.generate();

    const playerTile = this.hexGrid.grid[2][2];
    const enemyTile = this.hexGrid.grid[5][5];

    this.player = new PlayerUnit(this, playerTile, 'playerShip');

    this.enemies = [];
    this.enemies.push(new EnemyUnit(this, enemyTile, 'enemyShip'));

    // 🧍 PLAYER SELECT
    this.player.sprite.setInteractive();

    this.player.sprite.on('pointerdown', () => {
      if (this.currentTurn !== 'player') return;
      if (this.currentTurn === 'combat') return;

      this.selectedUnit = this.player;
      this.player.select();
    });

    // 🟩 TILE CLICK
    this.hexGrid.tiles.forEach(tile => {

      tile.sprite.setInteractive();

      tile.sprite.on('pointerdown', () => {

        if (this.currentTurn !== 'player') return;
        if (this.currentTurn === 'combat') return;

        const unit = this.selectedUnit;
        if (!unit || !unit.reachableTiles) return;

        // ⚔️ ATTACK
        if (
          tile.occupant &&
          tile.occupant.type === 'enemy' &&
          unit.reachableTiles.includes(tile)
        ) {
          unit.clearSelection();
          this.handleCombat(tile.occupant);
          this.selectedUnit = null;
          return;
        }

        // 🚶 MOVE
        if (unit.reachableTiles.includes(tile) && !tile.occupant) {
          unit.clearSelection();
          unit.moveTo(tile);
          this.selectedUnit = null;
          this.endPlayerTurn();
        }
      });
    });
  }

  handleCombat(enemy) {
    if (!this.player.isAlive || !enemy.isAlive) return;

    const question = this.mathSystem.generateQuestion();

    this.showCombatUI(question, (playerAnswer) => {

      const result = this.mathSystem.checkAnswer(playerAnswer);

      if (result.correct) {
        enemy.takeDamage(10 * result.damageMultiplier);
      } else {
        this.player.takeDamage(5);
      }

      if (!enemy.isAlive) return this.endPlayerTurn();
      if (!this.player.isAlive) return this.gameOver();

      this.endPlayerTurn();
    });
  }

  gameOver() {
    console.log("GAME OVER");

    this.currentTurn = 'none';
    this.input.enabled = false;
  }

  showCombatUI(question, callback) {

    // lock gameplay
    this.currentTurn = 'combat';

    // dark background overlay
    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.6);

    // panel box
    const panel = this.add.rectangle(640, 360, 500, 250, 0x222222, 1);
    panel.setStrokeStyle(2, 0xffffff);

    // question text
    const text = this.add.text(640, 290, question, {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // input box (fake UI input)
    const inputBox = this.add.rectangle(640, 360, 200, 40, 0xffffff, 1);

    const inputText = this.add.text(640, 360, '', {
      fontSize: '24px',
      color: '#000'
    }).setOrigin(0.5);

    // capture keyboard input
    let answer = '';

    const keyListener = this.input.keyboard.on('keydown', (event) => {

      if (event.key === 'Backspace') {
        answer = answer.slice(0, -1);
      }
      else if (event.key === 'Enter') {
        submit();
      }
      else if (!isNaN(event.key)) {
        answer += event.key;
      }

      inputText.setText(answer);
    });

    // submit button
    const button = this.add.text(640, 420, 'SUBMIT', {
      fontSize: '24px',
      backgroundColor: '#ffffff',
      color: '#000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0.5).setInteractive();

    const submit = () => {

      // cleanup UI
      overlay.destroy();
      panel.destroy();
      text.destroy();
      inputBox.destroy();
      inputText.destroy();
      button.destroy();

      this.input.keyboard.off('keydown');
      keyListener.destroy();

      // return answer
      callback(answer);
    };

    button.on('pointerdown', submit);
  }

  update() {
    if (this.player) {
        this.player.updateHealthBar();
    }

    this.enemies.forEach(e => {
        if (e.isAlive) e.updateHealthBar();
    });
  }
}