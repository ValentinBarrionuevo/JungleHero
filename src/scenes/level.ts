import Phaser from "phaser";

import { sharedInstance as events } from "./EventCenter";
import { Player } from "../classes/player";

import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyARSNAWgFK3Q_bDapfLbMRfeNrQ0VqvvZ8",
  authDomain: "junglehero-bd085.firebaseapp.com",
  databaseURL: "https://junglehero-bd085-default-rtdb.firebaseio.com/",
  projectId: "junglehero-bd085",
  storageBucket: "junglehero-bd085.appspot.com",
  messagingSenderId: "692131404389",
  appId: "1:692131404389:web:a3334116cd929118cf048c",
};

export class Level extends Phaser.Scene {
  private idData;
  private numberId;
  private textId;
  private db;
  private player!: Player;
  private tileset;
  private groundLayer;
  private objectsLayer;
  private map;
  private cage;
  private cageShadow;
  private cageAnimal;
  private cage2;
  private cageShadow2;
  private cageAnimal2;
  private cage3;
  private cageShadow3;
  private cageAnimal3;
  private cage4;
  private cageX;
  private cageY;
  private cageShadow4;
  private cageAnimal4;
  private carpi;
  private carpi2;
  private carpi3;
  private voids;
  private finishLine;
  private babyCarpincho;
  private babyCarpincho2;
  private babyCarpincho3;
  private babyCarpincho4;
  private babyCarpincho5;
  private babyCarpincho6;
  private babyCarpincho7;
  private hudJump;
  private key;
  private spikes;
  private stone;
  private stone2;
  private stealth = false;
  private xcheckpoint;
  private ycheckpoint;
  private xSpawn;
  private ySpawn;

  private bottomBackground;
  private topBackground;

  private bird = false;
  private canguro = false;
  private oso = false;
  private felino = false;

  constructor() {
    super("level-1-scene");
  }

  create() {
    this.scene.run("ui-scene");

    this.initAnimations();
    this.initMap();
    this.initCage();
    this.initOverlaps();
    this.initObstacles();
    this.initListeners();

    this.initCarpincho();

    this.initCollectables();
    this.initPlayer();
    this.initGrass();
    this.initCamera();
    this.initNumberId();

    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(this.player, this.stone);
    this.physics.add.collider(this.player, this.stone2);

    // Overlap jaulas
    this.physics.add.overlap(this.player, this.cage, () => {
      if (this.bird == false) {
        events.emit("cage1");
      }
    });
    this.physics.add.overlap(this.player, this.cage2, () => {
      if (this.canguro == false) {
        events.emit("cage2");
      }
    });
    this.physics.add.overlap(this.player, this.cage3, () => {
      if (this.oso == false) {
        events.emit("cage3");
      }
    });
    this.physics.add.overlap(this.player, this.cage4, () => {
      if (this.felino == false) {
        events.emit("cage4");
      }
    });

    // Overlap spikes
    this.physics.add.overlap(this.player, this.spikes, () => {
      if (this.stealth == false) {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.physics.pause();

        this.cameras.main.fadeOut(500);
        this.scene.scene.time.addEvent({
          delay: 500,
          callback: () => {
            this.physics.resume();
            this.cameras.main.fadeIn(700);
            this.player.x = this.xcheckpoint;
            this.player.y = this.ycheckpoint;
          },
        });
      }
    });

    // Overlap carpinchos
    this.physics.add.overlap(this.player, this.carpi, () => {
      events.emit("carpi1");
    });
    this.physics.add.overlap(this.player, this.carpi2, () => {
      events.emit("carpi2");
    });
    this.physics.add.overlap(this.player, this.carpi3, () => {
      events.emit("carpi3");
    });

    // Overlap Collecionables
    this.physics.add.overlap(this.player, this.key, () => {
      this.key.destroy();
      events.emit("keyCollected");
    });

    this.physics.add.overlap(this.player, this.babyCarpincho, () => {
      this.babyCarpincho.destroy();
      events.emit("babyCollected");
    });
    this.physics.add.overlap(this.player, this.babyCarpincho2, () => {
      this.babyCarpincho2.destroy();
      events.emit("babyCollected");
    });
    this.physics.add.overlap(this.player, this.babyCarpincho3, () => {
      this.babyCarpincho3.destroy();
      events.emit("babyCollected");
    });
    this.physics.add.overlap(this.player, this.babyCarpincho4, () => {
      this.babyCarpincho4.destroy();
      events.emit("babyCollected");
    });
    this.physics.add.overlap(this.player, this.babyCarpincho5, () => {
      this.babyCarpincho5.destroy();
      events.emit("babyCollected");
    });
    this.physics.add.overlap(this.player, this.babyCarpincho6, () => {
      this.babyCarpincho6.destroy();
      events.emit("babyCollected");
    });
    this.physics.add.overlap(this.player, this.babyCarpincho7, () => {
      this.babyCarpincho7.destroy();
      events.emit("babyCollected");
    });

    // Overlap voids
    this.physics.add.overlap(this.player, this.voids, () => {
      events.emit("void");
      console.log("void");
    });

    // Overlap Finish
    this.physics.add.overlap(this.player, this.finishLine, () => {
      this.cameras.main.fadeOut(1000);
      this.physics.pause();
      this.scene.scene.time.addEvent({
        delay: 1000,
        callback: () => {
          this.scene.stop();
          this.scene.stop("ui-scene");
          this.scene.start("finalScene");
        },
      });
    });

    // Overlap hudJump
    this.physics.add.overlap(this.player, this.hudJump, () => {
      if (this.canguro == true) {
        events.emit("hudJump");
        this.cageAnimal2.destroy();
      }
    });
  }

  update() {
    this.player.update(1);
    this.cameraUpdate();
    this.uiUpdate();
  }

  private initNumberId() {
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.database();
    this.numberId = Phaser.Math.Between(1000, 9999).toString();
    this.idData = { userId: this.numberId };

    console.log(this.idData);

    var ref = this.db.ref("users");
    ref.push(this.idData);

    this.textId = this.add.text(
      this.player.x,
      this.player.y,
      "ID " + this.numberId,
      {
        fontSize: "25px",
        fontFamily: "font1",
      }
    );
  }

  private initMap() {
    this.bottomBackground = this.add
      .tileSprite(0, 1280, 2560, 1280, "levelBackground")
      .setOrigin(0)
      .setScrollFactor(0, 1);
    this.topBackground = this.add
      .tileSprite(0, 0, 2560, 1280, "levelBackground")
      .setOrigin(0)
      .setScrollFactor(0, 1);
    this.map = this.make.tilemap({
      key: "tiledMap",
      tileWidth: 64,
      tileHeight: 64,
    });
    this.tileset = this.map.addTilesetImage("tiles", "tiles");
    this.groundLayer = this.map.createLayer("tileLayer", this.tileset);
    this.map.createLayer("detailsLayer", this.tileset);
    this.groundLayer.setCollisionByProperty({ collides: true });

    this.physics.world.setBounds(
      0,
      0,
      this.groundLayer.width,
      this.groundLayer.height
    );

    this.objectsLayer = this.map.getObjectLayer("objectLayer");
  }

  private initGrass() {
    this.map.createLayer("grassLayer", this.tileset);
  }

  private initPlayer() {
    this.objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "Player": {
          this.xSpawn = x;
          this.ySpawn = y;
          this.player = new Player(this, x, y);
          break;
        }
      }
    });
  }

  private initCage() {
    this.objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "Cage": {
          this.add.image(x, y, "jaulaAtras").setOrigin(0);
          this.cageAnimal = this.add.image(x + 130, y + 150, "bird");
          this.cageShadow = this.add
            .image(x, y, "jaulaSombra")
            .setOrigin(0)
            .setAlpha(0.5);
          this.cage = this.physics.add
            .staticImage(x, y, "jaulaAdelante")
            .setOrigin(0)
            .refreshBody();

          break;
        }
        case "Cage2": {
          this.add.image(x, y, "jaulaAtras").setOrigin(0);
          this.cageAnimal2 = this.add.image(x + 130, y + 154, "canguro");
          this.cageShadow2 = this.add
            .image(x, y, "jaulaSombra")
            .setOrigin(0)
            .setAlpha(0.5);
          this.cage2 = this.physics.add
            .staticImage(x, y, "jaulaAdelante")
            .setOrigin(0)
            .refreshBody();
          break;
        }
        case "Cage3": {
          this.add.image(x, y, "jaulaAtras").setOrigin(0);
          this.cageAnimal3 = this.add.image(x + 130, y + 154, "oso");
          this.cageShadow3 = this.add
            .image(x, y, "jaulaSombra")
            .setOrigin(0)
            .setAlpha(0.5);
          this.cage3 = this.physics.add
            .staticImage(x, y, "jaulaAdelante")
            .setOrigin(0)
            .refreshBody();
          break;
        }
        case "Cage4": {
          this.cageX = x;
          this.cageY = y;
          this.add.image(x, y, "jaulaAtras").setOrigin(0);
          this.cageAnimal4 = this.add.image(x + 130, y + 154, "panther");
          this.cageShadow4 = this.add
            .image(x, y, "jaulaSombra")
            .setOrigin(0)
            .setAlpha(0.5);
          this.cage4 = this.physics.add
            .staticImage(x, y, "jaulaAdelante")
            .setOrigin(0)
            .refreshBody();
          break;
        }
      }
    });
  }

  private initCarpincho() {
    this.objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "Carpincho": {
          this.carpi = this.physics.add.sprite(x, y, "carpincho").setOrigin(0);

          this.carpi.body.setAllowGravity(false);
          this.carpi.anims.play("carpinchoIdle");
          break;
        }
        case "Carpincho2": {
          this.carpi2 = this.physics.add.sprite(x, y, "carpincho").setOrigin(0);

          this.carpi2.body.setAllowGravity(false);
          this.carpi2.anims.play("carpinchoIdle");

          break;
        }
        case "Carpincho3": {
          this.carpi3 = this.physics.add.sprite(x, y, "carpincho").setOrigin(0);

          this.carpi3.body.setAllowGravity(false);
          this.carpi3.anims.play("carpinchoIdle");

          break;
        }
      }
    });
  }
  private initOverlaps() {
    this.voids = this.physics.add.staticGroup();

    this.objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "Nada": {
          this.voids.create(x, y, "stealth").setAlpha(0.001);
          break;
        }
        case "Finish": {
          this.finishLine = this.physics.add
            .staticImage(x, y, "black")
            .setScale(1, 9)
            .setOrigin(0)
            .refreshBody();
          break;
        }
        case "hudJump": {
          this.hudJump = this.physics.add
            .staticImage(x, y, "black")
            .setScale(6, 1)
            .setOrigin(0)
            .setAlpha(0.001)
            .refreshBody();
          break;
        }
      }
    });
  }

  private initCollectables() {
    this.objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "Key": {
          this.key = this.physics.add
            .staticImage(x, y, "key")
            .setOrigin(0)
            .refreshBody();
          break;
        }
        case "babyCarpincho": {
          this.babyCarpincho = this.physics.add
            .staticImage(x, y, "babyCarpincho")
            .setScale(0.7)
            .setOrigin(0.3)
            .refreshBody();
          break;
        }
        case "babyCarpincho2": {
          this.babyCarpincho2 = this.physics.add
            .staticImage(x, y, "babyCarpincho")
            .setScale(0.7)
            .setOrigin(0.3)
            .refreshBody();
          break;
        }
        case "babyCarpincho3": {
          this.babyCarpincho3 = this.physics.add
            .staticImage(x, y, "babyCarpincho")
            .setScale(0.7)
            .setOrigin(0.3)
            .refreshBody();
          break;
        }
        case "babyCarpincho4": {
          this.babyCarpincho4 = this.physics.add
            .staticImage(x, y, "babyCarpincho")
            .setScale(0.7)
            .setOrigin(0.3)
            .refreshBody();
          break;
        }
        case "babyCarpincho5": {
          this.babyCarpincho5 = this.physics.add
            .staticImage(x, y, "babyCarpincho")
            .setScale(0.7)
            .setOrigin(0.3)
            .refreshBody();
          break;
        }
        case "babyCarpincho6": {
          this.babyCarpincho6 = this.physics.add
            .staticImage(x, y, "babyCarpincho")
            .setScale(0.7)
            .setOrigin(0.3)
            .refreshBody();
          break;
        }
        case "babyCarpincho7": {
          this.babyCarpincho7 = this.physics.add
            .staticImage(x, y, "babyCarpincho")
            .setScale(0.7)
            .setOrigin(0.3)
            .refreshBody();
          break;
        }
      }
    });
  }

  private initObstacles() {
    this.spikes = this.physics.add.staticGroup();

    this.objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "Stealth": {
          this.spikes
            .create(x, y, "stealth")
            .setAlpha(0.001)
            .setOrigin(0)
            .refreshBody();
          break;
        }
        case "Stone": {
          this.stone = this.physics.add
            .staticImage(x, y, "stone")
            .setOrigin(0.5)
            .refreshBody();
          break;
        }
        case "Stone2": {
          this.stone2 = this.physics.add
            .staticImage(x, y, "stone")
            .setOrigin(0.5)
            .refreshBody();
          break;
        }
      }
    });
  }

  private initListeners() {
    events.on("bird", this.birdF, this);
    events.on("canguro", this.canguroF, this);
    events.on("oso", this.osoF, this);

    events.on("felino", this.felinoF, this);

    events.on(
      "pausa",
      () => {
        this.physics.pause();
        this.scene.run("pausaScene");
      },
      this
    );
    events.on(
      "pausaNo",
      () => {
        this.scene.stop("pausaScene");
        this.physics.resume();
      },
      this
    );

    events.on(
      "stealth",
      () => {
        this.stealth = true;
      },
      this
    );

    events.on(
      "noisy",
      () => {
        this.stealth = false;
      },
      this
    );
  }

  private birdF() {
    this.bird = true;
    this.cage.y -= 125;
    this.cageShadow.setAlpha(0.4);
  }
  private canguroF() {
    this.canguro = true;
    this.cage2.y -= 125;
    this.cageShadow2.setAlpha(0.4);
  }
  private osoF() {
    this.oso = true;
    this.stone.x += 384;
    this.stone2.x += 1216;
    this.stone.refreshBody();
    this.stone2.refreshBody();

    this.cage3.y -= 125;
    this.cageShadow3.setAlpha(0.4);
  }
  private felinoF() {
    this.felino = true;
    this.cage4.y -= 125;
    this.cageAnimal4.destroy();
    this.cageShadow4.setAlpha(0.4);

    this.xcheckpoint = this.cageX;
    this.ycheckpoint = this.cageY;
  }

  private initAnimations() {
    this.anims.create({
      key: "carpinchoIdle",
      frames: this.anims.generateFrameNumbers("carpinchoIdle", {
        start: 0,
        end: 5,
      }),
      frameRate: 3,
      repeat: -1,
    });
  }

  private initCamera() {
    this.cameras.main.fadeIn(750);
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);

    if (!this.sys.game.device.os.desktop) {
      this.cameras.main.startFollow(this.player, true, 1, 1, 0, 200);
      this.cameras.main.setZoom(1.5);
    } else {
      this.cameras.main.startFollow(this.player, true);
      this.cameras.main.setZoom(1);
    }
  }

  private cameraUpdate() {
    if (this.felino == false) {
      if (this.player.y <= 1280 || this.player.x >= 8960) {
        this.cameras.main.setBounds(2560, 0, 20224, 1280);
        this.xcheckpoint = 5504;
        this.ycheckpoint = 896;
      } else {
        this.cameras.main.setBounds(0, 1280, 8960, 1280);
        this.xcheckpoint = this.xSpawn;
        this.ycheckpoint = this.ySpawn;
      }
      if (this.player.x >= 8960 && this.player.y >= 1340) {
        this.xcheckpoint = 5504;
        this.ycheckpoint = 896;

        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.physics.pause();

        this.cameras.main.fadeOut(500);
        this.scene.scene.time.addEvent({
          delay: 500,
          callback: () => {
            this.physics.resume();
            this.cameras.main.fadeIn(700);
            this.player.x = this.xcheckpoint;
            this.player.y = this.ycheckpoint;
          },
        });
      }
    }

    this.bottomBackground.setTilePosition(this.cameras.main.scrollX * 0.2);
    this.topBackground.setTilePosition(this.cameras.main.scrollX * 0.2);
  }

  private uiUpdate() {
    if (this.player.x < 200 && this.player.y < 1880) {
      events.emit("uiInvisible");
    } else {
      events.emit("uiVisible");
    }
    this.textId.x = this.player.x - 40;
    this.textId.y = this.player.y + 100;
  }
}
