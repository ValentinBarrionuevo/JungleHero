import Phaser from "phaser";
import { Cursor } from "../classes/cursor";

import { sharedInstance as events } from "../scenes/EventCenter";

export class cage extends Phaser.Scene {
  private cageCursor;
  private tileLayer;
  private finishPoint;

  private buttonLeft;
  private buttonRight;
  private buttonUp;
  private buttonDown;

  private xSpawn!: number;
  private ySpawn!: number;
  public movement: boolean = true;

  private map;
  private mapID: number = 0;
  private reload: boolean = false;
  constructor() {
    super("cageLevel");
  }

  create() {
    this.initListeners();
  }

  private initButtons() {
    this.buttonLeft = this.add
      .image(200, 1100, "backOut")
      .setScale(1.5)
      .setInteractive()
      .setFlipX(true)
      .on("pointerdown", () => {
        this.buttonLeft.setTexture("backIn");
        events.emit("keyACursor");
      })
      .on("pointerup", () => {
        this.buttonLeft.setTexture("backOut");
        events.emit("keyNoneCursor");
      });

    this.buttonRight = this.add
      .image(500, 1100, "backOut")
      .setScale(1.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.buttonRight.setTexture("backIn");
        events.emit("keyDCursor");
      })
      .on("pointerup", () => {
        this.buttonRight.setTexture("backOut");
        events.emit("keyNoneCursor");
      });

    this.buttonUp = this.add
      .image(2050, 800, "upOut")
      .setScale(1.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.buttonUp.setTexture("upIn");
        events.emit("keyWCursor");
      })
      .on("pointerup", () => {
        this.buttonUp.setTexture("upOut");
        events.emit("keyNoneCursor");
      });

    this.buttonDown = this.add
      .image(2050, 1100, "downOut")
      .setScale(1.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.buttonDown.setTexture("downIn");
        events.emit("keySCursor");
      })
      .on("pointerup", () => {
        this.buttonDown.setTexture("downOut");
        events.emit("keyNoneCursor");
      });
  }

  update(): void {
    if (this.movement == true && this.reload == true) {
      this.cageCursor.update();
    }
  }

  private initListeners() {
    events.on(
      "map1",
      () => {
        this.reload = true;
        this.mapID = 1;
        this.initMap();
        if (!this.sys.game.device.os.desktop) {
          this.initButtons();
        }
      },
      this
    );

    events.on(
      "map2",
      () => {
        this.reload = true;
        this.mapID = 2;
        this.initMap();
        if (!this.sys.game.device.os.desktop) {
          this.initButtons();
        }
      },
      this
    );

    events.on(
      "map3",
      () => {
        this.reload = true;
        this.mapID = 3;
        this.initMap();
        if (!this.sys.game.device.os.desktop) {
          this.initButtons();
        }
      },
      this
    );
  }

  private initMap() {
    this.add.image(0, 0, "cageBackground").setOrigin(0);
    switch (this.mapID) {
      case 1:
        this.map = this.make.tilemap({
          key: "cageJSON",
          tileWidth: 128,
          tileHeight: 128,
        });
        break;
      case 2:
        this.map = this.make.tilemap({
          key: "cageJSON2",
          tileWidth: 128,
          tileHeight: 128,
        });
        break;
      case 3:
        this.map = this.make.tilemap({
          key: "cageJSON3",
          tileWidth: 128,
          tileHeight: 128,
        });
        break;

      default:
        console.log("error");
        break;
    }

    const tileset = this.map.addTilesetImage("tile", "tilesCage");
    this.tileLayer = this.map.createLayer("tileLayer", tileset);
    this.map.createLayer("finishLayer", tileset);
    this.tileLayer.setCollisionByProperty({ collides: true });

    const objectsLayer = this.map.getObjectLayer("objectLayer");
    objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "Start": {
          this.xSpawn = x;
          this.ySpawn = y;
          this.cageCursor = new Cursor(this, x, y).setScale(0.7);
          this.cageCursor.body.setAllowGravity(false);
          break;
        }
        case "Finish": {
          this.finishPoint = this.physics.add
            .image(x, y, "stealth")
            .setOrigin(0)
            .setAlpha(0.001)
            .refreshBody();
          this.finishPoint.body.setAllowGravity(false);
        }
      }
    });
    this.physics.add.collider(
      this.cageCursor,
      this.tileLayer,
      this.retry,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.cageCursor,
      this.finishPoint,
      this.finish,
      undefined,
      this
    );
  }

  private retry() {
    this.cageCursor.getBody().setVelocity(0);
    this.cageCursor.body.velocity.y = 0;
    this.movement = false;
    this.cageCursor.x = this.xSpawn;
    this.cageCursor.y = this.ySpawn;

    this.scene.scene.time.addEvent({
      delay: 400,
      callback: () => (this.movement = true),
    });
  }
  private finish() {
    switch (this.mapID) {
      case 1:
        events.emit("bird");
        break;
      case 2:
        events.emit("canguro");
        break;
      case 3:
        events.emit("oso");
        break;
    }
    this.cageCursor.destroy();
    this.scene.stop("cageLevel");
    this.scene.resume("level-1-scene");
    this.scene.resume("ui-scene");
  }
}
