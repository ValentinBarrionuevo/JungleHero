import { Scene } from "phaser";
import { getPhrase } from "../services/translations";

import { sharedInstance as events } from "./EventCenter";

export class chatCarpincho extends Scene {
  private chatTexto: string = "Texto de ejemplo";
  private object;
  private chatBack;
  private chatDiv;

  constructor() {
    super("chatCarpincho");
  }
  create() {
    this.initListeners();

    this.input.keyboard.on(
      "keydown-Z",
      () => {
        this.scene.stop();
        this.scene.resume("level-1-scene");
        this.scene.resume("ui-scene");
      },
      this
    );

    if (!this.sys.game.device.os.desktop) {
      this.add
        .tileSprite(0, 0, 2560, 1280, "black")
        .setOrigin(0)
        .setAlpha(0.01)
        .setInteractive()
        .on("pointerdown", () => {
          this.scene.stop();
          this.scene.resume("level-1-scene");
          this.scene.resume("ui-scene");
        });
    }
  }

  private mobileDetected() {
    if (!this.sys.game.device.os.desktop) {
      this.chatBack.y = 250;
      this.chatDiv.y = 240;
    }
  }

  private initListeners() {
    events.on("chat1", this.firstChat, this);
    events.on("chat2", this.secondChat, this);
    events.on("chat3", this.thirdChat, this);
  }

  initChat() {
    this.chatBack = this.add.image(1138, 1170, "chatPNG").setScale(1, 1.1);
    switch (this.object) {
      case "chat1":
        this.chatTexto = getPhrase(
          "¡Tus compañeros fueron capturados!\\n Tomá esta reliquia y libéralos para recibir sus poderes"
        );
        break;
      case "chat2":
        this.chatTexto = getPhrase(
          "Seguro que caminando despacio podés pasar por los pinchos.\nProbá pulsar (X) para caminar sobre ellos"
        );
        break;
      case "chat3":
        this.chatTexto = getPhrase(
          "Algún animal con mucha fuerza podrá mover esas piedras..."
        );
        break;
    }

    this.chatDiv = this.add
      .text(1138, 1160, this.chatTexto, {
        fontSize: "50px",
        align: "center",
        fontFamily: "font1",
      })
      .setOrigin(0.5)
      .setDepth(1)
      .setTint(0x5d2a32);
  }

  private firstChat() {
    this.object = "chat1";

    this.initChat();
    this.mobileDetected();
  }
  private secondChat() {
    this.object = "chat2";

    this.initChat();
    this.mobileDetected();
  }
  private thirdChat() {
    this.object = "chat3";

    this.initChat();
    this.mobileDetected();
  }
}
