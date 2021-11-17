import { Scene } from "phaser";
import { getPhrase } from "../services/translations";

export class helpScene extends Scene {
  constructor() {
    super("helpScene");
  }

  create() {
    this.add.tileSprite(0, 0, 2560, 1280, "black").setOrigin(0).setAlpha(0.4);
    this.add.image(1138, 640, "pausaBackground").setScale(1.5, 1.6);

    this.initButtons();
    this.initText();
    this.initImages();
  }

  private initText() {
    this.add
      .text(1138, 320, getPhrase("Ayuda"), {
        fontSize: "65px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);

    this.add
      .text(1300, 550, getPhrase("Movimiento"), {
        fontSize: "50px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);
    this.add
      .text(1300, 675, getPhrase("Usar habilidad"), {
        fontSize: "50px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);
    this.add
      .text(1300, 800, getPhrase("Modo sigilo"), {
        fontSize: "50px",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);
    this.add
      .text(1300, 925, getPhrase("Interactuar"), {
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
