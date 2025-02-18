import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";

export class sceneIdioma extends Phaser.Scene {
  constructor() {
    super("sceneIdioma");
  }

  create() {
    this.cameras.main.fadeIn(1000);
    this.add.image(1138, 640, "botonIdioma");

    var Idioma1 = this.add
      .image(1138, 640, "botonES")
      .setAlpha(0.001)
      .setInteractive({ cursor: "pointer", pixelPerfect: true });

    var Idioma2 = this.add
      .image(1138, 640, "botonEN")
      .setAlpha(0.001)
      .setInteractive({ cursor: "pointer", pixelPerfect: true });

    var Idioma3 = this.add
      .image(1138, 640, "botonPT")
      .setAlpha(0.001)
      .setInteractive({ cursor: "pointer", pixelPerfect: true });

    Idioma1.on("pointerup", () => {
      this.scene.run("mainMenu");
      this.time.addEvent({
        delay: 10,
        callback: () => {
          events.emit("langSelectEs");
          this.scene.stop();
          this.scale.startFullscreen();
        },
      });
    });
    Idioma1.on("pointerover", () => {
      Idioma1.setAlpha(1);
    });
    Idioma1.on("pointerout", () => {
      Idioma1.setAlpha(0.001);
    });

    Idioma2.on("pointerup", () => {
      this.scene.run("mainMenu");
      this.time.addEvent({
        delay: 10,
        callback: () => {
          events.emit("langSelectEn");
          this.scene.stop();
          this.scale.startFullscreen();
        },
      });
    });
    Idioma2.on("pointerover", () => {
      Idioma2.setAlpha(1);
    });
    Idioma2.on("pointerout", () => {
      Idioma2.setAlpha(0.001);
    });

    Idioma3.on("pointerup", () => {
      this.scene.run("mainMenu");
      this.time.addEvent({
        delay: 10,
        callback: () => {
          events.emit("langSelectPt");
          this.scene.stop();
          this.scale.startFullscreen();
        },
      });
    });
    Idioma3.on("pointerover", () => {
      Idioma3.setAlpha(1);
    });
    Idioma3.on("pointerout", () => {
      Idioma3.setAlpha(0.001);
    });
  }
}
