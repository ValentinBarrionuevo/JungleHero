import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";

export class langEmit extends Phaser.Scene {
  private langTimer;
  constructor() {
    super("langEmit");
  }
  create() {
    events.on("langSelectEs", this.langEs, this);
    events.on("langSelectEn", this.langEn, this);
    events.on("langSelectPt", this.langPt, this);
    this.langTimer = this.time.addEvent({
      delay: 10,
    });
  }
  private langEs() {
    this.langTimer.remove();
    this.langTimer = this.time.addEvent({
      delay: 100,
      callback: () => {
        events.emit("langEs");
      },
      repeat: -1,
    });
  }
  private langEn() {
    this.langTimer.remove();
    this.time.addEvent({
      delay: 100,
      callback: () => {
        events.emit("langEn");
      },
      repeat: -1,
    });
  }
  private langPt() {
    this.langTimer.remove();
    this.time.addEvent({
      delay: 100,
      callback: () => {
        events.emit("langPt");
      },
      repeat: -1,
    });
  }
}
