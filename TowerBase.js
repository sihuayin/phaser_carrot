class TowerBase {
  constructor (scene, x, y, config) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.config = config;

    this.bulletSpeed = 10;
    this.bulletMoveTime = 0;
    this.nearestEnemy = null;
    this.fireTargetPos = new Phaser.Geom.Point(0, 0)
    this.weapon = null;
    this.row = -1;
    this.cel = -1;

    this.container = scene.add.container(0, 0)
    let bg = scene.add.sprite(x, y, 'Bottle3')
    this.container.add(bg)
    
    // this.loadProperty(config);
    this.loadWeapon();
  }

  loadProperty (config) {
    if (config.scope <= 0) {
      console.log('TowerBase.loadProperty() : scope必须大于0！');
      return ;
    }

    if (config.bulletSpeed <= 0) {
      console.log('TowerBase.loadProperty() : bulletSpeed必须大于0！')
      return ;
    }

    this.scope = config.scope;
    this.bulletSpeed = config.bulletSpeed;
    this.bulletMoveTime = 100 / this.bulletSpeed;
    this.setPosition(this.x, this.y)
    this.setName(config.name)
  }

  loadWeapon () {
    var node = new Bottle(this.scene, this.x, this.y, this.config)
    this.scene.add.existing(node)
    this.container.add(node)
    this.weapon = node
  }

  setOverCallback(callback) {
    this.weapon.setOverCallback(callback)
  }
  findNearestMonster () {
    // var monsterArray = GameManager.currMonsterPool;
    // var currMinDistant = this.scope;
    // var nearestEnemy = null;
    // var monster = null;
    // var distance = 0;
    // for (var i = 0; i < monsterArray.length; i++) {
    //     for (var j = 0; j < monsterArray[i].length; j++){
    //         monster = monsterArray[i][j];
    //         distance = cc.pDistance(this.getPosition(), monster.getPosition());
    //         if (distance < currMinDistant) {
    //             currMinDistant = distance;
    //             nearestEnemy = monster;
    //         }
    //     }
    // }
    // this.nearestEnemy = nearestEnemy;
    // return nearestEnemy;
  }

  onFire () {
    cc.warn("TowerBase.onFire() : 请重写此方法！");
  }
  getCel () {
      return this.cel;
  }
  setCel (cel) {
      this.cel = cel;
  }
  getRow () {
      return this.row;
  }
  setRow (row) {
      this.row = row;
  }
  getWeapon () { // 只读
      return this.weapon;
  }

}