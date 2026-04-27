export const LEVELS = {
  level1: {
    name: "Level 1",
    playerStart: { col: 0, row: 3 },

    enemies: [
      { col: 12, row: 3 }
    ],

    planets: [ ],

    terrain: [],

    rules: {
      allowNegatives: false,
      maxNumber: 10
    }
  },

  level2: {
    name: "Level 2",
    playerStart: { col: 0, row: 3},

    enemies: [
      { col: 12, row: 2 },
      { col: 12, row: 4 }
    ],

    planets: [
      {col: 3, row: 3}
    ],

    terrain: [
    ],

    rules: {
      allowNegatives: true,
      maxNumber: 20
    }
  },

  level3: {
    name: "Level 3",
    playerStart: { col: 0, row: 3 },

    enemies: [
      { col: 12, row: 2 },
      { col: 12, row: 4 },
      
    ],

    planets: [{col: 3, row: 3}],
    terrain: [
        {col: 6, row: 0},
        {col: 6, row: 1},
        {col: 6, row: 5},
        {col: 6, row: 6}
    ],

    rules: {
      allowNegatives: true,
      maxNumber: 50
    }
  },

  level4: {
    name: "Level 4",
    playerStart: { col: 0, row: 6 },

    enemies: [
      { col: 5, row: 5 },
      { col: 8, row: 4 },
      { col: 10, row: 2 }
    ],

    planets: [],
    terrain: [],

    rules: {
      allowNegatives: true,
      maxNumber: 50
    }
  }

};