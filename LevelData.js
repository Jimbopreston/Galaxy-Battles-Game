export const LEVELS = {
  level1: {
    name: "Level 1",
    playerStart: { col: 0, row: 3 },

    enemies: [
      { col: 12, row: 3 }
    ],

    planets: [],

    terrain: [],

    rules: {
      allowNegatives: false,
      maxNumber: 10
    }
  },

  level2: {
    name: "Level 2",
    playerStart: { col: 1, row: 1 },

    enemies: [
      { col: 4, row: 4 },
      { col: 7, row: 2 }
    ],

    planets: [
      { col: 9, row: 5 }
    ],

    terrain: [
      { col: 3, row: 3 },
      { col: 6, row: 6 }
    ],

    rules: {
      allowNegatives: true,
      maxNumber: 20
    }
  },

  level3: {
    name: "Level 3",
    playerStart: { col: 0, row: 6 },

    enemies: [
      { col: 5, row: 5 },
      { col: 8, row: 4 },
      
    ],

    planets: [],
    terrain: [],

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