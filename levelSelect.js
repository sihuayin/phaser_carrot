var controls

class levelSelect  extends Phaser.Scene  {

  preload () {
    this.load.tilemapTiledJSON('map', 'res/ChooseLevel/Map/TiledMap.json');
    // res/ChooseLevel/Map/stage_map_" + i + ".png
    for (var i = 0; i < 14; i++) {
      this.load.image(`stage_map_${i}`, "res/ChooseLevel/Map/stage_map_" + i + ".png");
    }

    for (var i = 1; i < 135; i++) {
      this.load.image(`route_${i}`, "res/ChooseLevel/Route/route_" + i + ".png");
    }

    this.load.image('choose_level_adv','res/ChooseLevel/stagepoint_adv.png')
    this.load.image('choose_level_boss', 'res/ChooseLevel/stagepoint_gate.png')
    this.load.image('choose_level_time', 'res/ChooseLevel/stagepoint_time.png')
    this.load.image('choose_level_chance', 'res/ChooseLevel/stagepoint_chance.png')
    this.load.image('choose_level_leftbg', 'res/ChooseLevel/stagemap_toolbar_leftbg.png')
    this.load.image('choose_level_home_button', 'res/ChooseLevel/stagemap_toolbar_home.png')
    this.load.image('choose_level_shop_button', 'res/ChooseLevel/stagemap_toolbar_shop.png')
    this.load.image('choose_level_ranking_button', 'res/ChooseLevel/stagemap_toolbar_leaderboard.png')
    this.load.image('choose_level_discount', 'res/ChooseLevel/zh/discount_tag_stone.png')
    this.load.image('numbers', 'res/ChooseLevel/discount.png');
    this.load.image('choose_level_rightbg', 'res/ChooseLevel/stagemap_toolbar_rightbg.png')
    this.load.image('choose_level_overten', 'res/ChooseLevel/zh/stagemap_toolbar_overten.png')
    this.load.image('level_effect', 'res/ChooseLevel/stagemap_local.png')
  }
  create () {
    // todo 判断 BGMusic 音乐是否播放，如果没有 那么开始播放
    let nextPosX = 0
    var cam = this.cameras.main;
    var map = this.add.tilemap('map')
    var tiles = []

    this.bgContainer = this.add.container(0, 0)
    
    for (var i = 0; i < 14; i++) {
      var tile = map.addTilesetImage(`stage_map_${i}`);
      tiles.push(tile)
      let imageView = this.add.sprite(0, 0, `stage_map_${i}`).setInteractive({ draggable: true })
      imageView.setOrigin(0, 0.5)
      imageView.setPosition(nextPosX, this.cameras.main.height / 2);
      this.bgContainer.add(imageView);
      
      
      nextPosX += imageView.width;
    }
    // this.bgContainer.setSize(nextPosX, this.cameras.main.height)
    this.cameras.main.setBounds(0, 0, nextPosX, this.cameras.main.height);
    var cursors = this.input.keyboard.createCursorKeys();
    var layer = map.getObjectLayer('point');

    var controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      acceleration: 0.04,
      drag: 0.0005,
      maxSpeed: 1.0
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    
    this.loadRoute(2)
    // this.input.on('dragstart', function (arg) {
    //   console.log(arg)
    // })

    // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    //   console.log(cam, dragX, dragY)
      
    //   cam.setScroll(cam.scrollX - dragX);
    //   // cam.scrollX = -dragX
    //   console.log(cam.x, cam.y)
    // })


    // this.input.on('dragend', function (arg) {
    //   console.log(arg)
    // })
    this.buttonContainer = this.add.container(0, 0)
    this.buttonContainer.setDepth(10)
    let objs = layer.objects;
    for (var i = 0; i < objs.length; i++) {
        var button = this.add.sprite(0,0, 'choose_level_adv').setInteractive();
        // this.scorllView.addChild(button, this.zOrderMap.levelButton, i);
        // this.routeButtonArray.push(button);

        // 编辑器中配置的属性
        if (objs[i].isBoos == "YES") {
          button.setTexture('choose_level_boss')
        }else if (objs[i].isTime == "YES") {
          button.setTexture('choose_level_time')
        }else if (objs[i].isChange == "YES"){
          button.setTexture('choose_level_chance')
        }

        button.setPosition(objs[i].x, objs[i].y);
        this.buttonContainer.add(button);
        ((i) => {
          button.on('pointerdown', (a, b ,c ,d) => { 
            console.log(i, a, b, c, d)
            // 停止音乐
            // 关卡设置
            // 进入不同等级的游戏
            this.scene.stop();
            this.scene.start('game_play');
          }, this)
        })(i)
        
        // button.setTag(i);
        // button.addTouchEventListener(this.onLevelButtonEvent, this);
    }
    this.loadLevelEffects(2);

    this.loadUI()
  }

  loadLevel(level) {
    this.loadRoute(level)
    this.loadLevelEffects(level)
  }

  loadRoute (level) {
    for (let i = 0; i < level - 1; i ++) {
      var route = this.add.sprite(0, 0, 'route_' + (i + 1))
      if (i %10 == 9) {
        route.setOrigin(0, 0.5)
      }

      route.x = route.width / 2 + Math.floor(i / 10) * route.width;
      route.y = this.cameras.main.height / 2
    }
  }

  loadLevelEffects (level) {
    var button = this.buttonContainer.getAt(level-1)
    
    for (var i = 0; i < 3; i++) {
      this.time.delayedCall(250 * i, () => {
    //     console.log(i)
        var effect = new LevelEffect(this, button.x, button.y)
        
        this.add.existing(effect)
      }, [], this);
    }
    
  }

  loadUI () {
    this.leftContainer = this.add.container(0, 0)
    let leftPanle = this.add.image(0, 0, 'choose_level_leftbg')
    leftPanle.setOrigin(0, 0)
    this.leftContainer.add(leftPanle)

    this.addHomeButton()
    this.addShopButton()
    this.addRankingButton()
    this.loadDiscountButton();
    this.loadLifeStar()
  }

  addHomeButton() {
    let homeButton = this.add.sprite(0, 0, 'choose_level_home_button').setInteractive()
    // homeButton.setScale(0.2, 0.2)
    homeButton.setOrigin(0, 0)
    homeButton.setPosition(10, 0)
    homeButton.on('pointerdown', () => {
      // this.sence.run()
    });

    this.leftContainer.add(homeButton)
  }

  addShopButton () {
    let shopButton = this.add.sprite(0, 0, 'choose_level_shop_button').setInteractive()
    shopButton.setOrigin(0, 0)
    shopButton.setPosition(111, 0)
    shopButton.on('pointerdown', () => {
      // this.sence.run()
    });

    this.leftContainer.add(shopButton)
  }

  addRankingButton () {
    let rankingButton = this.add.sprite(0, 0, 'choose_level_ranking_button').setInteractive()
    rankingButton.setOrigin(0, 0)
    rankingButton.setPosition(212, 0)
    rankingButton.on('pointerdown', () => {
      // this.sence.run()
    });

    this.leftContainer.add(rankingButton)
  }

  loadDiscountButton () {
    this.midContainer = this.add.container(0, 0)
    var discount = this.add.sprite(this.cameras.main.centerX, 0, 'choose_level_discount').setInteractive()
    discount.setOrigin(0.5, 0)
    discount.on('pointerdown', () => {
      console.log('cu xiao')
    })

    this.midContainer.add(discount)
    var config = {
      image: 'numbers',
      width: 24,
      height: 30,
      chars: Phaser.GameObjects.RetroFont.TEXT_SET8,
      charsPerRow: 8,
      spacing: { x: 0, y: 0 }
    };

    this.cache.bitmapFont.add('numbers', Phaser.GameObjects.RetroFont.Parse(this, config));
    var dynamic = this.add.bitmapText(this.cameras.main.centerX + 35, 15, 'numbers', '7');
    dynamic.setOrigin(0, 0)
    this.midContainer.add(dynamic)
  }

  loadLifeStar() {
    let bt = this.add.sprite(0, 0, 'choose_level_rightbg')
    bt.setOrigin(1, 0)
    bt.setPosition(this.cameras.main.width , 0)
    bt.on('pointerdown', () => {
      console.log('leell')
    })
    let starImage = this.add.image(0, 0, 'choose_level_overten')
    starImage.setOrigin(1, 0)
    starImage.setPosition(this.cameras.main.width, 0);

    let text = this.add.text(this.cameras.main.width - 60, 0, '010').setFontFamily('Arial').setFontSize(24)
    text.setOrigin(1, 0)
  }
  update (time, delta) {
    controls.update(delta);
  }
}