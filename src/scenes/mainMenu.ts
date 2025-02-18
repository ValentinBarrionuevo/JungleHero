import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";

export class mainMenu extends Phaser.Scene {
  private map;
  private groundLayer;
  private objectsLayer;
  private player;
  private play;
  private credits;
  private help;
  private lang;
  private back;
  private playText;
  private helpText;
  private creditsText;
  private langText;
  private langSelection;
  private textPlay;
  private textHelp;
  private textCredits;
  private textLang;
  private listened;

  constructor() {
    super("mainMenu");
  }

  create() {
    this.listened = false;
    this.initAnimations();
    this.initMap();
    this.initCamera();
    this.initListeners();
  }

  private initListeners() {
    events.on(
      "langEs",
      () => {
        if (this.listened == false) {
          this.langSelection = "es";
          this.initText();
          this.initButtons();
          this.listened = true;
        }
      },
      this
    );
    events.on(
      "langEn",
      () => {
        if (this.listened == false) {
          this.langSelection = "en";
          this.initText();
          this.initButtons();
          this.listened = true;
        }
      },
      this
    );
    events.on(
      "langPt",
      () => {
        if (this.listened == false) {
          this.langSelection = "pt";
          this.initText();
          this.initButtons();
          this.listened = true;
        }
      },
      this
    );
  }

  private initText() {
    switch (this.langSelection) {
      case "es":
        this.textPlay = "Jugar";
        this.textCredits = "Créditos";
        this.textHelp = "Ayuda";
        this.textLang = "Idioma";
        break;

      case "en":
        this.textPlay = "Play";
        this.textCredits = "Credits";
        this.textHelp = "Help";
        this.textLang = "Language";
        break;

      case "pt":
        this.textPlay = "Jogar";
        this.textCredits = "Créditos";
        this.textHelp = "Ajuda";
        this.textLang = "Língua";
        break;
    }
    this.initCredits();
  }

  private initMap() {
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

    this.objectsLayer = this.map.getObjectLayer("objectLayer");

    this.objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "Player": {
          this.player = this.physics.add.sprite(x, y, "monkey");
          this.player.anims.play("monkeyIdle");
          break;
        }
      }
    });
    this.physics.add.collider(this.player, this.groundLayer);
  }

  private initButtons() {
    this.objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "Jugar": {
          console.log("Jugar");

          this.play = this.add
            .image(x, y, "botonOut")
            .setInteractive({ cursor: "pointer", pixelPerfect: "true" });

          this.playText = this.add
            .text(x, y - 20, this.textPlay, {
              fontSize: "55px",
              fontFamily: "font1",
            })
            .setOrigin(0.5)
            .setDepth(1)
            .setTint(0x5d2a32);

          this.play.on("pointerup", () => {
            this.cameras.main.fadeOut(1500);
            this.player.body.velocity.x = 500;
            this.player.anims.play("monkeyRun");
            this.scene.scene.time.addEvent({
              delay: 1500,
              callback: () => {
                this.scene.stop();
                this.scene.start("level-1-scene");
              },
            });
          });
          this.play.on("pointerover", () => {
            this.play.setTexture("botonIn");
            this.playText.y += 10;
          });
          this.play.on("pointerout", () => {
            this.play.setTexture("botonOut");
            this.playText.y -= 10;
          });
          break;
        }
        case "Creditos": {
          this.credits = this.add
            .image(x, y, "botonOut")
            .setInteractive({ cursor: "pointer", pixelPerfect: "true" });

          this.creditsText = this.add
            .text(x, y - 20, this.textCredits, {
              fontSize: "55px",
              fontFamily: "font1",
            })
            .setOrigin(0.5)
            .setDepth(1)
            .setTint(0x5d2a32);

          this.credits.on("pointerup", () => {
            this.player.body.velocity.x = -300;
            this.player.anims.play("monkeyRun");
            this.player.flipX = true;
            this.scene.scene.time.addEvent({
              delay: 1400,
              callback: () => {
                this.player.body.velocity.x = 0;
                this.player.anims.play("monkeyIdle");
                this.back.setInteractive({
                  cursor: "pointer",
                  pixelPerfect: "true",
                });
              },
            });
            this.cameras.main.setBounds(0, 0, 2560, 1280);
          });
          this.credits.on("pointerover", () => {
            this.credits.setTexture("botonIn");
            this.creditsText.y += 10;
          });
          this.credits.on("pointerout", () => {
            this.credits.setTexture("botonOut");
            this.creditsText.y -= 10;
          });
          break;
        }
        case "Ayuda": {
          this.help = this.add
            .image(x, y, "botonOut")
            .setInteractive({ cursor: "pointer", pixelPerfect: "true" });

          this.helpText = this.add
            .text(x, y - 20, this.textHelp, {
              fontSize: "55px",
              fontFamily: "font1",
            })
            .setOrigin(0.5)
            .setDepth(1)
            .setTint(0x5d2a32);

          this.help.on("pointerup", () => {
            this.help.clearTint();
            this.scene.pause();
            this.scene.run("helpScene");
          });
          this.help.on("pointerover", () => {
            this.helpText.y += 10;

            this.help.setTexture("botonIn");
          });
          this.help.on("pointerout", () => {
            this.helpText.y -= 10;

            this.help.setTexture("botonOut");
          });
          break;
        }
        case "Idioma": {
          this.lang = this.add
            .image(x, y, "botonOut")
            .setInteractive({ cursor: "pointer", pixelPerfect: "true" });
          this.langText = this.add
            .text(x, y - 20, this.textLang, {
              fontSize: "55px",
              fontFamily: "font1",
            })
            .setOrigin(0.5)
            .setDepth(1)
            .setTint(0x5d2a32);

          this.lang.on("pointerup", () => {
            this.scene.stop();
            this.scene.stop("langEmit");
            this.scene.start("sceneIdioma");
            this.scene.run("langEmit");
          });
          this.lang.on("pointerover", () => {
            this.langText.y += 10;

            this.lang.setTexture("botonIn");
          });
          this.lang.on("pointerout", () => {
            this.langText.y -= 10;

            this.lang.setTexture("botonOut");
          });
          break;
        }
        case "Volver": {
          this.back = this.add.image(x, y, "backOut").setOrigin(0);

          this.back.on("pointerup", () => {
            this.play.disableInteractive();
            this.credits.disableInteractive();
            this.help.disableInteractive();
            this.back.disableInteractive();
            this.lang.disableInteractive();
            this.player.body.velocity.x = 300;
            this.player.flipX = false;
            this.player.anims.play("monkeyRun");
            this.scene.scene.time.addEvent({
              delay: 1400,
              callback: () => {
                this.play.setInteractive({
                  cursor: "pointer",
                  pixelPerfect: "true",
                });
                this.credits.setInteractive({
                  cursor: "pointer",
                  pixelPerfect: "true",
                });
                this.help.setInteractive({
                  cursor: "pointer",
                  pixelPerfect: "true",
                });
                this.lang.setInteractive({
                  cursor: "pointer",
                  pixelPerfect: "true",
                });
                this.player.body.velocity.x = 0;
                this.player.anims.play("monkeyIdle");
              },
            });
            this.cameras.main.setBounds(2576, 0, 2560, 1080);
          });
          this.back.on("pointerover", () => {
            this.back.setTexture("backIn");
          });
          this.back.on("pointerout", () => {
            this.back.setTexture("backOut");
          });
          break;
        }
      }
    });
  }

  private initAnimations() {
    this.anims.create({
      key: "monkeyIdle",
      frames: this.anims.generateFrameNumbers("monkeyIdle", {
        start: 0,
        end: 2,
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "monkeyRun",
      frames: this.anims.generateFrameNumbers("monkeyRun", {
        start: 0,
        end: 2,
      }),
      frameRate: 7,
      repeat: -1,
    });
  }

  private initCredits() {
    this.add
      .text(
        1338,
        550,
        this.textCredits +
          "\n\n\nBarrionuevo, Valentin\n\nForzano, Tomás\n\nSuarez, Agustín",
        {
          fontSize: "75px",
          align: "center",
          fontFamily: "font1",
        }
      )
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0xdcde9f);
  }

  private initCamera() {
    this.cameras.main.fadeIn(1000);
    this.cameras.main.setBounds(2576, 0, 2560, 1080);
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
    this.cameras.main.setZoom(1);
  }
}
