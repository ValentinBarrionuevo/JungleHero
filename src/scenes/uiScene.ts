import { Scene } from "phaser";
import { sharedInstance as events } from "./EventCenter";

export class UIScene extends Scene {
  public babyCount = 0;
  private babyText;
  private playerState;
  private keyState;
  private object;
  private hudZ;
  private carpinchoHud;

  private buttonLeft;
  private buttonRight;
  private buttonUp;
  private buttonX;
  private buttonZ;
  private buttonC;

  private jumpBarContainer;
  private jumpBar;
  private jumpBarMask;
  private timeBar;
  private barTimer;
  private initialTime = 230;

  constructor() {
    super("ui-scene");
  }

  create() {
    this.initText();
    this.initHUD();
    this.initListeners();
    if (!this.sys.game.device.os.desktop) {
      this.mobileButtons();
    }
  }

  private initHUD() {
    this.playerState = this.add
      .image(96, 192, "monkeyNormal")
      .setOrigin(0.5, 1);

    this.carpinchoHud = this.add.image(2050, 120, "babyCarpinchoHUD");

    this.jumpBar = this.add.image(1138, 120, "jumpBar").setAlpha(0.001);

    this.jumpBarContainer = this.add
      .image(1138, 120, "jumpBarContainer")
      .setAlpha(0.001);

    this.jumpBarMask = this.add.sprite(954, this.jumpBarContainer.y, "jumpBar");
    this.jumpBarMask.visible = false;

    this.jumpBar.mask = new Phaser.Display.Masks.BitmapMask(
      this,
      this.jumpBarMask
    );

    this.keyState = this.add
      .image(this.playerState.x, this.playerState.y + 8, "monkeyKey")
      .setOrigin(0.5, 1)
      .setAlpha(0.001);

    this.hudZ = this.add.image(0, 0, "botonZ").setOrigin(0).setAlpha(0);

    if (!this.sys.game.device.os.desktop) {
      this.playerState.setScale(1.2);
      this.carpinchoHud.setScale(1.2);
      this.carpinchoHud.x -= 10;
    }
  }

  private initText() {
    this.babyText = this.add
      .text(2200, 120, this.babyCount + "/7", {
        fontSize: "55px",
        fontFamily: "font1",
      })
      .setOrigin(1, 0.5)
      .setDepth(1)
      .setTint(0x639a3b);
  }

  private startBar() {
    if (this.object != "parar") {
      this.timeBar = this.initialTime;
      this.jumpBar.setAlpha(1);
      this.jumpBarContainer.setAlpha(1);
      this.barTimer = this.time.addEvent({
        delay: 9,
        callback: () => {
          this.timeBar--;

          let stepWidth = this.jumpBarMask.displayWidth / this.initialTime;

          this.jumpBarMask.x += stepWidth;
          if (this.timeBar == 0) {
            this.barTimer.remove();
          }
        },
        callbackScope: this,
        loop: true,
      });
    } else {
      this.barTimer.remove();
      this.jumpBarMask.x = 954;
      this.jumpBar.setAlpha(0.001);
      this.jumpBarContainer.setAlpha(0.001);
    }
  }

  private initListeners() {
    events.on("babyCollected", this.babyCountEvent, this);

    events.on(
      "stealth",
      () => {
        this.playerState.setTexture("monkeyStealth");
      },
      this
    );
    events.on(
      "noisy",
      () => {
        this.playerState.setTexture("monkeyNormal");
      },
      this
    );
    events.on(
      "felino",
      () => {
        this.playerState.setTexture("monkeyPanther");
        this.keyState.setAlpha(0.001);
      },
      this
    );

    events.on("keyCollected", () => {
      this.keyState.setAlpha(1);
    });

    events.on(
      "startBar",
      () => {
        this.object = "nada";
        this.startBar();
      },
      this
    );
    events.on(
      "stopBar",
      () => {
        this.object = "parar";
        this.startBar();
      },
      this
    );

    events.on("carpi1", () => {
      this.hudZ.setAlpha(1);
      this.hudZ.x = 85;
      this.hudZ.y = 680;
    });
    events.on("cage1", () => {
      this.hudZ.setAlpha(1);
      this.hudZ.x = 1108;
      this.hudZ.y = 650;
    });

    events.on("hudJump", () => {
      this.hudZ.setTexture("botonC");
      this.hudZ.x = 1108;
      this.hudZ.y = 650;
      this.hudZ.setAlpha(1);
    });

    events.on("void", () => {
      this.hudZ.setTexture("botonZ");
      this.hudZ.setAlpha(0);
    });

    events.on("carpi1", () => {
      if (!this.sys.game.device.os.desktop) {
        this.buttonUp.setAlpha(1);
      }
    });

    events.on("uiInvisible", () => {
      this.playerState.setAlpha(0.5);
    });
    events.on("uiVisible", () => {
      this.playerState.setAlpha(1);
    });
  }

  private babyCountEvent() {
    this.babyCount += 1;
    this.babyText.setText(this.babyCount + "/7");
  }

  private mobileButtons() {
    this.buttonLeft = this.add
      .image(200, 1100, "backOut")
      .setScale(1.5)
      .setInteractive()
      .setFlipX(true)
      .on("pointerdown", () => {
        this.buttonLeft.setTexture("backIn");
        events.emit("keyA");
      })
      .on("pointerup", () => {
        this.buttonLeft.setTexture("backOut");
        events.emit("keyNone");
      });

    this.buttonRight = this.add
      .image(500, 1100, "backOut")
      .setScale(1.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.buttonRight.setTexture("backIn");
        events.emit("keyD");
      })
      .on("pointerup", () => {
        this.buttonRight.setTexture("backOut");
        events.emit("keyNone");
      });

    this.buttonUp = this.add
      .image(2050, 1100, "upOut")
      .setScale(1.5)
      .setInteractive()
      .setAlpha(0.5)
      .on("pointerdown", () => {
        this.buttonUp.setTexture("upIn");
        events.emit("keyW");
      })
      .on("pointerup", () => {
        this.buttonUp.setTexture("upOut");
        events.emit("keyNone");
      });

    this.buttonX = this.add
      .image(150, 850, "botonX")
      .setScale(1.5)
      .setInteractive()
      .on("pointerdown", () => {
        events.emit("keyX");
      })
      .on("pointerup", () => {
        events.emit("keyNone");
      });

    this.buttonZ = this.add
      .image(2050, 850, "botonZ")
      .setScale(1.5)
      .setInteractive()
      .on("pointerdown", () => {
        events.emit("keyZ");
      })
      .on("pointerup", () => {
        events.emit("keyNone");
      });

    this.buttonC = this.add
      .image(1800, 1150, "botonC")
      .setScale(1.5)
      .setInteractive()
      .on("pointerdown", () => {
        events.emit("keyC");
      })
      .on("pointerup", () => {
        events.emit("keyNone");
      });
  }
}
