class Bottle extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, config) {
    super(scene, x, y, config)
    
    this.scene = scene

    // scene.sys.add.existing(this);
    // scene.sys.arcadePhysics.add.existing(this, true);
    this.setPosition(x, y)
    this.setTexture('Bottle31')
    this.angle = 0
    this.scope = config.scope || 0;
    this.x = x;
    this.y = y;
    this.onOver = () => {}

    // this.bullets = scene.add.group({
    //   classType: Bullet,
    //   maxSize: 10,
    //   runChildUpdate: true
    // });
    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true
    })

    // 碰撞
    this.scene.physics.add.collider(this.scene.monsters, this.bullets, this.hitBrick, null, this);
    // this.con.add(node)
    this.timedEvent = scene.time.addEvent({ delay: 500, callback: this.onRotateAndFire, callbackScope: this, loop: true });
  }

  setOverCallback (callback) {
    this.onOver = callback
  }

  hitBrick (monster, bullet)
  {
    console.log()
    bullet.destroy()
    // bullet.disableBody(true, true)
      monster.destroy()
    if (this.scene.monsters.children.size <= 0) {
      this.onOver && this.onOver()
    }
  }

  onRotateAndFire () {
    var nearestEnemy =  this.findNearestMonster();
    if (nearestEnemy != null){
      // this.weapon.stopAllActions();

      // this.fireTargetPos = nearestEnemy.getPosition();
      var point1 = new Phaser.Geom.Point(nearestEnemy.x, nearestEnemy.y)
      var point2 = new Phaser.Geom.Point(this.x, this.y)
      var angle = Phaser.Math.Angle.BetweenPoints(point1, point2);


      var speed = 1 / Phaser.Math.PI2;
      // rotateDuration表示旋转特定的角度需要的时间，计算它用弧度乘以速度。
      var rotateDuration = Math.abs(angle * speed);

      this.scene.tweens.add({
        delay: 10,
        targets: this,
        angle: {value: angle, duration: rotateDuration, ease: 'Expo.easeOut'},
        onComplete: () => {
          // warningSprite.destroy()
          this.onFire(nearestEnemy)
        }
      })
    }
  }

  onFire (annearestEnemygle) {

    var bullet = this.bullets.get();
        if (bullet)
        {
          // bullet.destroy()
          bullet.setPosition(this.x, this.y);
          bullet.rotation = this.scene.physics.moveToObject(bullet, annearestEnemygle, 1000, 500);
           
            // bullet.angle = angle
            // lastFired = time + 50;
        }
  }

  findNearestMonster () {
    // console.log(this.scene.monsters)
    var monsterArray = this.scene.monsters.getChildren();
    var currMinDistant = this.scope;
    var nearestEnemy = null;
    var monster = null;
    var distance = 0;
    for (var i = 0; i < monsterArray.length; i++) {
      monster = monsterArray[i];
      distance = Phaser.Math.Distance.Between(this.x, this.y, monster.x, monster.y);
      if (distance < currMinDistant) {
          currMinDistant = distance;
          nearestEnemy = monster;
      }
        
    }
    this.nearestEnemy = nearestEnemy;
    return nearestEnemy;
  }
}