import HexGrid from '../HexGrid.js';
import PlayerUnit from '../PlayerUnit.js';
import EnemyUnit from '../EnemyUnit.js';
import MathSystem from '../MathSystem.js';
import { LEVELS } from '../LevelData.js';

export class Level extends Phaser.Scene {

  constructor() {
    super('Level');
  }

  init(data) {
    this.levelKey = data.levelKey; // 👈 IMPORTANT
  }
  //----------------------------------------------------------------------------------------------------------------------------------------
  preload() {
    this.load.image('background', '/assets/images/Background.png');
    this.load.image('hex', 'assets/tiles/SpaceHexTile.png');
    this.load.image('playerShip', 'assets/images/playerShip.png');
    this.load.image('enemyShip', 'assets/images/enemyship.png');
    this.load.image('planet', 'assets/images/planet.png');
    this.load.image('terrain', 'assets/images/terrain.png');
    this.load.audio('bgMusic', ['assets/audio/levelTheme.mp3']);
    this.load.audio('attackSound', ['assets/audio/attackSound.mp3']);
  }

  create() {
    this.background = this.add.tileSprite(640, 360, 1920, 1080, 'background');
    //-------------------------------------------------------------------------------------------------------------------------------------------
    this.sound.stopAll();

    this.music = this.sound.add('bgMusic', {
      volume: 0.5,
      loop: true
    });

    this.attackSound = this.sound.add('attackSound', {
      volume: 0.6
    });

    this.music.play();
    //---------------------------------------------------------------------------------------------------------------------------------------------

    this.combatUI = null;
    this.answerInput = null;
    this.submitButton = null;
    this.selectedUnit = null;
    this.currentTurn = 'player';
    this.playerPowerUp = null;
    //------------------------------------------------------------------------------------------------------------------------------------------------
    this.mathSystem = new MathSystem();
    this.questionText = this.add.text(100, 100, '', {
      fontSize: '32px',
      fill: '#fff'
    });
    //-------------------------------------------------------------------------------------------------------------------------------
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
    //---------------------------------------------------------------------------------------------------------------------------------------
    const level = LEVELS[this.levelKey];
    if (!level) {
      console.error("Level not found:", this.levelKey);
      return;
    }

    this.add.text(640, 40, level.name, {
      fontSize: '30px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(200);

    const quitBtn = this.add.text(30, 30, '← Quit', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0, 0).setInteractive().setDepth(250);

    quitBtn.on('pointerdown', () => {
      this.sound.stopAll();
      this.scene.stop('Level');
      this.scene.start('LevelSelect');
    });

    this.mathSystem.allowNegatives = level.rules.allowNegatives;
    this.mathSystem.maxNumber = level.rules.maxNumber;

    level.terrain.forEach(t => {
      const tile = this.hexGrid.grid[t.col][t.row];

      tile.blocked = true;
      tile.terrain = true;

      const sprite = this.add.image(tile.x, tile.y, 'terrain');
      sprite.setDisplaySize(55, 55);
      sprite.setDepth(1);

      tile.terrainSprite = sprite;
    });
    //-------------------------------------------------------------------------------------------------------------------------------
    level.planets.forEach(p => {
      const tile = this.hexGrid.grid[p.col][p.row];

      tile.blocked = true;
      tile.planet = true;

      const sprite = this.add.image(tile.x, tile.y, 'planet');
      sprite.setDisplaySize(55, 55);
      sprite.setDepth(1);

      tile.planetSprite = sprite;
    });
    //----------------------------------------------------------------------------------------------------------------------------------
    const playerTile = this.hexGrid.grid[level.playerStart.col][level.playerStart.row];
    this.player = new PlayerUnit(this, playerTile, 'playerShip');
    //------------------------------------------------------------------------------------------------------------------------------------

    // enemies
    this.enemies = level.enemies.map(e => {
      const tile = this.hexGrid.grid[e.col][e.row];
      return new EnemyUnit(this, tile, 'enemyShip');
    });
    //------------------------------------------------------------------------------------------------------------------------------------

    this.createEnergyUI();

    this.enemies.forEach(enemy => {
      enemy.sprite.setInteractive();

      enemy.sprite.on('pointerdown', () => {
        if (this.currentTurn !== 'player') return;
        if (!this.selectedUnit) return;
        if (!enemy.isAlive) return;

        const distance = this.hexGrid.hexDistance(
          this.selectedUnit.currentTile,
          enemy.currentTile
        );

        if (distance <= 3) {
          this.selectedUnit.clearSelection();
          this.handleCombat(enemy);
          this.selectedUnit = null;
        } else {
          console.log("Enemy too far away");
        }
      });
    });
    //----------------------------------------------------------------------------------------------------------------------------------------
    this.player.sprite.setInteractive();

    this.player.sprite.on('pointerdown', () => {
      if (this.currentTurn !== 'player') return;
      if (this.currentTurn === 'combat') return;

      this.selectedUnit = this.player;
      this.player.select();
    });

    this.hexGrid.tiles.forEach(tile => {

      tile.sprite.setInteractive();

      tile.sprite.on('pointerdown', () => {

        if (this.currentTurn !== 'player') return;
        if (this.currentTurn === 'combat') return;

        const unit = this.selectedUnit;
        if (!unit || !unit.reachableTiles) return;

        if (
          tile.planet &&
          unit.reachableTiles.includes(tile)
        ) {
          unit.clearSelection();
          this.handlePlanetChallenge();
          this.selectedUnit = null;
          return;
        }

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

        if (unit.reachableTiles.includes(tile) && !tile.occupant && !tile.blocked) {
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
    const energyStats = this.player.getEnergyStats();

    this.showCombatUI(question, (playerAnswer) => {
      const result = this.mathSystem.checkAnswer(playerAnswer);

      if (result.correct) {
        let damage = (10 * result.damageMultiplier) * energyStats.attackMultiplier;

        if (this.playerPowerUp === 'Attack Boost') {
          damage += 10;
          this.playerPowerUp = null;
        }

        this.attackSound.play(); // 🔊 PLAY SOUND HERE
        enemy.takeDamage(damage);
      } else {
        const baseDamage = 10;
        const reducedDamage = Math.max(1, baseDamage - (baseDamage * energyStats.damageReduction));
        this.attackSound.play();
        this.player.takeDamage(reducedDamage);
      }

      if (this.checkGameState()) return;
      this.endPlayerTurn();
    });
  }

  handlePlanetChallenge() {
    const question = this.mathSystem.generateQuestion();

    this.showCombatUI(question, (playerAnswer) => {
      const result = this.mathSystem.checkAnswer(playerAnswer);

      if (result.correct) {
        this.playerPowerUp = 'Attack Boost';

        const powerText = this.add.text(640, 150, 'Power-Up Earned: Attack Boost!', {
          fontSize: '28px',
          color: '#00ff99',
          backgroundColor: '#000000',
          padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5).setDepth(150);

        this.time.delayedCall(1500, () => {
          powerText.destroy();
        });

        console.log('Player earned Attack Boost');
      } else {
        const wrongText = this.add.text(640, 150, 'Wrong answer! No power-up earned.', {
          fontSize: '28px',
          color: '#ff4444',
          backgroundColor: '#000000',
          padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5).setDepth(150);

        this.time.delayedCall(1500, () => {
          wrongText.destroy();
        });
      }

      this.endPlayerTurn();
    });
  }

  gameOver() {
    this.currentTurn = 'none';
    this.input.enabled = true;

    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.75).setDepth(100);

    this.add.text(640, 300, 'GAME OVER', {
      fontSize: '64px',
      color: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(101);

    this.add.text(640, 370, 'Your ship was destroyed', {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5).setDepth(101);

    const restartBtn = this.add.text(640, 460, 'Restart Level', {
      fontSize: '28px',
      backgroundColor: '#ffffff',
      color: '#000000',
      padding: { left: 15, right: 15, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive().setDepth(102);

    restartBtn.on('pointerdown', () => {
      this.music.stop();
      this.scene.restart();
    });

        const levelSelectBtn = this.add.text(640, 520, 'Back to Level Select', {
      fontSize: '28px',
      backgroundColor: '#ffffff',
      color: '#000000',
      padding: { left: 15, right: 15, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive().setDepth(102);

    levelSelectBtn.on('pointerdown', () => {
      this.sound.stopAll();
      this.scene.stop('Level');
      this.scene.start('LevelSelect');
    });
  }
 

  levelComplete() {
    this.currentTurn = 'none';
    this.input.enabled = true;

    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.75).setDepth(100);

    this.add.text(640, 300, 'MISSION COMPLETE', {
      fontSize: '60px',
      color: '#00ff99',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(101);

    this.add.text(640, 370, 'Enemy defeated!', {
      fontSize: '30px',
      color: '#ffffff'
    }).setOrigin(0.5).setDepth(101);

    const nextBtn = this.add.text(640, 460, 'Back to Level Select', {
      fontSize: '28px',
      backgroundColor: '#ffffff',
      color: '#000000',
      padding: { left: 15, right: 15, top: 8, bottom: 8 }
    }).setOrigin(0.5).setInteractive().setDepth(102);

    nextBtn.on('pointerdown', () => {
      this.sound.stopAll();
      this.scene.stop('Level');
      this.scene.start('LevelSelect');
    });
  }

  showCombatUI(question, callback) {
    this.currentTurn = 'combat';

    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.6).setDepth(100);

    const panel = this.add.rectangle(640, 360, 500, 250, 0x222222, 1).setDepth(101);
    panel.setStrokeStyle(2, 0xffffff);

    const text = this.add.text(640, 290, question, {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5).setDepth(102);

    const inputBox = this.add.rectangle(640, 360, 200, 40, 0xffffff, 1).setDepth(101);

    const inputText = this.add.text(640, 360, '', {
      fontSize: '24px',
      color: '#000'
    }).setOrigin(0.5).setDepth(102);

    let answer = '';

    const button = this.add.text(640, 420, 'SUBMIT', {
      fontSize: '24px',
      backgroundColor: '#ffffff',
      color: '#000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0.5).setInteractive().setDepth(102);

    let keyListener;

    const submit = () => {
      overlay.destroy();
      panel.destroy();
      text.destroy();
      inputBox.destroy();
      inputText.destroy();
      button.destroy();

      this.input.keyboard.off('keydown', keyListener);

      callback(answer);
    };

    keyListener = (event) => {
      if (event.key === 'Backspace') {
        answer = answer.slice(0, -1);
      }
      else if (event.key === 'Enter') {
        submit();
      }
      else if (!isNaN(event.key) || event.key === '-') {
        // only allow '-' at the start
        if (event.key === '-' && answer.length > 0) return;

        answer += event.key;
      }

      inputText.setText(answer);
    };

    this.input.keyboard.on('keydown', keyListener);

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

  createEnergyUI() {
    const style = { fontSize: '18px', fill: '#fff', backgroundColor: '#333', padding: 5 };

    const panel = this.add.rectangle(1060, 0, 220, 220, 0x000000, 0.7).setOrigin(0);
    panel.setStrokeStyle(2, 0xffffff);

    this.energyText = this.add.text(1090, 30, `Energy: ${this.player.energyPoints}`, { fontSize: '20px', fill: '#00ff00' });
    const atkBtn = this.add.text(1090, 70, '[+] Add Attack', style).setInteractive();
    const defBtn = this.add.text(1090, 120, '[+] Add Defense', style).setInteractive();
    const resetBtn = this.add.text(1090, 170, '[Reset Points]', { fontSize: '16px', fill: '#ff0000' }).setInteractive();

    atkBtn.on('pointerdown', () => {
      if (this.player.energyPoints > 0) {
        this.player.attackEnergy++;
        this.player.energyPoints--;
        this.updateEnergyDisplay();
      }
    });

    defBtn.on('pointerdown', () => {
      if (this.player.energyPoints > 0) {
        this.player.defenseEnergy++;
        this.player.energyPoints--;
        this.updateEnergyDisplay();
      }
    });

    resetBtn.on('pointerdown', () => {
      this.player.energyPoints += (this.player.attackEnergy + this.player.defenseEnergy);
      this.player.attackEnergy = 0;
      this.player.defenseEnergy = 0;
      this.updateEnergyDisplay();
    });

    this.updateEnergyDisplay();
  }

  updateEnergyDisplay() {
    this.energyText.setText(`Energy: ${this.player.energyPoints}`);
  }

  checkGameState() {
    if (!this.player.isAlive) {
      this.gameOver();
      return true;
    }

    const aliveEnemies = this.enemies.some(e => e.isAlive);
    if (!aliveEnemies) {
      this.levelComplete();
      return true;
    }

    return false;
  }

  endPlayerTurn() {
    if (!this.player.isAlive) {
      this.checkGameState();
      return;
    }

    this.currentTurn = 'enemy';

    this.time.delayedCall(300, () => {
      this.enemies.forEach(enemy => {
        if (enemy.isAlive) enemy.takeTurn();
      });

      // IMPORTANT: check AFTER enemy turn
      this.time.delayedCall(50, () => {
        this.checkGameState();

        if (this.player.isAlive) {
          this.currentTurn = 'player';
        }
      });
    });
  }
}