import { Input, Scene } from "phaser";

import StateMachine from "../state machine/StateMachine";
import { Actor } from "./actor";
import { sharedInstance as events } from "../scenes/EventCenter";

export class Player extends Actor {
  private keyW: Input.Keyboard.Key;
  private keyA: Input.Keyboard.Key;
  private keyD: Input.Keyboard.Key;
  private keyX: Input.Keyboard.Key;
  private keyC: Input.Keyboard.Key;
  private keyZ: Input.Keyboard.Key;
  private keyESC: Input.Keyboard.Key;
  private jump: boolean = false;
  private saltito: boolean = false;
  private bird: boolean = false;
  private canguro: boolean = false;
  private felino: boolean = false;
  private llaveCollected = false;
  private jumpLock: boolean = true;
  private pausa: boolean = false;
  private timer;
  private highJumpTimer;
  public stealth: boolean;
  private canPressX: boolean;
  private canPressW: boolean;
  private stateMachine: StateMachine;
  private object: string = "nada";

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "monkey");

    // KEYS
    this.keyW = this.scene.input.keyboard.addKey("UP");
    this.keyA = this.scene.input.keyboard.addKey("LEFT");
    this.keyD = this.scene.input.keyboard.addKey("RIGHT");
    this.keyX = this.scene.input.keyboard.addKey("X");
    this.keyC = this.scene.input.keyboard.addKey("C");
    this.keyZ = this.scene.input.keyboard.addKey("Z");
    this.keyESC = this.scene.input.keyboard.addKey("ESC");

    this.stealth = false;
    this.canPressX = true;
    this.canPressW = false;

    this.initAnimations();

    this.initListeners();

    this.stateMachine = new StateMachine(this, "delpul");

    this.stateMachine
      .addState("idle", {
        onEnter: this.idleOnEnter,
        onUpdate: this.idleOnUpdate,
      })
      .addState("run", {
        onEnter: this.runOnEnter,
        onUpdate: this.runOnUpdate,
        onExit: this.runOnExit,
      })
      .addState("jump", {
        onEnter: this.jumpOnEnter,
        onUpdate: this.jumpOnUpdate,
      })
      .addState("stealth", {
        onEnter: this.stealthOnEnter,
        onUpdate: this.stealthOnUpdate,
        onExit: this.stealthOnExit,
      })
      .addState("highJump", {
        onEnter: this.highJumpOnEnter,
        onUpdate: this.highJumpOnUpdate,
        onExit: this.highJumpOnExit,
      })
      .addState("felino", {
        onEnter: this.felinoOnEnter,
        onUpdate: this.felinoOnUpdate,
        onExit: this.felinoOnExit,
      })
      .addState("felinoSalto", {
        onEnter: this.felinoSaltoOnEnter,
        onUpdate: this.felinoSaltoOnUpdate,
        onExit: this.felinoSaltoOnExit,
      })
      .setState("idle");

    this.keyESC.on("down", () => {
      if (this.pausa == false) {
        events.emit("pausa");
        this.pausa = true;
      } else {
        events.emit("pausaNo");
        this.pausa = false;
      }
    });

    this.keyZ.on("down", () => {
      this.interacFunction();
    });
  }

  update(dt: number): void {
    this.stateMachine.update(dt);
  }

  private idleOnEnter() {
    this.anims.play("monkeyIdle");
  }

  private idleOnUpdate() {
    if (this.keyX?.isDown && this.canPressX == true) {
      if (this.stealth == true) {
        this.stealth = false;
        this.canPressX = false;

        this.scene.time.addEvent({
          delay: 1000, // ms
          callback: () => (this.canPressX = true),
        });
      } else {
        this.stealth = true;
        this.canPressX = false;
        this.scene.time.addEvent({
          delay: 1000, // ms
          callback: () => (this.canPressX = true),
        });
      }
    }

    if (this.keyC?.isDown && this.body.blocked.down && this.canguro == true) {
      this.stateMachine.setState("highJump");
    }

    if (this.keyA?.isDown || this.keyD?.isDown) {
      if (this.stealth == true) {
        this.stateMachine.setState("stealth");
      } else {
        this.stateMachine.setState("run");
      }
    }

    if (this.keyW?.isDown && this.body.blocked.down && this.jumpLock == false) {
      this.stateMachine.setState("jump");
    }
  }

  private stealthOnEnter() {
    this.anims.play("monkeyWalk");
    events.emit("stealth");
  }

  private stealthOnUpdate() {
    if (this.keyA?.isDown) {
      this.body.velocity.x = -200;
      this.flipX = true;
    } else if (this.keyD?.isDown) {
      this.body.velocity.x = 200;
      this.flipX = false;
    } else {
      this.body.velocity.x = 0;
      this.stateMachine.setState("idle");
    }

    if (this.keyX?.isDown && this.canPressX) {
      this.canPressX = false;
      this.stealth = false;
      this.stateMachine.setState("idle");
      this.scene.time.addEvent({
        delay: 1000, // ms
        callback: () => (this.canPressX = true),
      });
    }

    if (this.keyW?.isDown && this.body.blocked.down) {
      this.stateMachine.setState("jump");
    }
  }

  private stealthOnExit() {
    events.emit("noisy");
  }

  private jumpOnEnter() {
    this.anims.play("monkeyIdle");
    this.body.velocity.y = -550;
    this.stealth = false;
    this.timer = this.scene.time.addEvent({
      delay: 300, // ms
      callback: () => (this.canPressW = true),
    });
  }

  private jumpOnUpdate() {
    if (this.keyA?.isDown) {
      this.body.velocity.x = -350;
      this.flipX = true;
    } else if (this.keyD?.isDown) {
      this.body.velocity.x = 350;
      this.flipX = false;
    }

    if (this.keyW?.isDown && this.canPressW == true && this.bird == true) {
      this.body.velocity.y = -450;

      this.canPressW = false;
    }
    if (this.body.blocked.down) {
      this.body.velocity.x = 0;
      this.timer.remove();
      this.canPressW = false;
      this.stateMachine.setState("idle");
    }
  }

  private highJumpOnEnter() {
    this.anims.play("monkeyIdle");
    events.emit("startBar");
    this.highJumpTimer = this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.jump = true;
        console.log("ready");
      },
    });
  }
  private highJumpOnUpdate() {
    if (this.keyC.isDown == false) {
      if (this.saltito == true && this.jump == true) {
        this.body.velocity.y = -1500;
        this.saltito = false;
        this.jump = false;
        this.stateMachine.setState("idle");
      } else {
        this.stateMachine.setState("idle");
      }
    }
    if (this.keyC?.isDown) {
      this.saltito = true;
    } else {
      this.saltito = false;
    }
  }
  private highJumpOnExit() {
    events.emit("stopBar");
    this.highJumpTimer.remove();
  }

  private runOnEnter() {
    this.anims.play("monkeyRun");
  }
  private runOnUpdate() {
    if (this.keyA?.isDown) {
      this.body.velocity.x = -450;
      this.flipX = true;
    } else if (this.keyD?.isDown) {
      this.body.velocity.x = 450;
      this.flipX = false;
    } else {
      this.body.velocity.x = 0;
      this.stateMachine.setState("idle");
    }

    if (this.keyX?.isDown && this.canPressX == true) {
      this.stealth = true;
      this.canPressX = false;
      this.scene.time.addEvent({
        delay: 1000, // ms
        callback: () => (this.canPressX = true),
      });
      this.stateMachine.setState("idle");
    }

    if (this.keyW?.isDown && this.body.blocked.down && this.jumpLock == false) {
      this.stateMachine.setState("jump");
    }
  }

  private runOnExit() {
    //this.anims.play('idle')
    // this.anims.stop();
  }

  private felinoOnEnter() {
    this.anims.play("felinoRun");
    this.setTexture("pantherWalk", 0);
    this.body.setSize(256, 128, true);
  }

  private felinoOnUpdate() {
    if (this.keyA?.isDown) {
      this.body.velocity.x = -750;
      this.flipX = true;
    } else if (this.keyD?.isDown) {
      this.body.velocity.x = 750;
      this.flipX = false;
    }

    if (this.keyW?.isDown && this.body.blocked.down) {
      this.stateMachine.setState("felinoSalto");
    }
  }

  private felinoOnExit() {}

  private felinoSaltoOnEnter() {
    this.anims.pause(this.anims.currentAnim.frames[3]);
    this.body.velocity.y = -500;
  }

  private felinoSaltoOnUpdate() {
    if (this.keyA?.isDown) {
      this.body.velocity.x = -750;
      this.flipX = true;
    } else if (this.keyD?.isDown) {
      this.body.velocity.x = 750;
      this.flipX = false;
    }

    if (this.body.blocked.down) {
      this.stateMachine.setState("felino");
    }
  }

  private felinoSaltoOnExit() {}

  private interacFunction() {
    console.log(this.object);

    switch (this.object) {
      case "cage1":
        this.scene.scene.run("cageLevel");
        this.scene.time.addEvent({
          delay: 10,
          callback: () => {
            events.emit("map1");
            this.object = "nada";
            this.scene.scene.pause("level-1-scene");
            this.scene.scene.pause("ui-scene");
          },
        });
        break;

      case "cage2":
        this.scene.scene.run("cageLevel");
        this.scene.time.addEvent({
          delay: 10,
          callback: () => {
            events.emit("map2");
            this.object = "nada";
            this.scene.scene.pause("level-1-scene");
            this.scene.scene.pause("ui-scene");
          },
        });
        break;

      case "cage3":
        this.scene.scene.run("cageLevel");
        this.scene.time.addEvent({
          delay: 10,
          callback: () => {
            events.emit("map3");
            this.object = "nada";
            this.scene.scene.pause("level-1-scene");
            this.scene.scene.pause("ui-scene");
          },
        });
        break;

      case "cage4":
        if (this.llaveCollected == true) {
          this.stateMachine.setState("felino");
          events.emit("felino");
        }
        this.object = "nada";
        break;

      case "carpi1":
        this.jumpLock = false;
        this.scene.scene.run("chatCarpincho");
        this.scene.time.addEvent({
          delay: 10,
          callback: () => {
            events.emit("chat1");
            this.object = "nada";
            this.scene.scene.pause("level-1-scene");
            this.scene.scene.pause("ui-scene");
          },
        });
        break;
      case "carpi2":
        this.scene.scene.run("chatCarpincho");
        this.scene.time.addEvent({
          delay: 10,
          callback: () => {
            events.emit("chat2");
            this.object = "nada";
            this.scene.scene.pause("level-1-scene");
            this.scene.scene.pause("ui-scene");
          },
        });
        break;
      case "carpi3":
        this.scene.scene.run("chatCarpincho");
        this.scene.time.addEvent({
          delay: 10,
          callback: () => {
            events.emit("chat3");
            this.object = "nada";
            this.scene.scene.pause("level-1-scene");
            this.scene.scene.pause("ui-scene");
          },
        });
        break;
    }
  }

  private initAnimations() {
    this.scene.anims.create({
      key: "felinoRun",
      frames: this.anims.generateFrameNumbers("pantherWalk", {
        start: 0,
        end: 4,
      }),
      frameRate: 9,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "monkeyIdle",
      frames: this.anims.generateFrameNumbers("monkeyIdle", {
        start: 0,
        end: 2,
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "monkeyRun",
      frames: this.anims.generateFrameNumbers("monkeyRun", {
        start: 0,
        end: 2,
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "monkeyWalk",
      frames: this.anims.generateFrameNumbers("monkeyRun", {
        start: 0,
        end: 2,
      }),
      frameRate: 3,
      repeat: -1,
    });
  }

  private initListeners() {
    events.on("cage1", this.cage1, this);
    events.on("cage2", this.cage2, this);
    events.on("cage3", this.cage3, this);
    events.on("cage4", this.cage4, this);

    events.on("carpi1", this.carpi1, this);
    events.on("carpi2", this.carpi2, this);
    events.on("carpi3", this.carpi3, this);

    events.on(
      "keyCollected",
      () => {
        this.llaveCollected = true;
      },
      this
    );

    events.on(
      "bird",
      () => {
        this.bird = true;
      },
      this
    );
    events.on(
      "canguro",
      () => {
        this.canguro = true;
      },
      this
    );
    events.on(
      "felino",
      () => {
        this.felino = true;
      },
      this
    );

    events.on(
      "void",
      () => {
        this.object = "nada";
      },
      this
    );

    events.on(
      "pausaNo",
      () => {
        this.pausa = false;
      },
      this
    );

    events.on("keyA", () => {
      this.keyA.isDown = true;
    });
    events.on("keyD", () => {
      this.keyD.isDown = true;
    });
    events.on("keyW", () => {
      this.keyW.isDown = true;
    });
    events.on("keyX", () => {
      this.keyX.isDown = true;
    });
    events.on("keyZ", () => {
      this.interacFunction();
      this.keyZ.isDown = true;
    });
    events.on("keyC", () => {
      this.keyC.isDown = true;
    });
    events.on("keyNone", () => {
      this.keyA.isDown = false;
      this.keyD.isDown = false;
      this.keyW.isDown = false;
      this.keyX.isDown = false;
      this.keyZ.isDown = false;
      this.keyC.isDown = false;
    });
  }

  private cage1() {
    this.object = "cage1";
  }
  private cage2() {
    this.object = "cage2";
  }
  private cage3() {
    this.object = "cage3";
  }
  private cage4() {
    this.object = "cage4";
  }

  private carpi1() {
    this.object = "carpi1";
  }
  private carpi2() {
    this.object = "carpi2";
  }
  private carpi3() {
    this.object = "carpi3";
  }
}
