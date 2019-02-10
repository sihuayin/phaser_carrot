class gamePlayScene extends Phaser.Scene {
  constructor ()
  {
    // super('game_play');
    super();
    this.ZOrderEnum = {};
    this.tiledMapRectMapEnemu = {};
    this.tiledMapRectArray = [];
    this.tiledMapRectArrayMap = [];
    this.touchWarningNode = null;
    this.towerPanel = null;
    this.healthValue = 10
    this.healthText = null
    
  }
  preload () {
    this.load.atlas('megaset', 'res/GamePlay/Carrot/Carrot1/hlb1.png', 'res/GamePlay/Carrot/Carrot1/hlb1.json');
    this.load.atlas('bottle', 'res/GamePlay/Tower/Bottle.png', 'res/GamePlay/Tower/myBottle.json');
    this.load.image('end_sign_pic', 'res/GamePlay/Carrot/Carrot1/hlb1_10.png')

    // theme id
    this.load.atlas('theme', 'res/GamePlay/Object/Theme1/Monster/theme_1.png', 'res/GamePlay/Object/Theme1/Monster/my_theme_1.json')
    this.load.image('theme_bg', "res/GamePlay/Theme/Theme1/BG0/BG1.png")
    this.load.image('theme_bg_path', 'res/GamePlay/Theme/Theme1/BG1/Path1.png')
    this.load.image('tiles', 'res/GamePlay/Theme/Theme1/BG1/1.png');
    this.load.image('start_bt', 'res/GamePlay/Object/Theme1/Object/start01.png')
    this.load.image('start_carrot_hp_bg', 'res/GamePlay/carrot_hp_bg.png')
    this.load.image('blood_number', 'res/Font/num_blood.png')
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
    this.load.image('pause0', 'res/GamePlay/UI/pause_0.png')
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
    for(let i = 1; i < 4; i++) {
      this.load.image(`S${i}`, `res/GamePlay/Object/Theme1/Object/S${i}.png`)
    }
    for(let i = 1; i < 4; i++) {
      this.load.image(`L${i}`, `res/GamePlay/Object/Theme1/Object/L${i}.png`)
    }
    for(let i = 1; i < 3; i++) {
      this.load.image(`B${i}`, `res/GamePlay/Object/Theme1/Object/B${i}.png`)
    }
    for(let i = 1; i < 4; i++) {
      this.load.image(`Monster_L${i}`, `res/GamePlay/Object/Theme1/Monster/L1${i}.png`)
    }
    this.load.tilemapTiledJSON({
      key: 'map',
      url: 'res/GamePlay/Theme/Theme1/BG1/Level1.json'
    });
  }

  create () {

    var atlasTexture = this.textures.get('theme');
    var frames = atlasTexture.getFrameNames();
console.log(frames)
    for (var i = 0; i < frames.length; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);

        this.add.image(x, y, 'theme', frames[i]);
    }
    this.monsters = this.physics.add.group({ allowGravity: false });
    this.loadBackground()
    this.loadMain()
    this.loadUI()
    
  }

  loadBackground () {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'theme_bg')
  }

  loadMain () {
    this.loadProperty()
    this.loadPath()
    this.loadTiledMap()
    this.loadStartButton()
    this.loadEndButton()
    this.loadBloodBg()
    this.loadBlood()
    this.loadCanTouchRect()
    this.loadTiledMapRectArrayMap()
    this.loadRoadPointArray()
    this.loadObstacle()
    this.loadRoadMap()
    this.loadNextGroupMonster()


    this.input.on('pointerdown', (pointer, gameObjects) => {
      // console.log(gameObjects.length > 0 && gameObjects[0].getData('name'))
      if (gameObjects.length > 0 && gameObjects[0].name === 'bottle') {
        return ;
      }
      pointer.event.preventDefault()
      var result = this.getInfoFromMapByPos(pointer.downX, pointer.downY);
      console.log(result)
      // console.log(pointer)
      if (!result.isInMap) {
        this.loadTouchWarning(pointer.downX, pointer.downY);
      } else if (this.tiledMapRectArrayMap[result.row][result.cel] != this.tiledMapRectMapEnemu.NONE) {
        this.loadTouchWarning(result.x + this.map.tileWidth / 2, result.y + this.map.tileHeight / 2);
      } else {
        if (this.towerPanel == null) {
          this.loadTowerPanel({
              cel : result.cel,
              row : result.row,
              x :result.x,
              y: result.y
          });
        }else{
            // self.removeChild(self.towerPanel);
            this.towerPanel = null;
        }
      }
    })
  }

  loadUI () {
    this.loadTopBar()
    this.loadGoldText()
    this.loadGroupInfo()
    this.loadBottomBar()
    this.loadMissionBg()
    this.loadTopButtons()
    this.loadBottomButtons()
  }

  loadTopBar () {
    this.topBar = this.add.container(this.cameras.main.centerX, 0)
    var topBg = this.add.image(0, 0, 'topBg')
    topBg.setOrigin(0.5, 0)
    this.topBar.add(topBg)

    var wavesBg = this.add.image(0, topBg.height/ 2, 'wavesBg')
    this.topBar.add(wavesBg)

    var groupInfo = this.add.image(0, topBg.height/ 2, 'groupInfo')
    this.topBar.add(groupInfo)
  }

  loadGoldText () {
    var goldStr = '10';
    var node = this.add.text(170 - this.cameras.main.centerX, 33, goldStr, { fontFamily: 'Arial', fontSize: 32 });

    this.topBar.add(node);
    this.goldText = node;
    node.setOrigin(0, 0.5);
    // node.setPosition(100, 43);
  }

  loadGroupInfo () {
    var node = this.add.text(-75, this.topBar.height / 2 + 7, '1', { fontFamily: 'Arial', fontSize: 32 });
    this.topBar.add(node);
    this.groupText = node;

    var maxNode = this.add.text(node.x + 50, node.y, '20', { fontFamily: 'Arial', fontSize: 32 });
    this.topBar.add(maxNode);
  }

  loadTopButtons () {
    this.loadSpeedButton();
    this.loadPauseButton()
    this.loadMenuButton()
  }

  loadSpeedButton () {
    var node = this.add.image(220, 40, 'speed0')
    this.topBar.add(node);
  }

  loadPauseButton () {
    var node = this.add.image(320, 40, 'pause0')
    // node.setScale(0.2)
    this.topBar.add(node);
    // node.setPressedActionEnabled(true);
    // node.setZoomScale(0.2);
  }

  loadMenuButton () {
    var node = this.add.image(390, 40, 'menu').setInteractive()
    this.topBar.add(node);
    // 点击事件，显示菜单
    node.on('pointerdown', () => {
      // this.scene.pause()
      this.loadMenus()
    })
  }

  loadBottomBar () {
    this.bottomBar = this.add.container(this.cameras.main.centerX, this.cameras.main.height)
    var node = this.add.image(0, 0, 'bottomBg');
    
    this.bottomBar.add(node)
    node.setOrigin(0.5, 1);
  }

  loadMissionBg () {
    var node = this.add.image(205 - this.bottomBar.x, -25, 'advMissionBg')
    this.bottomBar.add(node)
  }

  loadBottomButtons () {
    var arr = [
      "bar_bomb_02",
      "bar_blood_02",
      "bar_speed_02",
      "bar_ice_02",
      "bar_slow_02"
    ]
    var nextPosX = -60;
    var offsetX = 10;
    var con;
    var bg;
    var button
    for (var i = 0; i < arr.length; i++) {
      con = this.add.container(nextPosX, -65)
      bg = this.add.image(0, -15, 'barBlank')
      bg.setOrigin(0.5, 0);
      con.add(bg)

      button = this.add.image(0, 20, arr[i])
      con.add(button)
      nextPosX += button.width + offsetX;
      this.bottomBar.add(con)
    }

    
  }

  loadMenus () {
    this.menuPanel = this.add.container(0, 0)
    var bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, '0x696969', 0.5)
    bg.setOrigin(0, 0)
    this.menuPanel.add(bg)

    // panel
    var advBg = this.add.image(this.cameras.main.centerX, 0, 'advMenuBg')
    advBg.setOrigin(0.5, 0)
    this.menuPanel.add(advBg)

    var levelString = this.add.text(0, 0, '01', { fontFamily: 'Arial', fontSize: 32 });
    levelString.setPosition(this.cameras.main.centerX - levelString.width / 2, 105)
    this.menuPanel.add(levelString)

    var btn = this.add.sprite(bg.width / 2, bg.height / 2 - 105, 'buttonGreen').setInteractive()
    this.menuPanel.add(btn)
    var btn1 = this.add.image(btn.x, btn.y, 'advMenuContinue')
    this.menuPanel.add(btn1)
    btn1.on('pointerdown', () => {
      this.continuePlay()
    })
  }

  removeMenus () {
    // this.scene.play()
    this.menuPanel.destroy()
  }

  continuePlay () {
    this.removeMenus()
  }
  loadTowerPanel (args) {
    var panel = new TowerPanel(this, 0, 0)

    panel.loadProperty(args)
    panel.setCallback(this.removeTower.bind(this))
    this.add.existing(panel)
    this.towerPanel = panel;
  }

  removeTower () {
    this.createTower(this.towerPanel)
    setTimeout(() => {
      this.towerPanel && this.towerPanel.destroyAll()
      this.towerPanel = null
    }, 200)
  }
  loadTouchWarning (x, y) {
    var warningSprite
    if (this.touchWarningNode !== null) {
      warningSprite = this.touchWarningNode
      this.tweens.stop()
    } else {
      warningSprite = this.add.sprite(x, y, 'warning')
    }
    // 
    warningSprite.setAlpha(1)

    this.tweens.add({
      delay: 400,
      targets: warningSprite,
      alpha: {warningSprite: 0, duration: 300, ease: 'Expo.easeOut'},
      onComplete: () => {
        warningSprite.destroy()
      }
    })
  }

  createTower (data) {
    console.log(data)
    let name = data.bot.name
    if (!name) {
      console.log('请确定武器名称')
      return ;
    }

    var towerData = {};
    towerData.name = name;
    towerData.x = data.x;
    towerData.y = data.y;
    console.log(data.x, data.y)
    var node = null;
    switch (name){
        case "bottle":
            towerData.scope = 300;
            towerData.bulletSpeed = 40;
            node = new TowerBase(this, data.x, data.y, towerData);
            node.setOverCallback(() => {
              this.loadNextGroupMonster()
            })
            break;
        default :
            console.log("GPMainLayer.createTower() : 异常");
            break;
    }

    // 属性设置
    if (node != null) {
        // 标记当前位置有塔
        this.tiledMapRectArrayMap[data.row][data.cel] = this.tiledMapRectMapEnemu.TOWER;
    }

    return node;
  }
  loadProperty () {
    this.ZOrderEnum.START        = 10;   // 起点标识
    this.ZOrderEnum.CARROT       = 0;    // 萝卜
    this.ZOrderEnum.MONSTER      = 20;   // 怪物
    this.ZOrderEnum.WAMING       = 30;   // 警告提示
    this.ZOrderEnum.TOWER_PANEL  = 50;   // 创建塔面板

    this.tiledMapRectMapEnemu.NONE      = 0;    // 空地
    this.tiledMapRectMapEnemu.ROAD      = 1;    // 道路
    this.tiledMapRectMapEnemu.SMALL     = 2;    // 小障碍物[占1格]
    this.tiledMapRectMapEnemu.LITTLE    = 3;    // 中障碍物[占2格]
    this.tiledMapRectMapEnemu.BIG       = 4;    // 大障碍物[占4格]
    this.tiledMapRectMapEnemu.INVALID   = 5;    // 无效区域
    this.tiledMapRectMapEnemu.TOWER     = 6;    // 塔
  }

  loadPath () {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'theme_bg_path')
  }

  loadTiledMap () {
    this.map = this.make.tilemap({ key: 'map' });

    var tiles = this.map.addTilesetImage('1', 'tiles');
    var tileHeight = tiles.tileHeight
    var tileWidth = tiles.tileWidth
    var layer = this.map.createStaticLayer(0, tiles, 0, 0);
    layer.setPosition(this.cameras.main.centerX - layer.width / 2, this.cameras.main.centerY - layer.height / 2)
    layer.setVisible(false)

    var objs = this.map.objects
    var finalOffsetX = 0;
    var finalOffsetY = 0;
    var offsetX = (this.cameras.main.width - this.map.widthInPixels) / 2;
    var offsetY = (this.map.heightInPixels ) / 2;

    for (let i = 0; i < objs.length; i ++) {
      let layer = objs[i];
      let groupName = layer.name;
      if (groupName === 'big') {
        finalOffsetX = offsetX;
        finalOffsetY = offsetY;
      } else if (groupName === 'little') {
        finalOffsetX = offsetX;
        finalOffsetY = offsetY + tileHeight / 2;
      } else if (groupName == "small"
      || groupName == "road"
      || groupName == "start_end"
      || groupName == "invalid") {
        finalOffsetX = offsetX + tileWidth / 2;
        finalOffsetY = offsetY + tileHeight / 2;
      } else {
        console.log('something wrong with the map')
      }

      layer.finalOffsetX = finalOffsetX
      layer.finalOffsetY = finalOffsetY
    }
  }

  loadStartButton () {
    var startBt = this.add.sprite(0, 0, 'start_bt')
    var objs = this.map.getObjectLayer('start_end')
    var obj = objs.objects[0]
    console.log(obj, objs)
    startBt.setPosition(obj.x + objs.finalOffsetX, obj.y)
  }

  loadEndButton () {
    var endBt = this.add.image(0, 0, 'end_sign_pic');
    var objs = this.map.getObjectLayer('start_end')
    var obj = objs.objects[1]
    console.log(obj, objs)
    endBt.setPosition(obj.x + objs.finalOffsetX, obj.y)
    this.carrot = endBt
  }

  loadBloodBg () {
    this.add.sprite(this.carrot.x + 75, this.carrot.y + 50, 'start_carrot_hp_bg')
  }

  loadBlood () {
    var config = {
      image: 'blood_number',
      width: 16,
      height: 22,
      chars: Phaser.GameObjects.RetroFont.TEXT_SET8,
      charsPerRow: 8,
      spacing: { x: 0, y: 0 }
    };

    this.cache.bitmapFont.add('blood_number', Phaser.GameObjects.RetroFont.Parse(this, config));
    this.healthText  = this.add.bitmapText(this.carrot.x + 42, this.carrot.y + 40, 'blood_number', this.healthValue + '');
  }

  loadCanTouchRect () {
    var mapWidth = this.map.width;
    var mapHeight = this.map.height;
    var winSize = this.cameras.main;
    var nextPosX = (winSize.width - this.map.widthInPixels) / 2 + this.map.tileWidth / 2;
    var nextPosY = (winSize.height - this.map.heightInPixels) / 2 + this.map.tileHeight / 2;

    for (var i = 0; i < mapHeight; i++) {
      this.tiledMapRectArray[i] = [];
      for (var j = 0; j < mapWidth; j++) {
          // 空地
          this.tiledMapRectArray[i][j] = new Phaser.Geom.Rectangle(nextPosX - this.map.tileWidth / 2, nextPosY - this.map.tileHeight / 2, this.map.tileWidth, this.map.tileHeight);

          //node = new cc.Sprite();
          //this.addChild(node, 200);
          //node.setTextureRect(cc.rect(0, 0, tileSize.width - 2, tileSize.height - 2));
          //node.setColor(cc.color(122, 122, 255));
          //node.setPosition(nextPosX, nextPosY);
          //node.setOpacity(120);

          nextPosX += this.map.tileWidth;
      }

      nextPosX = (winSize.width - this.map.widthInPixels) / 2 + this.map.tileHeight / 2;
      nextPosY += this.map.tileHeight;
    }
    console.log(this.tiledMapRectArray)
  }

  loadTiledMapRectArrayMap () {
    var i;
    let tileHeight = this.map.tileHeight
    let tileWidth = this.map.tileWidth
    for (i = 0; i < tileHeight; i++) {
        this.tiledMapRectArrayMap[i] = [];
        for (var j = 0; j < tileWidth; j++) {
            this.tiledMapRectArrayMap[i][j] = this.tiledMapRectMapEnemu.NONE;
        }
    }
  }

  //  offset 被去掉，不知道是否会影响显示
  loadRoadPointArray () {
    this.roadPointArray = [];
    var roadGroup = this.map.getObjectLayer("road");
    var roads = roadGroup.objects;
    var diff = (this.cameras.main.width - this.map.widthInPixels) /2

    for (var i = 0; i < roads.length; i++) {
        this.roadPointArray.push(new Phaser.Geom.Rectangle(roads[i].x + diff, roads[i].y));
    }
  }

  loadObstacle () {
    this.loadSmallObstacle()
    this.loadLittleObstacle()
    this.loadBigObstacle()
    this.loadInvalidRect()
  }

  loadSmallObstacle () {
    var smallGroup = this.map.getObjectLayer("small");
    var smalls = smallGroup.objects;
    var node = null;
    var info = null;
    for (var i = 0; i < smalls.length; i++) {

        node = this.add.sprite(smalls[i].x + 147, smalls[i].y + 50, smalls[i].name)


        info = this.getInfoFromMapByPos(node.x, node.y);
        this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnemu.SMALL;
    }
  }

  loadLittleObstacle (){
    var littleGroup = this.map.getObjectLayer("little");
    var objs = littleGroup.objects;
    var node = null;
    var info = null;
    for (var i = 0; i < objs.length; i++) {
      node = this.add.sprite(objs[i].x + 110, objs[i].y + 40, objs[i].name)


      info = this.getInfoFromMapByPos(node.x, node.y);
      this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnemu.LITTLE;
      this.tiledMapRectArrayMap[info.row][info.cel - 1] = this.tiledMapRectMapEnemu.LITTLE;
    }
  }

  loadBigObstacle () {
    var bigGroup = this.map.getObjectLayer("big");
    var objs = bigGroup.objects;
    var node = null;
    var info = null;
    for (var i = 0; i < objs.length; i++) {
      node = this.add.sprite(objs[i].x + 100, objs[i].y + 80, objs[i].name)

        info = this.getInfoFromMapByPos(node.x, node.y);
        this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnemu.BIG;
        this.tiledMapRectArrayMap[info.row][info.cel - 1] = this.tiledMapRectMapEnemu.BIG;
        this.tiledMapRectArrayMap[info.row - 1][info.cel] = this.tiledMapRectMapEnemu.BIG;
        this.tiledMapRectArrayMap[info.row - 1][info.cel - 1] = this.tiledMapRectMapEnemu.BIG;
    }
  }

  loadInvalidRect () {
    var invalidGroup = this.map.getObjectLayer("invalid");
    var invalids = invalidGroup.objects;
    var data = null;
    var info = null;
    for (var i = 0; i < invalids.length; i++) {
        data = invalids[i];
        // data.x += invalidGroup.getPositionOffset().x;
        // data.y += invalidGroup.getPositionOffset().y;

        info = this.getInfoFromMapByPos(data.x, data.y);
        if (info.isInMap) {
          this.tiledMapRectArrayMap[info.row][info.cel] = this.tiledMapRectMapEnemu.INVALID;
        }
        
    }
  }
  // 根据坐标获取在地图中的信息
  getInfoFromMapByPos (x, y){
    if (y === undefined) {
      console.log("GPMainLayer.getInfoFromMapByPos(): Y坐标不能为空！")
    }

    var isInMap = false;
    var index = {
        x : -1,
        y : -1
    };
    var rect = null;
    for (var i = 0; i < this.tiledMapRectArray.length; i++) {
        for (var j = 0; j < this.tiledMapRectArray[i].length; j++) {
            rect = this.tiledMapRectArray[i][j];
            if (Phaser.Geom.Rectangle.ContainsPoint(rect, new Phaser.Geom.Point(x, y))) {
                index.row = i;
                index.cel = j;
                index.x = rect.x;
                index.y = rect.y;
                isInMap = true;
                // console.log("GPMainLayer.getInfoFromMapByPos() : rect is ", rect);
            }
        }
    }

    return {
        isInMap : isInMap,
        row : index.row,  // 行
        cel : index.cel,  // 列
        x : index.x,
        y : index.y
    };
  }

  loadRoadMap () {
    var roadGroup = this.map.getObjectLayer("road");
    var roads = roadGroup.objects;
    var diff = (this.cameras.main.width - this.map.widthInPixels) / 2
    var currPoint = null;
    var nextPoint = null;
    var offsetCount = 0;
    var info = null;
    var j = 0;
    for (var i = 0; i < roads.length - 1; i++) {
        currPoint = new Phaser.Geom.Rectangle(roads[i].x + diff, roads[i].y);
        nextPoint = new Phaser.Geom.Rectangle(roads[i + 1].x + diff, roads[i + 1].y);

        info = this.getInfoFromMapByPos(currPoint.x, currPoint.y);

        if (currPoint.y == nextPoint.y) {   // X 轴方向
            offsetCount = Math.abs(nextPoint.x - currPoint.x) / this.map.tileWidth + 1;
            // X 轴方向[向左]
            if (currPoint.x > nextPoint.x) {
                for (j = 0; j < offsetCount; j++) {
                    this.tiledMapRectArrayMap[info.row][info.cel - j] = this.tiledMapRectMapEnemu.ROAD;
                }
            }else{   // X 轴方向[向右]
                for (j = 0; j < offsetCount; j++) {
                    this.tiledMapRectArrayMap[info.row][info.cel + j] = this.tiledMapRectMapEnemu.ROAD;
                }
            }
        }else{   // Y 轴方向
            offsetCount = Math.abs(nextPoint.y - currPoint.y) / this.map.tileHeight + 1;
            // Y 轴方向[向下]
            if (currPoint.y > nextPoint.y){
                for (j = 0; j < offsetCount; j++) {
                    this.tiledMapRectArrayMap[info.row - j][info.cel ] = this.tiledMapRectMapEnemu.ROAD;
                }
            }else{   // Y 轴方向[向上]
                for (j = 0; j < offsetCount; j++) {
                    this.tiledMapRectArrayMap[info.row + j][info.cel ] = this.tiledMapRectMapEnemu.ROAD;
                }
            }
        }
    }

    // console.log(this.tiledMapRectArrayMap)
  }

  loadNextGroupMonster () {
    var timedEvent = this.time.addEvent({ delay: 1000, callback: this.createMonster, callbackScope: this, repeat: 4 });

  }

  createMonster() {
    var monsterData = {
      road : this.roadPointArray,
      speed : 0.1,
      index : 0
    };
    // var monster = new Monster(this, 264, 250, 'theme', 'Theme1/Monster/L11.png')
    var monster = new Monster(this, 264, 250, 'Monster_L11.png')
    // this.physics.add.existing(monster, false)
    monster.setPosition(this.roadPointArray[0].x, this.roadPointArray[0].y);

    monster.setData(monsterData)
    monster.setKill((val) => {
      
      this.healthValue = Math.floor(this.healthValue - val)
      console.log(this.healthValue)
      this.healthText.setText(this.healthValue + '')
    })
    monster.run()
    this.add.existing(monster);
    
    // monster.setActive(true);
    // monster.setVisible(true);
    this.monsters.add(monster)
  }
  update () {}
}