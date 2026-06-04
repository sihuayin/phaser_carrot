import Phaser from 'phaser'
import { Monster } from './Monster.js'
import { TowerBase } from './TowerBase.js'
import { TowerPanel } from './TowerPanel.js'
import { LEVEL_DATA, getLevelConfig } from './levelData.js'

export class gamePlayScene extends Phaser.Scene {
  constructor () {
    super('game_play')

    this.ZOrderEnum = {}
    this.tiledMapRectMapEnemu = {}
    this.tiledMapRectArray = []
    this.tiledMapRectArrayMap = []
    this.roadPointArray = []

    this.touchWarningNode = null
    this.touchWarningTween = null
    this.towerPanel = null

    this.levelIndex = 0
    this.levelConfig = getLevelConfig(0)
    this.selectedMapIndex = 1

    this.baseHealthValue = 10
    this.healthValue = 10
    this.healthText = null
    this.startGold = 800
    this.goldValue = 800
    this.goldText = null
    this.groupText = null
    this.waveTotalText = null
    this.waveSlashText = null

    this.towerCosts = {
      bottle: 100
    }
    this.killReward = 20
    this.monsterSpeedScale = 0.58
    this.debugPathMarkers = false
    this.debugGridMarkers = false

    this.totalWaves = 0
    this.currentWave = 0
    this.currentWaveMonsters = []
    this.currentWaveSpawnIndex = 0
    this.activeMonsters = 0
    this.isWaveSpawning = false
    this.isWaveReady = false
    this.currentWaveSpawnEvent = null
    this.nextWaveDelayEvent = null
    this.hasBattleStarted = false

    this.isGameOver = false
    this.isGameplayPaused = false
    this.menuPanel = null
    this.resultPanel = null
    this.pauseButton = null
    this.speedButton = null
    this.startButton = null
    this.waveHintText = null

    this.gameSpeedOptions = [1, 2]
    this.gameSpeedIndex = 0
  }

  init (data) {
    const fromScene = data?.levelIndex
    const fromRegistry = this.registry.get('selectedLevelIndex')
    this.levelIndex = Phaser.Math.Clamp(
      Number.isInteger(fromScene) ? fromScene : (Number.isInteger(fromRegistry) ? fromRegistry : 0),
      0,
      LEVEL_DATA.length - 1
    )
    this.levelConfig = getLevelConfig(this.levelIndex)
    this.selectedMapIndex = this.levelConfig.mapIndex

    const search = new URLSearchParams(window.location.search)
    this.debugPathMarkers = search.get('debugPath') === '1'
    this.debugGridMarkers = search.get('debugGrid') === '1'
  }

  preload () {
    this.load.atlas('megaset', 'res/GamePlay/Carrot/Carrot1/hlb1.png', 'res/GamePlay/Carrot/Carrot1/hlb1.json')
    this.load.atlas('bottle', 'res/GamePlay/Tower/Bottle.png', 'res/GamePlay/Tower/myBottle.json')
    this.load.atlas('theme', 'res/GamePlay/Object/Theme1/Monster/theme_1.png', 'res/GamePlay/Object/Theme1/Monster/my_theme_1.json')

    for (let i = 1; i <= 3; i++) {
      this.load.image(`theme_bg_${i}`, 'res/GamePlay/Theme/Theme1/BG0/BG1.png')
      this.load.image(`theme_bg_path_${i}`, `res/GamePlay/Theme/Theme1/BG${i}/Path${i}.png`)
      this.load.image(`tiles_${i}`, `res/GamePlay/Theme/Theme1/BG${i}/${i}.png`)
      this.load.tilemapTiledJSON({
        key: `map_${i}`,
        url: `res/GamePlay/Theme/Theme1/BG${i}/Level${i}.json`
      })
    }

    this.load.image('start_bt', 'res/GamePlay/Object/Theme1/Object/start01.png')
    this.load.image('end_sign_pic', 'res/GamePlay/Carrot/Carrot1/hlb1_10.png')
    this.load.image('start_carrot_hp_bg', 'res/GamePlay/carrot_hp_bg.png')
    this.load.image('warning', 'res/GamePlay/warning.png')
    this.load.image('select_01', 'res/GamePlay/select_01.png')
    this.load.image('Bottle01', 'res/GamePlay/Tower/Bottle/Bottle01.png')
    this.load.image('Bottle3', 'res/GamePlay/Tower/Bottle/Bottle_3.png')
    this.load.image('Bottle31', 'res/GamePlay/Tower/Bottle/Bottle31.png')
    this.load.image('PBottle31', 'res/GamePlay/Tower/Bottle/PBottle31.png')

    this.load.image('topBg', 'res/GamePlay/UI/top_bg.png')
    this.load.image('wavesBg', 'res/GamePlay/UI/waves_bg.png')
    this.load.image('groupInfo', 'res/GamePlay/UI/CN/group_info.png')
    this.load.image('speed0', 'res/GamePlay/UI/speed_0.png')
    this.load.image('speed1', 'res/GamePlay/UI/speed_1.png')
    this.load.image('pause0', 'res/GamePlay/UI/pause_0.png')
    this.load.image('pause1', 'res/GamePlay/UI/pause_1.png')
    this.load.image('menu', 'res/GamePlay/UI/menu.png')
    this.load.image('bottomBg', 'res/GamePlay/UI/bottom_bg.png')
    this.load.image('advMissionBg', 'res/GamePlay/UI/adv_mission_bg.png')
    this.load.image('barBlank', 'res/GamePlay/UI/bar_blank.png')
    this.load.image('bar_bomb_02', 'res/GamePlay/UI/bar_bomb_02.png')
    this.load.image('bar_blood_02', 'res/GamePlay/UI/bar_blood_02.png')
    this.load.image('bar_speed_02', 'res/GamePlay/UI/bar_speed_02.png')
    this.load.image('bar_ice_02', 'res/GamePlay/UI/bar_ice_02.png')
    this.load.image('bar_slow_02', 'res/GamePlay/UI/bar_slow_02.png')
    this.load.image('advMenuBg', 'res/GamePlay/UI/adv_menu_bg.png')
    this.load.image('buttonGreen', 'res/UI/btn_green_b.png')
    this.load.image('advMenuContinue', 'res/GamePlay/UI/CN/adv_menu_continue.png')
    this.load.image('pauseInfo', 'res/GamePlay/UI/CN/pause_info.png')
    this.load.image('menuHomeLabel', 'res/GamePlay/UI/CN/adv_menu_home.png')
    this.load.image('menuRestartLabel', 'res/GamePlay/UI/CN/adv_menu_restart.png')
    this.load.image('resultHome', 'res/GameResult/GameOver/winlose_home.png')
    this.load.image('resultRetry', 'res/GameResult/Lose/lose_retry.png')
    this.load.image('resultContinue', 'res/GameResult/Win/win_continue.png')
    this.load.image('resultWinBg', 'res/GameResult/Win/win_bg.png')
    this.load.image('resultLoseBg', 'res/GameResult/Lose/lose_bg.png')
    this.load.image('resultWinTitle', 'res/GameResult/Win/winlose_winover.png')
    this.load.image('resultLoseTitle', 'res/GameResult/Lose/winlose_loseover.png')
    this.load.image('blood_number', 'res/Font/num_blood.png')

    this.load.audio('gameplay_bg_music', 'res/Sound/GamePlay/BGMusic01.mp3')

    for (let i = 1; i < 4; i++) {
      this.load.image(`S${i}`, `res/GamePlay/Object/Theme1/Object/S${i}.png`)
      this.load.image(`L${i}`, `res/GamePlay/Object/Theme1/Object/L${i}.png`)
      this.load.image(`Monster_L${i}`, `res/GamePlay/Object/Theme1/Monster/L1${i}.png`)
    }
    for (let i = 1; i < 3; i++) {
      this.load.image(`B${i}`, `res/GamePlay/Object/Theme1/Object/B${i}.png`)
    }
  }

  create () {
    this.playGameplayMusic()
    this.loadLevelState()
    this.resetBattleState()

    this.monsters = this.physics.add.group({ allowGravity: false })

    this.loadBackground()
    this.loadMain()
    this.loadUI()
    this.applyGameSpeed()
    this.updatePauseButtonState()
    this.updateHud()
    this.prepareNextWave()
  }

  playGameplayMusic () {
    this.sound.get('front_bg_music')?.stop()
    const bgMusic = this.sound.get('gameplay_bg_music') ?? this.sound.add('gameplay_bg_music', { loop: true })
    if (!bgMusic.isPlaying) {
      bgMusic.play()
    }
  }

  loadLevelState () {
    this.levelConfig = getLevelConfig(this.levelIndex)
    this.baseHealthValue = this.levelConfig.blood
    this.startGold = this.levelConfig.gold
    this.totalWaves = this.levelConfig.maxGroup
  }

  resetBattleState () {
    this.tiledMapRectArray = []
    this.tiledMapRectArrayMap = []
    this.roadPointArray = []
    this.touchWarningNode = null
    this.touchWarningTween = null
    this.towerPanel = null

    this.healthValue = this.baseHealthValue
    this.goldValue = this.startGold
    this.currentWave = 0
    this.currentWaveMonsters = []
    this.currentWaveSpawnIndex = 0
    this.activeMonsters = 0
    this.isWaveSpawning = false
    this.isWaveReady = false
    this.currentWaveSpawnEvent = null
    this.nextWaveDelayEvent = null
    this.hasBattleStarted = false

    this.isGameOver = false
    this.isGameplayPaused = false
    this.menuPanel = null
    this.resultPanel = null
    this.gameSpeedIndex = 0
  }

  loadBackground () {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, `theme_bg_${this.selectedMapIndex}`)
  }

  loadMain () {
    this.loadProperty()
    this.loadPath()
    this.loadTiledMap()
    this.loadStartAndEnd()
    this.loadCarrotHp()
    this.loadCanTouchRect()
    this.loadTiledMapRectArrayMap()
    this.loadRoadPointArray()
    this.loadObstacle()
    this.loadRoadMap()
    this.renderDebugGrid()
    this.registerBuildPlacementInput()
  }

  loadUI () {
    this.loadTopBar()
    this.loadGoldText()
    this.loadGroupInfo()
    this.loadBottomBar()
    this.loadMissionBg()
    this.loadTopButtons()
    this.loadBottomButtons()
    this.loadWaveHintText()
  }

  loadProperty () {
    this.ZOrderEnum.START = 10
    this.ZOrderEnum.CARROT = 0
    this.ZOrderEnum.OBSTACLE = 8
    this.ZOrderEnum.MONSTER = 20
    this.ZOrderEnum.WAMING = 30
    this.ZOrderEnum.TOWER_PANEL = 50

    this.tiledMapRectMapEnemu.NONE = 0
    this.tiledMapRectMapEnemu.ROAD = 1
    this.tiledMapRectMapEnemu.SMALL = 2
    this.tiledMapRectMapEnemu.LITTLE = 3
    this.tiledMapRectMapEnemu.BIG = 4
    this.tiledMapRectMapEnemu.INVALID = 5
    this.tiledMapRectMapEnemu.TOWER = 6
  }

  loadPath () {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, `theme_bg_path_${this.selectedMapIndex}`)
  }

  loadTiledMap () {
    this.map = this.make.tilemap({ key: `map_${this.selectedMapIndex}` })
    const tiles = this.map.addTilesetImage(String(this.selectedMapIndex), `tiles_${this.selectedMapIndex}`)
    this.mapLayer = this.map.createLayer(0, tiles, 0, 0)

    const offsetX = (this.cameras.main.width - this.map.widthInPixels) / 2
    const offsetY = (this.cameras.main.height - this.map.heightInPixels) / 2
    // Phaser's object-layer world positions do not line up 1:1 with the
    // Cocos TMX object offsets used by the original project, so we keep the
    // empirically-corrected upward shift here instead of the raw Cocos formula.
    const objectLayerYOffsetFix = -this.map.tileHeight

    this.mapOffsetX = offsetX
    this.mapOffsetY = offsetY
    this.objectLayerYOffsetFix = objectLayerYOffsetFix

    this.mapLayer.setPosition(offsetX, offsetY)
    this.mapLayer.setVisible(false)

    for (const objectLayer of this.map.objects) {
      const groupName = objectLayer.name
      let finalOffsetX = offsetX
      let finalOffsetY = offsetY

      if (groupName === 'little') {
        finalOffsetY += this.map.tileHeight / 2
      } else if (groupName === 'small' || groupName === 'road' || groupName === 'start_end' || groupName === 'invalid') {
        finalOffsetX += this.map.tileWidth / 2
        finalOffsetY += this.map.tileHeight / 2
      }

      objectLayer.finalOffsetX = finalOffsetX
      objectLayer.finalOffsetY = finalOffsetY + objectLayerYOffsetFix
    }
  }

  getWorldPositionFromObject (group, obj) {
    return {
      x: obj.x + group.finalOffsetX,
      y: obj.y + group.finalOffsetY
    }
  }

  getGridInfoFromMapObject (groupName, obj) {
    let row = -1
    let cel = -1

    if (groupName === 'big' || groupName === 'little') {
      cel = Math.round(obj.x / this.map.tileWidth) - 1
      row = Math.round(obj.y / this.map.tileHeight)
    } else {
      cel = Math.round(obj.x / this.map.tileWidth)
      row = Math.round(obj.y / this.map.tileHeight) - 1
    }

    row = Phaser.Math.Clamp(row, 0, this.map.height - 1)
    cel = Phaser.Math.Clamp(cel, 0, this.map.width - 1)

    const rect = this.tiledMapRectArray[row]?.[cel]
    return {
      isInMap: Boolean(rect),
      row,
      cel,
      x: rect?.x ?? -1,
      y: rect?.y ?? -1
    }
  }

  getCellCenter (row, cel) {
    const rect = this.tiledMapRectArray[row]?.[cel]
    if (!rect) {
      return null
    }

    return {
      x: rect.x + (rect.width / 2),
      y: rect.y + (rect.height / 2)
    }
  }

  getAlignmentOffset (groupName) {
    const alignment = this.levelConfig?.alignment ?? {}
    if (groupName === 'start_end') {
      return alignment.startEnd ?? { x: 0, y: 0 }
    }
    return alignment[groupName] ?? { x: 0, y: 0 }
  }

  getAlignedWorldPositionFromMapObject (groupName, group, obj) {
    const worldPoint = this.getWorldPositionFromObject(group, obj)
    const offset = this.getAlignmentOffset(groupName)
    return {
      x: worldPoint.x + offset.x,
      y: worldPoint.y + offset.y
    }
  }

  getSnappedWorldPositionFromMapObject (groupName, group, obj) {
    const offset = this.getAlignmentOffset(groupName)
    const info = this.getGridInfoFromMapObject(groupName, obj)
    if (info.isInMap) {
      const center = this.getCellCenter(info.row, info.cel)
      if (center) {
        return {
          x: center.x + offset.x,
          y: center.y + offset.y
        }
      }
    }

    const worldPoint = this.getWorldPositionFromObject(group, obj)
    return {
      x: worldPoint.x + offset.x,
      y: worldPoint.y + offset.y
    }
  }

  loadStartAndEnd () {
    this.loadStartFlag()
    this.loadEndFlag()
  }

  loadStartFlag () {
    const startBt = this.add.sprite(0, 0, 'start_bt').setInteractive()
    const objs = this.map.getObjectLayer('start_end')
    const obj = objs.objects[0]
    const point = this.getSnappedWorldPositionFromMapObject(objs.name, objs, obj)

    startBt.setPosition(
      point.x,
      point.y + 20
    )
    startBt.setDepth(25)

    this.startButton = startBt
    this.tweens.add({
      targets: startBt,
      alpha: { value: 0.72, duration: 700, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }
    })
    this.attachButtonFeedback(startBt, () => {
      this.tryStartWave()
    })
  }

  loadEndFlag () {
    const endBt = this.add.image(0, 0, 'end_sign_pic')
    const objs = this.map.getObjectLayer('start_end')
    const obj = objs.objects[1]
    const point = this.getSnappedWorldPositionFromMapObject(objs.name, objs, obj)

    endBt.setPosition(
      point.x,
      point.y + 20
    )
    endBt.setDepth(this.ZOrderEnum.CARROT)
    this.carrot = endBt
  }

  loadCarrotHp () {
    this.loadBloodBg()
    this.loadBlood()
  }

  loadBloodBg () {
    this.carrotHpBg = this.add.sprite(this.carrot.x + 75, this.carrot.y - 50, 'start_carrot_hp_bg')
  }

  loadBlood () {
    const config = {
      image: 'blood_number',
      width: 16,
      height: 22,
      chars: Phaser.GameObjects.RetroFont.TEXT_SET8,
      charsPerRow: 8,
      spacing: { x: 0, y: 0 }
    }

    if (!this.cache.bitmapFont.get('blood_number')) {
      this.cache.bitmapFont.add('blood_number', Phaser.GameObjects.RetroFont.Parse(this, config))
    }

    this.healthText = this.add.bitmapText(
      this.carrotHpBg.x - 15,
      this.carrotHpBg.y - 3,
      'blood_number',
      String(this.healthValue)
    )
    this.healthText.setOrigin(0.5, 0.5)
  }

  loadCanTouchRect () {
    let nextPosX = (this.cameras.main.width - this.map.widthInPixels) / 2 + this.map.tileWidth / 2
    let nextPosY = (this.cameras.main.height - this.map.heightInPixels) / 2 + this.map.tileHeight / 2

    for (let row = 0; row < this.map.height; row++) {
      this.tiledMapRectArray[row] = []
      for (let cel = 0; cel < this.map.width; cel++) {
        this.tiledMapRectArray[row][cel] = new Phaser.Geom.Rectangle(
          nextPosX - this.map.tileWidth / 2,
          nextPosY - this.map.tileHeight / 2,
          this.map.tileWidth,
          this.map.tileHeight
        )
        nextPosX += this.map.tileWidth
      }

      nextPosX = (this.cameras.main.width - this.map.widthInPixels) / 2 + this.map.tileWidth / 2
      nextPosY += this.map.tileHeight
    }
  }

  loadTiledMapRectArrayMap () {
    for (let row = 0; row < this.map.height; row++) {
      this.tiledMapRectArrayMap[row] = []
      for (let cel = 0; cel < this.map.width; cel++) {
        this.tiledMapRectArrayMap[row][cel] = this.tiledMapRectMapEnemu.NONE
      }
    }
  }

  loadRoadPointArray () {
    this.roadPointArray = []
    const roadGroup = this.map.getObjectLayer('road')
    for (const road of roadGroup.objects) {
      const point = this.getSnappedWorldPositionFromMapObject(roadGroup.name, roadGroup, road)

      if (!point) {
        continue
      }

      this.roadPointArray.push(point)

      if (this.debugPathMarkers) {
        const marker = this.add.circle(point.x, point.y, 6, 0x2ecc71, 0.95)
        marker.setDepth(120)
        marker.setStrokeStyle(2, 0x145a32, 1)
      }
    }
  }

  loadObstacle () {
    this.loadSmallObstacle()
    this.loadLittleObstacle()
    this.loadBigObstacle()
    this.loadInvalidRect()
  }

  loadSmallObstacle () {
    const group = this.map.getObjectLayer('small')
    for (const obj of group.objects) {
      const { x, y } = this.getAlignedWorldPositionFromMapObject(group.name, group, obj)
      const sprite = this.add.sprite(x, y, obj.name)
      sprite.setDepth(this.ZOrderEnum.OBSTACLE)

      const info = this.getGridInfoFromMapObject(group.name, obj)
      if (info.isInMap) {
        this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnemu.SMALL
      }
    }
  }

  loadLittleObstacle () {
    const group = this.map.getObjectLayer('little')
    for (const obj of group.objects) {
      const { x, y } = this.getAlignedWorldPositionFromMapObject(group.name, group, obj)
      const sprite = this.add.sprite(x, y, obj.name)
      sprite.setDepth(this.ZOrderEnum.OBSTACLE)

      const info = this.getGridInfoFromMapObject(group.name, obj)
      if (info.isInMap) {
        this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnemu.LITTLE
        if (info.cel - 1 >= 0) {
          this.tiledMapRectArrayMap[info.row][info.cel - 1] = this.tiledMapRectMapEnemu.LITTLE
        }
      }
    }
  }

  loadBigObstacle () {
    const group = this.map.getObjectLayer('big')
    for (const obj of group.objects) {
      const { x, y } = this.getAlignedWorldPositionFromMapObject(group.name, group, obj)
      const sprite = this.add.sprite(x, y, obj.name)
      sprite.setDepth(this.ZOrderEnum.OBSTACLE)

      const info = this.getGridInfoFromMapObject(group.name, obj)
      if (info.isInMap) {
        this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnemu.BIG
        if (info.cel - 1 >= 0) {
          this.tiledMapRectArrayMap[info.row][info.cel - 1] = this.tiledMapRectMapEnemu.BIG
        }
        if (info.row - 1 >= 0) {
          this.tiledMapRectArrayMap[info.row - 1][info.cel] = this.tiledMapRectMapEnemu.BIG
          if (info.cel - 1 >= 0) {
            this.tiledMapRectArrayMap[info.row - 1][info.cel - 1] = this.tiledMapRectMapEnemu.BIG
          }
        }
      }
    }
  }

  loadInvalidRect () {
    const group = this.map.getObjectLayer('invalid')
    for (const obj of group.objects) {
      const info = this.getGridInfoFromMapObject(group.name, obj)
      if (info.isInMap) {
        this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnemu.INVALID
      }
    }
  }

  loadRoadMap () {
    const roadGroup = this.map.getObjectLayer('road')
    const roads = roadGroup.objects

    for (let i = 0; i < roads.length - 1; i++) {
      const currInfo = this.getGridInfoFromMapObject(roadGroup.name, roads[i])
      const nextInfo = this.getGridInfoFromMapObject(roadGroup.name, roads[i + 1])

      if (!currInfo.isInMap || !nextInfo.isInMap) {
        continue
      }

      if (currInfo.row === nextInfo.row) {
        const step = currInfo.cel <= nextInfo.cel ? 1 : -1
        for (let cel = currInfo.cel; cel !== nextInfo.cel + step; cel += step) {
          if (cel >= 0 && cel < this.map.width) {
            this.tiledMapRectArrayMap[currInfo.row][cel] = this.tiledMapRectMapEnemu.ROAD
          }
        }
      } else {
        const step = currInfo.row <= nextInfo.row ? 1 : -1
        for (let row = currInfo.row; row !== nextInfo.row + step; row += step) {
          if (row >= 0 && row < this.map.height) {
            this.tiledMapRectArrayMap[row][currInfo.cel] = this.tiledMapRectMapEnemu.ROAD
          }
        }
      }
    }
  }

  renderDebugGrid () {
    if (!this.debugGridMarkers) {
      return
    }

    const colorMap = {
      [this.tiledMapRectMapEnemu.ROAD]: 0x2ecc71,
      [this.tiledMapRectMapEnemu.SMALL]: 0xf39c12,
      [this.tiledMapRectMapEnemu.LITTLE]: 0xe67e22,
      [this.tiledMapRectMapEnemu.BIG]: 0xd35400,
      [this.tiledMapRectMapEnemu.INVALID]: 0x8e44ad,
      [this.tiledMapRectMapEnemu.TOWER]: 0xe74c3c
    }

    for (let row = 0; row < this.tiledMapRectArrayMap.length; row++) {
      for (let cel = 0; cel < this.tiledMapRectArrayMap[row].length; cel++) {
        const cellType = this.tiledMapRectArrayMap[row][cel]
        if (cellType === this.tiledMapRectMapEnemu.NONE) {
          continue
        }

        const rect = this.tiledMapRectArray[row][cel]
        const center = this.getCellCenter(row, cel)
        if (!rect || !center) {
          continue
        }

        const box = this.add.rectangle(center.x, center.y, rect.width - 4, rect.height - 4)
        box.setStrokeStyle(2, colorMap[cellType] ?? 0xffffff, 0.95)
        box.setFillStyle(colorMap[cellType] ?? 0xffffff, 0.08)
        box.setDepth(119)
      }
    }
  }

  loadTopBar () {
    this.topBar = this.add.container(this.cameras.main.centerX, 0)
    this.topBar.setDepth(110)
    const topBg = this.add.image(0, 0, 'topBg')
    topBg.setOrigin(0.5, 0)
    this.topBar.add(topBg)
    this.topBarBg = topBg

    const wavesBg = this.add.image(0, topBg.height / 2, 'wavesBg')
    this.topBar.add(wavesBg)

    const groupInfo = this.add.image(0, topBg.height / 2, 'groupInfo')
    this.topBar.add(groupInfo)
  }

  loadGoldText () {
    this.goldText = this.add.text(160 - this.cameras.main.centerX, 38, '', {
      fontFamily: 'Trebuchet MS',
      fontSize: 28,
      fontStyle: 'bold',
      color: '#7a3f12',
      stroke: '#fff2b8',
      strokeThickness: 4
    })
    this.goldText.setOrigin(0, 0.5)
    this.topBar.add(this.goldText)
  }

  loadGroupInfo () {
    const topBarMidY = this.topBarBg.height / 2 + 3

    this.groupText = this.add.text(-60, topBarMidY, '1', {
      fontFamily: 'Trebuchet MS',
      fontSize: 28,
      fontStyle: 'bold',
      color: '#7a3f12',
      stroke: '#fff2b8',
      strokeThickness: 4
    })
    this.groupText.setOrigin(0.5, 0.5)
    this.topBar.add(this.groupText)

    this.waveSlashText = this.add.text(-33, topBarMidY - 1, '/', {
      fontFamily: 'Trebuchet MS',
      fontSize: 28,
      fontStyle: 'bold',
      color: '#7a3f12',
      stroke: '#fff2b8',
      strokeThickness: 4
    })
    this.waveSlashText.setOrigin(0.5, 0.5)
    this.topBar.add(this.waveSlashText)

    this.waveTotalText = this.add.text(6, topBarMidY, String(this.totalWaves), {
      fontFamily: 'Trebuchet MS',
      fontSize: 28,
      fontStyle: 'bold',
      color: '#7a3f12',
      stroke: '#fff2b8',
      strokeThickness: 4
    })
    this.waveTotalText.setOrigin(0.5, 0.5)
    this.topBar.add(this.waveTotalText)
  }

  loadWaveHintText () {
    this.waveHintText = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 115, '', {
      fontFamily: 'Arial',
      fontSize: 22,
      color: '#fff4b1',
      stroke: '#4a341d',
      strokeThickness: 4,
      align: 'center'
    })
    this.waveHintText.setOrigin(0.5, 0.5)
    this.waveHintText.setDepth(30)
  }

  loadTopButtons () {
    this.loadSpeedButton()
    this.loadPauseButton()
    this.loadMenuButton()
  }

  loadSpeedButton () {
    this.speedButton = this.add.image(220, 40, 'speed0').setInteractive()
    this.topBar.add(this.speedButton)
    this.attachButtonFeedback(this.speedButton, () => {
      this.toggleGameSpeed()
    })
  }

  loadPauseButton () {
    this.pauseButton = this.add.image(320, 40, 'pause0').setInteractive()
    this.topBar.add(this.pauseButton)
    this.attachButtonFeedback(this.pauseButton, () => {
      this.togglePauseMenu()
    })
  }

  loadMenuButton () {
    const node = this.add.image(390, 40, 'menu').setInteractive()
    this.topBar.add(node)
    this.attachButtonFeedback(node, () => {
      this.openPauseMenu()
    })
  }

  loadBottomBar () {
    this.bottomBar = this.add.container(this.cameras.main.centerX, this.cameras.main.height)
    const node = this.add.image(0, 0, 'bottomBg')
    node.setOrigin(0.5, 1)
    this.bottomBar.add(node)
  }

  loadMissionBg () {
    const node = this.add.image(205 - this.bottomBar.x, -25, 'advMissionBg')
    this.bottomBar.add(node)
  }

  loadBottomButtons () {
    const arr = ['bar_bomb_02', 'bar_blood_02', 'bar_speed_02', 'bar_ice_02', 'bar_slow_02']
    let nextPosX = -60
    const offsetX = 10
    for (const key of arr) {
      const con = this.add.container(nextPosX, -65)
      const bg = this.add.image(0, -15, 'barBlank')
      bg.setOrigin(0.5, 0)
      con.add(bg)

      const button = this.add.image(0, 20, key)
      con.add(button)
      nextPosX += button.width + offsetX
      this.bottomBar.add(con)
    }
  }

  prepareNextWave () {
    if (this.currentWave >= this.totalWaves || this.isGameOver) {
      return
    }

    if (!this.hasBattleStarted) {
      this.isWaveReady = true
      this.updateWaveHint(`第 ${this.currentWave + 1} 波待命中\n点击起点路标开始刷怪`)
      return
    }

    this.isWaveReady = false
    this.updateWaveHint(`第 ${this.currentWave + 1} 波即将到来`)
    this.nextWaveDelayEvent?.remove(false)
    this.nextWaveDelayEvent = this.time.delayedCall(
      Math.max(1, this.levelConfig.groupInterval * 1000),
      () => {
        this.nextWaveDelayEvent = null
        this.isWaveReady = true
        this.tryStartWave()
      }
    )
  }

  tryStartWave () {
    if (!this.isWaveReady || this.isWaveSpawning || this.isGameplayPaused || this.isGameOver) {
      return
    }

    this.isWaveReady = false
    this.isWaveSpawning = true
    this.hasBattleStarted = true
    this.currentWaveMonsters = this.expandMonsterGroup(this.levelConfig.monsterGroup[this.currentWave])
    this.currentWaveSpawnIndex = 0
    this.currentWave += 1

    this.updateHud()
    this.updateWaveHint(`第 ${this.currentWave} 波开始`)

    this.currentWaveSpawnEvent = this.time.addEvent({
      delay: Math.max(1, this.levelConfig.enemyInterval * 1000),
      repeat: Math.max(0, this.currentWaveMonsters.length - 1),
      callback: () => {
        this.spawnNextMonster()
      }
    })

    this.spawnNextMonster()
  }

  expandMonsterGroup (groupData) {
    const monsters = []
    for (const team of groupData.team) {
      for (let unit = 0; unit < team.count; unit++) {
        monsters.push({
          name: team.name,
          namePrefix: team.name.slice(0, -1),
          speed: team.speed * this.monsterSpeedScale,
          blood: team.blood,
          index: unit
        })
      }
    }
    return monsters
  }

  spawnNextMonster () {
    if (this.currentWaveSpawnIndex >= this.currentWaveMonsters.length || this.isGameOver) {
      this.finishWaveSpawning()
      return
    }

    const data = this.currentWaveMonsters[this.currentWaveSpawnIndex]
    this.currentWaveSpawnIndex += 1

    const monster = new Monster(this, this.roadPointArray[0].x, this.roadPointArray[0].y, 'theme', `${data.namePrefix}1`)
    monster.setDepth(this.ZOrderEnum.MONSTER)
    monster.setData({
      road: this.roadPointArray,
      speed: data.speed,
      index: data.index,
      namePrefix: data.namePrefix
    })
    monster.setKill((target) => {
      this.resolveMonster(target, { defeated: false, reachedCarrot: true })
    })

    this.add.existing(monster)
    this.physics.add.existing(monster)
    this.monsters.add(monster)
    monster.run()

    this.activeMonsters += 1

    if (this.currentWaveSpawnIndex >= this.currentWaveMonsters.length) {
      this.finishWaveSpawning()
    }
  }

  finishWaveSpawning () {
    if (!this.isWaveSpawning) {
      return
    }
    this.isWaveSpawning = false
    if (this.currentWaveSpawnEvent) {
      this.currentWaveSpawnEvent.remove(false)
      this.currentWaveSpawnEvent = null
    }
  }

  resolveMonster (monster, options = {}) {
    const { defeated = false, reachedCarrot = false } = options

    if (monster && monster.active) {
      this.monsters.remove(monster, true, true)
    }

    this.activeMonsters = Math.max(0, this.activeMonsters - 1)

    if (defeated) {
      this.changeGold(this.killReward)
    }

    if (reachedCarrot) {
      this.changeHealth(-1)
      if (this.healthValue <= 0) {
        this.showResult(false)
        return
      }
    }

    if (!this.isWaveSpawning && this.activeMonsters === 0) {
      if (this.currentWave >= this.totalWaves) {
        this.showResult(true)
      } else {
        this.prepareNextWave()
      }
    }
  }

  registerBuildPlacementInput () {
    this.input.on('pointerup', (pointer) => {
      this.handlePlacementAtWorld(pointer.worldX, pointer.worldY)
    })
  }

  handlePlacementAtWorld (worldX, worldY) {
    if (this.isGameOver || this.isGameplayPaused) {
      return
    }

    if (this.isPointerOverBlockedUi(worldX, worldY)) {
      return
    }

    const result = this.getInfoFromMapByPos(worldX, worldY)
    if (!result.isInMap) {
      this.removeTowerPanel()
      this.loadTouchWarning(worldX, worldY)
      return
    }

    if (this.towerPanel && this.towerPanel.matchesCell(result.row, result.cel)) {
      this.removeTowerPanel()
      return
    }

    if (this.isBlockedCell(result.row, result.cel)) {
      this.removeTowerPanel()
      this.loadTouchWarning(result.x + this.map.tileWidth / 2, result.y + this.map.tileHeight / 2)
      return
    }

    this.removeTowerPanel()
    this.loadTowerPanel(result)
  }

  isPointerOverBlockedUi (x, y) {
    if (this.startButton?.getBounds().contains(x, y)) {
      return true
    }
    if (this.speedButton?.getBounds().contains(x, y)) {
      return true
    }
    if (this.pauseButton?.getBounds().contains(x, y)) {
      return true
    }
    if (y <= 85 || y >= this.cameras.main.height - 105) {
      return true
    }
    return false
  }

  loadTowerPanel (args) {
    const panel = new TowerPanel(this, 0, 0)
    panel.loadProperty(args)
    panel.setCallback((towerName) => {
      this.createTowerAt(args, towerName)
    })
    this.add.existing(panel)
    this.towerPanel = panel
  }

  removeTowerPanel () {
    if (!this.towerPanel) {
      return
    }
    this.towerPanel.destroyAll()
    this.towerPanel = null
  }

  loadTouchWarning (x, y) {
    let warningSprite = this.touchWarningNode

    if (!warningSprite) {
      warningSprite = this.add.sprite(x, y, 'warning')
      warningSprite.setDepth(this.ZOrderEnum.WAMING)
      this.touchWarningNode = warningSprite
    }

    warningSprite.setPosition(x, y)
    warningSprite.setAlpha(1)
    this.touchWarningTween?.stop()

    this.touchWarningTween = this.tweens.add({
      delay: 400,
      targets: warningSprite,
      alpha: { value: 0, duration: 300, ease: 'Expo.easeOut' },
      onComplete: () => {
        warningSprite.destroy()
        if (this.touchWarningNode === warningSprite) {
          this.touchWarningNode = null
          this.touchWarningTween = null
        }
      }
    })
  }

  createTowerAt (cellInfo, towerName) {
    const towerCost = this.towerCosts[towerName] ?? 0
    if (this.goldValue < towerCost) {
      this.showFloatingMessage(cellInfo.x + this.map.tileWidth / 2, cellInfo.y + 18, `金币不足 ${towerCost}`, '#c0392b')
      this.removeTowerPanel()
      return null
    }

    const towerData = {
      name: towerName,
      x: cellInfo.x + this.map.tileWidth / 2,
      y: cellInfo.y + this.map.tileHeight / 2,
      scope: 300,
      bulletSpeed: 40
    }
    const tower = new TowerBase(this, towerData.x, towerData.y, towerData)

    tower.setRow(cellInfo.row)
    tower.setCel(cellInfo.cel)
    this.tiledMapRectArrayMap[cellInfo.row][cellInfo.cel] = this.tiledMapRectMapEnemu.TOWER
    this.changeGold(-towerCost)
    this.removeTowerPanel()

    this.showFloatingMessage(cellInfo.x + this.map.tileWidth / 2, cellInfo.y + 18, `-${towerCost}`, '#fff4b1')
    return tower
  }

  isBlockedCell (row, cel) {
    return this.tiledMapRectArrayMap[row][cel] !== this.tiledMapRectMapEnemu.NONE
  }

  getInfoFromMapByPos (x, y) {
    for (let row = 0; row < this.tiledMapRectArray.length; row++) {
      for (let cel = 0; cel < this.tiledMapRectArray[row].length; cel++) {
        const rect = this.tiledMapRectArray[row][cel]
        if (Phaser.Geom.Rectangle.Contains(rect, x, y)) {
          return {
            isInMap: true,
            row,
            cel,
            x: rect.x,
            y: rect.y
          }
        }
      }
    }

    return {
      isInMap: false,
      row: -1,
      cel: -1,
      x: -1,
      y: -1
    }
  }

  changeGold (delta) {
    this.goldValue = Math.max(0, this.goldValue + delta)
    this.updateHud()
  }

  changeHealth (delta) {
    this.healthValue = Math.max(0, this.healthValue + delta)
    this.updateHud()
  }

  updateHud () {
    const displayedWave = this.getDisplayedWaveNumber()
    this.goldText?.setText(String(this.goldValue))
    this.groupText?.setText(String(displayedWave))
    this.waveTotalText?.setText(String(this.totalWaves))
    this.healthText?.setText(String(this.healthValue))
  }

  getDisplayedWaveNumber () {
    if (this.totalWaves <= 0) {
      return 0
    }
    if (this.currentWave <= 0) {
      return 1
    }
    if (this.isWaveReady && !this.isWaveSpawning && this.activeMonsters === 0) {
      return Math.min(this.currentWave + 1, this.totalWaves)
    }
    return Math.min(this.currentWave, this.totalWaves)
  }

  updateWaveHint (text) {
    this.waveHintText?.setText(text)
  }

  toggleGameSpeed () {
    this.gameSpeedIndex = (this.gameSpeedIndex + 1) % this.gameSpeedOptions.length
    this.applyGameSpeed()
  }

  applyGameSpeed () {
    const speed = this.gameSpeedOptions[this.gameSpeedIndex]
    this.time.timeScale = speed
    this.tweens.timeScale = speed
    this.physics.world.timeScale = speed
    this.speedButton?.setTexture(this.gameSpeedIndex === 0 ? 'speed0' : 'speed1')
  }

  togglePauseMenu () {
    if (this.isGameOver) {
      return
    }
    if (this.menuPanel) {
      this.continuePlay()
    } else {
      this.openPauseMenu()
    }
  }

  openPauseMenu () {
    if (this.isGameOver || this.menuPanel) {
      return
    }

    this.setGameplayPaused(true)
    this.menuPanel = this.add.container(0, 0)

    const mask = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x696969, 0.5)
    mask.setOrigin(0, 0)
    this.menuPanel.add(mask)

    const advBg = this.add.image(this.cameras.main.centerX, 0, 'advMenuBg')
    advBg.setOrigin(0.5, 0)
    this.menuPanel.add(advBg)

    const pauseInfo = this.add.image(this.cameras.main.centerX, 48, 'pauseInfo')
    pauseInfo.setOrigin(0.5, 0)
    this.menuPanel.add(pauseInfo)

    const waveString = this.add.text(this.cameras.main.centerX, 105, `Wave ${this.currentWave}/${this.totalWaves}`, {
      fontFamily: 'Arial',
      fontSize: 32,
      color: '#5b3b1a'
    })
    waveString.setOrigin(0.5, 0.5)
    this.menuPanel.add(waveString)

    const hpString = this.add.text(this.cameras.main.centerX, 152, `Carrot HP ${this.healthValue}`, {
      fontFamily: 'Arial',
      fontSize: 26,
      color: '#5b3b1a'
    })
    hpString.setOrigin(0.5, 0.5)
    this.menuPanel.add(hpString)

    const continueBtn = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 105, 'buttonGreen').setInteractive()
    const continueLabel = this.add.image(continueBtn.x, continueBtn.y, 'advMenuContinue').setInteractive()
    this.menuPanel.add(continueBtn)
    this.menuPanel.add(continueLabel)
    this.attachButtonFeedback(continueBtn, () => this.continuePlay())
    this.attachButtonFeedback(continueLabel, () => this.continuePlay())

    const retryButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 10, 'resultRetry').setInteractive()
    const retryLabel = this.add.image(retryButton.x, retryButton.y + 54, 'menuRestartLabel')
    this.menuPanel.add(retryButton)
    this.menuPanel.add(retryLabel)
    this.attachButtonFeedback(retryButton, () => this.restartBattle())

    const homeButton = this.add.image(this.cameras.main.centerX - 150, this.cameras.main.centerY + 10, 'resultHome').setInteractive()
    const homeLabel = this.add.image(homeButton.x, homeButton.y + 54, 'menuHomeLabel')
    this.menuPanel.add(homeButton)
    this.menuPanel.add(homeLabel)
    this.attachButtonFeedback(homeButton, () => this.goToScene('main_menu'))

    this.menuPanel.setDepth(150)
  }

  continuePlay () {
    this.menuPanel?.destroy(true)
    this.menuPanel = null
    this.setGameplayPaused(false)
  }

  setGameplayPaused (paused) {
    this.isGameplayPaused = paused
    this.physics.world.isPaused = paused
    this.updatePauseButtonState()
  }

  updatePauseButtonState () {
    this.pauseButton?.setTexture(this.isGameplayPaused ? 'pause1' : 'pause0')
  }

  showResult (isWin) {
    if (this.isGameOver) {
      return
    }

    this.isGameOver = true
    this.setGameplayPaused(true)
    this.currentWaveSpawnEvent?.remove(false)
    this.currentWaveSpawnEvent = null
    this.nextWaveDelayEvent?.remove(false)
    this.nextWaveDelayEvent = null
    this.sound.get('gameplay_bg_music')?.stop()
    if (isWin) {
      this.persistProgressOnWin()
    }

    this.resultPanel = this.add.container(0, 0)
    this.resultPanel.setDepth(200)

    const mask = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.45)
    mask.setOrigin(0, 0)
    this.resultPanel.add(mask)

    const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, isWin ? 'resultWinBg' : 'resultLoseBg')
    const title = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 135, isWin ? 'resultWinTitle' : 'resultLoseTitle')
    this.resultPanel.add(bg)
    this.resultPanel.add(title)

    const summary = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 26, isWin ? '萝卜保住了，继续下一关吧。' : '萝卜被吃掉了，再试一次。', {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#5b3b1a',
      align: 'center'
    })
    summary.setOrigin(0.5, 0.5)
    this.resultPanel.add(summary)

    const homeBtn = this.add.image(this.cameras.main.centerX - 150, this.cameras.main.centerY + 110, 'resultHome').setInteractive()
    this.resultPanel.add(homeBtn)
    this.attachButtonFeedback(homeBtn, () => this.goToScene('main_menu'))

    const actionBtn = this.add.image(this.cameras.main.centerX + 150, this.cameras.main.centerY + 110, isWin ? 'resultContinue' : 'resultRetry').setInteractive()
    this.resultPanel.add(actionBtn)
    this.attachButtonFeedback(actionBtn, () => {
      if (isWin) {
        this.goToScene('level_select')
      } else {
        this.restartBattle()
      }
    })
  }

  restartBattle () {
    this.sound.get('gameplay_bg_music')?.stop()
    this.nextWaveDelayEvent?.remove(false)
    this.nextWaveDelayEvent = null
    this.scene.restart({ levelIndex: this.levelIndex })
  }

  persistProgressOnWin () {
    const currentUnlocked = Number(window.localStorage.getItem('carrot_unlocked_level_count') || 1)
    const nextUnlocked = Math.max(currentUnlocked, Math.min(this.levelIndex + 2, 3))
    window.localStorage.setItem('carrot_unlocked_level_count', String(nextUnlocked))
    this.registry.set('selectedLevelIndex', Math.min(this.levelIndex + 1, nextUnlocked - 1))
  }

  goToScene (sceneKey) {
    this.sound.get('gameplay_bg_music')?.stop()
    this.scene.start(sceneKey)
  }

  attachButtonFeedback (gameObject, callback) {
    gameObject.on('pointerdown', () => {
      gameObject.setScale(0.96)
    })
    gameObject.on('pointerout', () => {
      gameObject.setScale(1)
    })
    gameObject.on('pointerup', () => {
      gameObject.setScale(1)
      callback()
    })
  }

  showFloatingMessage (x, y, message, color) {
    const text = this.add.text(x, y, message, {
      fontFamily: 'Arial',
      fontSize: 20,
      color,
      stroke: '#4a341d',
      strokeThickness: 4
    })
    text.setOrigin(0.5, 0.5)
    text.setDepth(180)

    this.tweens.add({
      targets: text,
      y: y - 26,
      alpha: { value: 0, duration: 900, ease: 'Quad.easeOut' },
      duration: 900,
      onComplete: () => text.destroy()
    })
  }
}
