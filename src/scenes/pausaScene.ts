import { Scene } from "phaser";

import { sharedInstance as events } from "./EventCenter";

export class pausaScene extends Scene {
  private textPausa: string = "Texto de pausa";
  private textVolver: string = "Texto de volver";
  private textMenu: string = "Texto de menu";
  private lang;

  constructor() {
    super("pausaScene");
  }

  create() {
    this.initListeners();
    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.initText();
      },
    });
    this.add.tileSprite(0, 0, 2560, 1280, "black").setOrigin(0).setAlpha(0.4);
  }

  private initText() {
    this.add.image(1138, 640, "pausaBackground");

    switch (this.lang) {
      case "es":
        this.textPausa = "Pausa";
        this.textVolver = "Volver";
        this.textMenu = "Menú";
        break;
      case "en":
        this.textPausa = "Pause";
        this.textVolver = "Resume";
        this.textMenu = "Menu";
        break;
      case "pt":
        this.textPausa = "Pausa";
        this.textVolver = "Retorna";
        this.textMenu = "Menu";
        break;
    }
    this.add
      .text(1138, 440, this.textPausa, {
        fontSize: "75px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);

    var resumeText = this.add
      .text(1138, 600, this.textVolver, {
        fontSize: "55px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);

    var menuText = this.add
      .text(1138, 780, this.textMenu, {
        fontSize: "55px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);

    const resume = this.add
      .image(1138, 620, "botonOut")
      .setScale(0.75)
      .setInteractive({ cursor: "pointer", pixelPerfect: "true" });

    resume.on("pointerup", () => {
      events.emit("pausaNo");
    });
    resume.on("pointerover", () => {
      resumeText.y += 8;
      resume.setTexture("botonIn");
    });
    resume.on("pointerout", () => {
      resumeText.y -= 8;
      resume.setTexture("botonOut");
    });

    const menu = this.add
      .image(1138, 800, "botonOut")
      .setScale(0.75)
      .setInteractive({ cursor: "pointer", pixelPerfect: "true" });

    menu.on("pointerup", () => {
      this.cameras.main.fadeOut(700);
      this.scene.scene.time.addEvent({
        delay: 700,
        callback: () => {
          this.scene.stop();
          this.scene.stop("level-1-scene");
          this.scene.stop("ui-scene");
          this.scene.start("mainMenu");
        },
      });
    });
    menu.on("pointerover", () => {
      menuText.y += 8;
      menu.setTexture("botonIn");
    });
    menu.on("pointerout", () => {
      menuText.y -= 8;
      menu.setTexture("botonOut");
    });
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
}
