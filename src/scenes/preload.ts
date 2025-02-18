import Phaser from "phaser";

export class preload extends Phaser.Scene {
  constructor() {
    super("preloading");
  }

  preload() {
    this.load.image("monkey", "sprites/monkey.png");
    this.load.spritesheet("monkeyIdle", "spritesheets/monkeyIdle.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("monkeyRun", "spritesheets/monkeyRun.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("pantherWalk", "spritesheets/pantherWalk.png", {
      frameWidth: 256,
      frameHeight: 128,
    });

    this.load.image("carpincho", "sprites/carpinchoPNG.png");
    this.load.spritesheet("carpinchoIdle", "spritesheets/carpinchoIdle.png", {
      frameWidth: 128,
      frameHeight: 192,
    });

    this.load.image("bird", "sprites/bird.png");
    this.load.image("canguro", "sprites/canguro.png");
    this.load.image("oso", "sprites/oso.png");
    this.load.image("panther", "sprites/panther.png");

    this.load.image("jaulaAdelante", "sprites/jaulaAdelante.png");
    this.load.image("jaulaAtras", "sprites/jaulaAtras.png");
    this.load.image("jaulaSombra", "sprites/jaulaSombra.png");

    this.load.image("babyCarpincho", "sprites/babyCarpincho.png");
    this.load.image("babyCarpinchoHUD", "sprites/babyCarpinchoHUD.png");
    this.load.image("stone", "sprites/stone.png");
    this.load.image("stealth", "sprites/stealth.png");

    this.load.image("monkeyNormal", "sprites/monkeyNormal.png");
    this.load.image("monkeyStealth", "sprites/monkeyStealth.png");
    this.load.image("monkeyPanther", "sprites/monkeyPanther.png");

    this.load.image("key", "sprites/keyPNG.png");
    this.load.image("monkeyKey", "sprites/monkeyKey.png");

    this.load.image("jumpBar", "sprites/jumpBar.png");
    this.load.image("jumpBarContainer", "sprites/jumpBarContainer.png");

    this.load.image("pausaBackground", "sprites/pausaBackground.png");
    this.load.image("black", "sprites/black.png");
    this.load.image("botonIn", "sprites/botonIn.png");
    this.load.image("botonOut", "sprites/botonOut.png");

    this.load.image("backOut", "sprites/backOut.png");
    this.load.image("backIn", "sprites/backIn.png");
    this.load.image("upIn", "sprites/upIn.png");
    this.load.image("upOut", "sprites/upOut.png");
    this.load.image("downIn", "sprites/downIn.png");
    this.load.image("downOut", "sprites/downOut.png");

    this.load.image("botonCursors", "sprites/botonCursors.png");
    this.load.image("botonC", "sprites/botonC.png");
    this.load.image("botonX", "sprites/botonX.png");
    this.load.image("botonZ", "sprites/botonZ.png");

    this.load.image("botonIdioma", "sprites/botonIdioma.png");
    this.load.image("botonES", "sprites/botonES.png");
    this.load.image("botonEN", "sprites/botonEN.png");
    this.load.image("botonPT", "sprites/botonPT.png");

    this.load.image("chatPNG", "sprites/chat.png");

    this.load.image("tiles", "tilemaps/tiles/tiles.png");
    this.load.image("tilesCage", "tilemaps/tiles/tilesCage.png");
    this.load.tilemapTiledJSON("tiledMap", "tilemaps/json/tiledMap.json");
    this.load.tilemapTiledJSON("menuMap", "tilemaps/json/menuMap.json");

    this.load.image("cursor", "sprites/cursorCage.png");
    this.load.image("cageBackground", "sprites/cageBackground.png");
    this.load.image("levelBackground", "sprites/levelBackground.png");

    this.load.image("tile", "tilemaps/tiles/tile.png");
    this.load.tilemapTiledJSON("cageJSON", "tilemaps/json/cageMinigame.json");
    this.load.tilemapTiledJSON("cageJSON2", "tilemaps/json/cageMinigame2.json");
    this.load.tilemapTiledJSON("cageJSON3", "tilemaps/json/cageMinigame3.json");
  }

  create() {
    this.add
      .text(1138, 1060, "Loading...", {
        fontSize: "50px",
        align: "center",
        fontFamily: "font1",
        color: "white",
      })
      .setOrigin(0.5)
      .setDepth(1);
    this.scene.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.start("sceneIdioma");
        this.scene.run("langEmit");
      },
    });
  }
}
