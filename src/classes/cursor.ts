import Phaser from "phaser";
import { Actor } from "./actor";
import { sharedInstance as events } from "../scenes/EventCenter";

export class Cursor extends Actor {
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "cursor");

    this.keyW = this.scene.input.keyboard.addKey("UP");
    this.keyA = this.scene.input.keyboard.addKey("LEFT");
    this.keyS = this.scene.input.keyboard.addKey("DOWN");
    this.keyD = this.scene.input.keyboard.addKey("RIGHT");
    
    this.initListeners();
  }

  update() {
    if (this.keyW?.isDown) {
      this.body.velocity.x = 0;
      this.body.velocity.y = -400;
    }

    if (this.keyA?.isDown) {
      this.body.velocity.y = 0;
      this.body.velocity.x = -400;
    }

    if (this.keyS?.isDown) {
      this.body.velocity.x = 0;
      this.body.velocity.y = 400;
    }

    if (this.keyD?.isDown) {
      this.body.velocity.y = 0;
      this.body.velocity.x = 400;
    }
  }

  private initListeners() {
    events.on("keyACursor", () => {
      this.keyA.isDown = true;
    });
    events.on("keyDCursor", () => {
      this.keyD.isDown = true;
    });
    events.on("keyWCursor", () => {
      this.keyW.isDown = true;
    });
    events.on("keySCursor", () => {
      this.keyS.isDown = true;
    });

    events.on("keyNoneCursor", () => {
      this.keyA.isDown = false;
      this.keyD.isDown = false;
      this.keyW.isDown = false;
      this.keyS.isDown = false;
    });
  }
}
