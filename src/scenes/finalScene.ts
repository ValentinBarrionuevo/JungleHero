import Phaser from "phaser";
import { getPhrase } from "../services/translations";

export class finalScene extends Phaser.Scene {
  private volver: any;
  private map;
  private groundLayer;
  constructor() {
    super("finalScene");
  }
  create() {
    this.initBackground();
    this.initButtons();
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
      .text(1138, 300, getPhrase("¡Felicidades!"), {
        fontSize: "75px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0xdcde9f);

    this.add
      .text(1138, 450, getPhrase("Liberaste a todos los animales."), {
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
    this.add.image(1750, 862, "canguro");
    this.add.image(1950, 862, "bird");
  }
}
