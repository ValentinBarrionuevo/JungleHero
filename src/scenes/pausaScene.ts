import { Scene } from "phaser";
import { getPhrase } from "../services/translations";

import { sharedInstance as events } from "./EventCenter";

export class pausaScene extends Scene {
  constructor() {
    super("pausaScene");
  }

  create() {
    this.add.tileSprite(0, 0, 2560, 1280, "black").setOrigin(0).setAlpha(0.4);
    this.add.image(1138, 640, "pausaBackground");
    this.add
      .text(1138, 440, getPhrase("Pausa"), {
        fontSize: "75px",
        // fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);
    const resume = this.add
      .image(1138, 600, "botonOut")
      .setScale(0.5)
      .setInteractive({ cursor: "pointer", pixelPerfect: "true" });

    resume.on("pointerup", () => {
      events.emit("pausaNo");
    });
    resume.on("pointerover", () => {
      resume.setTexture("botonIn");
    });
    resume.on("pointerout", () => {
      resume.setTexture("botonOut");
    });

    const menu = this.add
      .image(1138, 800, "botonOut")
      .setScale(0.5)
      .setInteractive({ cursor: "pointer", pixelPerfect: "true" });

    menu.on("pointerup", () => {
      this.scene.stop("level-1-scene");
      this.scene.start("mainMenu");
    });
    menu.on("pointerover", () => {
      menu.setTexture("botonIn");
    });
    menu.on("pointerout", () => {
      menu.setTexture("botonOut");
    });
  }
}
