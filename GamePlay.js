class gamePlayScene extends Phaser.Scene {
  constructor ()
  {
      // super('game_play');
      super();
      this.ZOrderEnum = {};
      this.tiledMapRectMapEnemu = {};
      this.tiledMapRectArray = [];
      this.tiledMapRectArrayMap = [];
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

    this.loadBackground()
    this.loadMain()
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
    this.add.bitmapText(this.carrot.x + 42, this.carrot.y + 40, 'blood_number', '10');
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

    monster.setPosition(this.roadPointArray[0].x, this.roadPointArray[0].y);

    monster.setData(monsterData)
    monster.run()
    this.add.existing(monster);
  }
  update () {}
}