import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";

export class finalScene extends Phaser.Scene {
  private textFelic: string = "Texto de felicitar";
  private textLib: string = "Texto de liberar";
  private lang;

  private volver: any;
  private map;
  private groundLayer;
  constructor() {
    super("finalScene");
  }
  create() {
    this.cameras.main.fadeIn(1400);
    this.initListeners();
    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.initBackground();
        this.initText();
      },
    });
  }

  private initText() {
    switch (this.lang) {
      case "es":
        this.textFelic = "¡Felicidades!";
        this.textLib = "Liberaste a todos los animales.";
        break;
      case "en":
        this.textFelic = "Congratulations!!";
        this.textLib = "You rescued all animals.";
        break;
      case "pt":
        this.textFelic = "Parabéns!";
        this.textLib = "Você salvou todos os animais.";
        break;
    }
    this.initButtons();
  }

  private initListeners() {
    events.on("langEs", this.langSelectedEs, this);
    events.on("langEn", this.langSelectedEn, this);
    events.on("langPt", this.langSelectedPt, this);
  }

  private langSelectedEs() {
    this.lang = "es";
  }
  private langSelectedEn() {
    this.lang = "en";
  }
  private langSelectedPt() {
    this.lang = "pt";
  }

  private initButtons() {
    this.volver = this.add
      .image(20, 1100, "backOut")
      .setOrigin(0)
      .setInteractive({ cursor: "pointer", pixelPerfect: "true" })
      .setFlipX(true);

    this.volver.on("pointerup", () => {
      this.scene.start("mainMenu");
    });
    this.volver.on("pointerover", () => {
      this.volver.setTexture("backIn");
    });
    this.volver.on("pointerout", () => {
      this.volver.setTexture("backOut");
    });

    this.add
      .text(1138, 300, this.textFelic, {
        fontSize: "75px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0xdcde9f);

    this.add
      .text(1138, 450, this.textLib, {
        fontSize: "55px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0xdcde9f);
  }

  private initBackground() {
    this.add
      .tileSprite(0, 0, 2560, 1280, "levelBackground")
      .setOrigin(0)
      .setScrollFactor(0, 1);
    this.map = this.make.tilemap({
      key: "menuMap",
      tileWidth: 64,
      tileHeight: 64,
    });
    const tileset = this.map.addTilesetImage("tiles", "tiles");
    this.groundLayer = this.map.createLayer("tileLayer", tileset);
    this.groundLayer.setCollisionByProperty({ collides: true });

    this.physics.world.setBounds(
      0,
      0,
      this.groundLayer.width,
      this.groundLayer.height
    );

    this.add.image(128, 222, "panther").setFlipX(true);
    this.add.image(128, 862, "carpincho");
    this.add.image(200, 915, "babyCarpincho").setScale(0.7);
    this.add.image(500, 862, "oso").setFlipX(true);
    this.add.image(1110, 900, "monkey").setFlipX(true);
    this.add.image(1850, 862, "canguro");
    this.add.image(2050, 862, "bird");
  }
}
