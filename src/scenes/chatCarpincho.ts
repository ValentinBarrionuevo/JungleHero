import { Scene } from "phaser";

import { sharedInstance as events } from "./EventCenter";

export class chatCarpincho extends Scene {
  private chatTexto: string = "Texto de ejemplo";
  private object;
  private lang;
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
    events.on("langEs", this.langSelectedEs, this);
    events.on("langEn", this.langSelectedEn, this);
    events.on("langPt", this.langSelectedPt, this);
  }

  private initChat() {
    this.chatBack = this.add.image(1138, 1170, "chatPNG").setScale(1, 1.1);
    switch (this.lang) {
      case "es":
        switch (this.object) {
          case "chat1":
            this.chatTexto =
              "¡Tus compañeros fueron capturados!\n Tomá esta reliquia y libéralos para recibir sus poderes!";
            break;
          case "chat2":
            this.chatTexto =
              "Seguro que caminando despacio podés pasar por los pinchos.\nProbá pulsar (X) para caminar sobre ellos";
            break;
          case "chat3":
            this.chatTexto =
              "Algún animal con mucha fuerza podrá mover esas piedras...";
            break;
        }
        break;
      case "en":
        switch (this.object) {
          case "chat1":
            this.chatTexto =
              "Your mates have been captured! \n Take this relic with you and free them to recieve their powers.";
            break;
          case "chat2":
            this.chatTexto =
              "Maybe you can pass through the spikes if you walk slowly.\nTry presing (X) to walk on them";
            break;
          case "chat3":
            this.chatTexto = "A very strong animal could move those rocks...";
            break;
        }
        break;
      case "pt":
        switch (this.object) {
          case "chat1":
            this.chatTexto =
              "Seus companheiros foram capturados!\n Pegue esta relíquia e liberte-os para receber seus poderes.";
            break;
          case "chat2":
            this.chatTexto =
              "Talvez você possa passar pelos espinhos se andar devagar.\nExperimente pressionar (X) para andar sobre eles";
            break;
          case "chat3":
            this.chatTexto =
              "Algum animal com muita força será capaz de mover aquelas pedras...";
            break;
        }
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

  private langSelectedEs() {
    this.lang = "es";
  }
  private langSelectedEn() {
    this.lang = "en";
  }
  private langSelectedPt() {
    this.lang = "pt";
  }

  private firstChat() {
    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.object = "chat1";
        this.initChat();
        this.mobileDetected();
      },
    });
  }
  private secondChat() {
    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.object = "chat2";
        this.initChat();
        this.mobileDetected();
      },
    });
  }
  private thirdChat() {
    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.object = "chat3";
        this.initChat();
        this.mobileDetected();
      },
    });
  }
}
