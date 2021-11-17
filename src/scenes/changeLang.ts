import Phaser from "phaser";
import { EN_US, ES_AR, PT_BR } from "../enums/languages";
import { FETCHED, FETCHING, READY, TODO } from "../enums/status";
import { getTranslations } from "../services/translations";
import { getPhrase } from "../services/translations";




export class changeLang extends Phaser.Scene {
  private updatedTextInScene;
  private updatedString = "Siguiente";
  private wasChangedLanguage = TODO;

  constructor() {
    super("changeLang");
  }
  create() {
    this.add.image(1138, 640, "botonIdioma");
    const buttonSpanish = this.add
      .image(1138, 640, "botonES")
      .setInteractive({ cursor: "pointer", pixelPerfect: "true" })
      .setAlpha(0.001)
      .on("pointerup", () => {
        getTranslations(ES_AR);
        this.scene.scene.time.addEvent({
          delay:2000,
          callback: () => {
            this.scene.stop();
            this.scene.start("mainMenu");
          },
        });
      });
    buttonSpanish.on("pointerover", () => {
      buttonSpanish.setAlpha(1);
    });
    buttonSpanish.on("pointerout", () => {
      buttonSpanish.setAlpha(0.001);
    });

    const buttonEnglish = this.add
      .image(1138, 640, "botonEN")
      .setInteractive({ cursor: "pointer", pixelPerfect: "true" })
      .setAlpha(0.001)
      .on("pointerup", () => {
        getTranslations(EN_US);
        this.scene.scene.time.addEvent({
          delay:2000,
          callback: () => {
            this.scene.stop();
            this.scene.start("mainMenu");
          },
        });
      });
    buttonEnglish.on("pointerover", () => {
      buttonEnglish.setAlpha(1);
    });
    buttonEnglish.on("pointerout", () => {
      buttonEnglish.setAlpha(0.001);
    });

    const buttonPortugese = this.add
      .image(1138, 640, "botonPT")
      .setInteractive({ cursor: "pointer", pixelPerfect: "true" })
      .setAlpha(0.001)
      .on("pointerup", () => {
        getTranslations(PT_BR);
        this.scene.scene.time.addEvent({
          delay:2000,
          callback: () => {
            this.scene.stop();
            this.scene.start("mainMenu");
          },
        });
      });
    buttonPortugese.on("pointerover", () => {
      buttonPortugese.setAlpha(1);
    });
    buttonPortugese.on("pointerout", () => {
      buttonPortugese.setAlpha(0.001);
    });
  }

  update() {
    // console.log(this.updatedTextInScene)
    if (this.wasChangedLanguage === FETCHED) {
      this.wasChangedLanguage = READY;
      this.updatedTextInScene.setText(getPhrase(this.updatedString));
    }
  }

  async getTranslations(language) {
    this.wasChangedLanguage = FETCHING;
    await getTranslations(language);
    this.wasChangedLanguage = FETCHED;
    // si solo se tiene un menu para elegir las opciones de idiomas conviene cargar aca la misma
  }
}
