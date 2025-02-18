import Phaser from "phaser";
import { preload } from "./scenes/preload";
import { cage } from "./scenes/cage";
import { Level } from "./scenes/level";
import { chatCarpincho } from "./scenes/chatCarpincho";
import { UIScene } from "./scenes/uiScene";
import { mainMenu } from "./scenes/mainMenu";
import { pausaScene } from "./scenes/pausaScene";
import { helpScene } from "./scenes/helpScene";
import { finalScene } from "./scenes/finalScene";
import { sceneIdioma } from "./scenes/lang";
import { langEmit } from "./scenes/langEmit";
import { alertScene } from "./scenes/alertScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 2275.55555555555555555555,
    height: 1280,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 750 },
    },
  },
  scene: [
    preload,
    sceneIdioma,
    langEmit,
    mainMenu,
    Level,
    chatCarpincho,
    UIScene,
    cage,
    pausaScene,
    helpScene,
    finalScene,
    alertScene,
  ],
};

export default new Phaser.Game(config);
