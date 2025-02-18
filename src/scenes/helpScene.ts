import { Scene } from "phaser";

import { sharedInstance as events } from "./EventCenter";

export class helpScene extends Scene {
  private textAyuda: string = "Texto de ayuda";
  private textMov: string = "Texto de movimiento";
  private textHabilidad: string = "Texto de habilidad";
  private textSigilo: string = "Texto de sigilo";
  private textInteract: string = "Texto de interact";
  private lang;
  constructor() {
    super("helpScene");
  }

  create() {
    this.add.tileSprite(0, 0, 2560, 1280, "black").setOrigin(0).setAlpha(0.4);
    this.initListeners();

    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.add.image(1138, 640, "pausaBackground").setScale(1.5, 1.6);
        this.initButtons();
        this.initText();
        this.initImages();
      },
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

  private initText() {
    switch (this.lang) {
      case "es":
        this.textAyuda = "Ayuda";
        this.textMov = "Movimiento";
        this.textHabilidad = "Super Salto";
        this.textSigilo = "Modo sigilo";
        this.textInteract = "Interactuar";
        break;
      case "en":
        this.textAyuda = "Help";
        this.textMov = "Movement";
        this.textHabilidad = "High Jump";
        this.textSigilo = "Stealth mode";
        this.textInteract = "Interact";
        break;
      case "pt":
        this.textAyuda = "Ajuda";
        this.textMov = "Movimento";
        this.textHabilidad = "Super Salto";
        this.textSigilo = "Modo furtivo";
        this.textInteract = "Interagir";
        break;
    }

    this.add
      .text(1138, 320, this.textAyuda, {
        fontSize: "65px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);

    this.add
      .text(1300, 550, this.textMov, {
        fontSize: "50px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);
    this.add
      .text(1300, 675, this.textHabilidad, {
        fontSize: "50px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);
    this.add
      .text(1300, 800, this.textSigilo, {
        fontSize: "50px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);
    this.add
      .text(1300, 925, this.textInteract, {
        fontSize: "50px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);
  }

  private initImages() {
    this.add.image(850, 550, "botonCursors");
    this.add.image(850, 675, "botonC");
    this.add.image(850, 800, "botonX");
    this.add.image(850, 925, "botonZ");
  }

  private initButtons() {
    const resume = this.add
      .image(150, 1150, "backOut")
      .setInteractive({ cursor: "pointer", pixelPerfect: "true" })
      .setFlipX(true);

    resume.on("pointerup", () => {
      this.scene.stop();
      this.scene.resume("mainMenu");
    });
    resume.on("pointerover", () => {
      resume.setTexture("backIn");
    });
    resume.on("pointerout", () => {
      resume.setTexture("backOut");
    });
  }
}
