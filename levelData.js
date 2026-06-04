const RAW_LEVEL_DATA = [
  {
    themeID: 1,
    group: 6,
    gold: 800,
    enemyInterval: 1,
    groupInterval: 1,
    levelName: 'level 1',
    blood: 10,
    monsterGroup: [
      { index: 1, team: [{ name: 'L11', count: 5, blood: 5.0, speed: 180 }] },
      { index: 2, team: [{ name: 'L21', count: 5, blood: 10.0, speed: 180 }] },
      { index: 3, team: [{ name: 'L21', count: 5, blood: 20.0, speed: 180 }, { name: 'L31', count: 10, blood: 15.0, speed: 180 }] },
      { index: 4, team: [{ name: 'L11', count: 5, blood: 20.0, speed: 180 }] },
      { index: 5, team: [{ name: 'L31', count: 5, blood: 40.0, speed: 180 }, { name: 'L11', count: 5, blood: 40.0, speed: 180 }, { name: 'L21', count: 5, blood: 45.0, speed: 180 }] },
      { index: 6, team: [{ name: 'L31', count: 5, blood: 50.0, speed: 180 }, { name: 'L11', count: 5, blood: 50.0, speed: 180 }, { name: 'L21', count: 5, blood: 50.0, speed: 180 }] }
    ]
  },
  {
    themeID: 1,
    group: 10,
    gold: 750,
    enemyInterval: 1,
    groupInterval: 3,
    levelName: 'level 2',
    bloodScale: 0.3,
    blood: 10,
    monsterGroup: [
      { index: 1, team: [{ name: 'F11', count: 2, blood: 10.0, speed: 180 }, { name: 'L31', count: 8, blood: 10.0, speed: 180 }] },
      { index: 2, team: [{ name: 'F11', count: 4, blood: 10.0, speed: 180 }, { name: 'L21', count: 5, blood: 10.0, speed: 180 }] },
      { index: 3, team: [{ name: 'F11', count: 5, blood: 15.0, speed: 180 }, { name: 'F21', count: 5, blood: 15.0, speed: 180 }] },
      { index: 4, team: [{ name: 'L11', count: 8, blood: 20.0, speed: 180 }, { name: 'L31', count: 2, blood: 20.0, speed: 180 }] },
      { index: 5, team: [{ name: 'F11', count: 6, blood: 33.15, speed: 180 }, { name: 'L11', count: 2, blood: 47.36, speed: 180 }, { name: 'P11', count: 2, blood: 56.84, speed: 180 }] },
      { index: 6, team: [{ name: 'F11', count: 2, blood: 44.73, speed: 180 }, { name: 'L31', count: 8, blood: 63.9, speed: 180 }] },
      { index: 7, team: [{ name: 'L11', count: 8, blood: 60.44, speed: 180 }, { name: 'F21', count: 2, blood: 45.31, speed: 180 }] },
      { index: 8, team: [{ name: 'L31', count: 4, blood: 96.98, speed: 180 }, { name: 'P11', count: 6, blood: 116.38, speed: 180 }] },
      { index: 9, team: [{ name: 'F11', count: 5, blood: 79.47, speed: 180 }, { name: 'F21', count: 5, blood: 79.47, speed: 180 }] },
      { index: 10, team: [{ name: 'L11', count: 5, blood: 130.06, speed: 180 }, { name: 'F11', count: 5, blood: 91.04, speed: 180 }, { name: 'L21', count: 5, blood: 130.06, speed: 180 }] }
    ]
  },
  {
    themeID: 1,
    group: 15,
    gold: 900,
    enemyInterval: 1,
    groupInterval: 3,
    levelName: 'level 3',
    bloodScale: 0.3,
    blood: 10,
    monsterGroup: [
      { index: 1, team: [{ name: 'L11', count: 5, blood: 5.0, speed: 180 }, { name: 'L21', count: 5, blood: 5.0, speed: 180 }] },
      { index: 2, team: [{ name: 'L21', count: 5, blood: 10.0, speed: 180 }, { name: 'L31', count: 5, blood: 10.0, speed: 180 }] },
      { index: 3, team: [{ name: 'L11', count: 5, blood: 15.0, speed: 180 }, { name: 'L31', count: 5, blood: 15.0, speed: 180 }] },
      { index: 4, team: [{ name: 'L21', count: 5, blood: 20.0, speed: 180 }, { name: 'L11', count: 5, blood: 20.0, speed: 180 }] },
      { index: 5, team: [{ name: 'P11', count: 10, blood: 50.0, speed: 180 }] },
      { index: 6, team: [{ name: 'P11', count: 2, blood: 80.0, speed: 180 }, { name: 'L11', count: 8, blood: 60.0, speed: 180 }] },
      { index: 7, team: [{ name: 'L31', count: 4, blood: 80.0, speed: 180 }, { name: 'P11', count: 6, blood: 100.0, speed: 180 }] },
      { index: 8, team: [{ name: 'L21', count: 4, blood: 100.0, speed: 180 }, { name: 'L31', count: 6, blood: 100.0, speed: 180 }] },
      { index: 9, team: [{ name: 'L11', count: 2, blood: 120.0, speed: 180 }, { name: 'P11', count: 2, blood: 140.0, speed: 180 }, { name: 'L21', count: 6, blood: 120.0, speed: 180 }] },
      { index: 10, team: [{ name: 'L21', count: 5, blood: 150.0, speed: 180 }, { name: 'L31', count: 5, blood: 150.0, speed: 180 }, { name: 'P11', count: 2, blood: 200.0, speed: 180 }] },
      { index: 11, team: [{ name: 'P11', count: 2, blood: 220.0, speed: 180 }, { name: 'L31', count: 8, blood: 170.0, speed: 180 }] },
      { index: 12, team: [{ name: 'L21', count: 4, blood: 200.0, speed: 180 }, { name: 'L11', count: 6, blood: 200.0, speed: 180 }] },
      { index: 13, team: [{ name: 'P11', count: 6, blood: 280.0, speed: 180 }, { name: 'L21', count: 4, blood: 240.0, speed: 180 }] },
      { index: 14, team: [{ name: 'L11', count: 8, blood: 280.0, speed: 180 }, { name: 'P11', count: 2, blood: 340.0, speed: 180 }] },
      { index: 15, team: [{ name: 'L21', count: 5, blood: 300.0, speed: 180 }, { name: 'P11', count: 8, blood: 350.0, speed: 180 }] }
    ]
  }
]

export const LEVEL_DATA = RAW_LEVEL_DATA.map((level, index) => ({
  ...level,
  levelIndex: index,
  mapIndex: Math.min(index + 1, 3),
  maxGroup: level.group ?? level.monsterGroup.length
}))

export function getLevelConfig (levelIndex = 0) {
  const safeIndex = Math.max(0, Math.min(levelIndex, LEVEL_DATA.length - 1))
  return LEVEL_DATA[safeIndex]
}

export function getLevelCount () {
  return LEVEL_DATA.length
}
