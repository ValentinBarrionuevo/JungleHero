import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";

export class alertScene extends Phaser.Scene {
  private alertText: string = "Texto de alerta";
  private lang;
  private object;
  private alertDiv;
  private alertBack;

  constructor() {
    super("alertScene");
  }
  create() {
    this.initListeners();
  }
  private mobileDetected() {
    if (!this.sys.game.device.os.desktop) {
      this.alertBack.y = 250;
      this.alertDiv.y = 240;
    }
  }
  private initAlerts() {
    console.log("alerts");

    this.alertBack = this.add.image(1138, 1170, "chatPNG").setScale(1, 1.1);
    switch (this.lang) {
      case "es":
        switch (this.object) {
          case "alert1":
            this.alertText = "¡Doble salto desbloqueado!";
            break;
          case "alert2":
            this.alertText = "¡Super salto desbloqueao! (tecla C)";
            break;
          case "alert3":
            this.alertText = "¡El oso ha despejado el camino!";
            break;
        }
        break;
      case "en":
        switch (this.object) {
          case "alert1":
            this.alertText =
              "Double jump unlocked!";
            break;
          case "alert2":
            this.alertText =
              "High Jump unlocked! (C key)";
            break;
          case "alert3":
            this.alertText = "The bear has cleared the way!";
            break;
        }
        break;
      case "pt":
        switch (this.object) {
          case "alert1":
            this.alertText =
              "Salto duplo desbloqueado!";
            break;
          case "alert2":
            this.alertText =
              "Super Salto desbloqueado! (tecla C)";
            break;
          case "alert3":
            this.alertText =
              "O urso abriu o caminho!";
            break;
        }
        break;
    }
    this.alertDiv = this.add
      .text(1138, 1160, this.alertText, {
        fontSize: "50px",
        align: "center",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);

    this.time.addEvent({
      delay: 1500,
      callback: () => {
        this.scene.stop();
        this.scene.resume("level-1-scene");
        this.scene.resume("ui-scene");
      },
    });
  }

  private initListeners() {
    events.on("bird", this.firstAlert, this);
    events.on("canguro", this.secondAlert, this);
    events.on("oso", this.thirdAlert, this);
    events.on("langEs", this.langSelectedEs, this);
    events.on("langEn", this.langSelectedEn, this);
    events.on("langPt", this.langSelectedPt, this);
  }

  private firstAlert() {
    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.object = "alert1";
        this.initAlerts();
        this.mobileDetected();
      },
    });
  }
  private secondAlert() {
    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.object = "alert2";
        this.initAlerts();
        this.mobileDetected();
      },
    });
  }
  private thirdAlert() {
    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.object = "alert3";
        this.initAlerts();
        this.mobileDetected();
      },
    });
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
