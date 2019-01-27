class gamePlayScene extends Phaser.Scene {
  constructor ()
  {
      // super('game_play');
      super();
      this.ZOrderEnum = {};
      this.tiledMapRectMapEnemu = {};
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
  update () {}
}