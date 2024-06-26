import music1 from "./assets/audios/music/Fantasy Chronicles.mp3";
import music2 from "./assets/audios/music/Beauty of the Earth.mp3";
import music3 from "./assets/audios/music/smooth-waters-115977_2.mp3";
import acceptSfx from "./assets/audios/sfx/accept.mp3";
import clickSfx from "./assets/audios/sfx/clicks.mp3";
import cubeSfx from "./assets/audios/sfx/cube.mp3";
import rejectSfx from "./assets/audios/sfx/reject.mp3";
import keyboardSfx from "./assets/audios/sfx/keyboard.mp3";

const pauseMenu: { title: string; link?: string }[] = [
  {
    title: "Continue",
  },
  {
    title: "Main menu",
    link: "/",
  },
  {
    title: "Settings",
  },
  {
    title: "Reset",
  },
];

const settingsOpts = ["Sound", "Controls"];

const tipsOpts = [
  "Control type can be changed in settings",
  "Use the four little cube buttons at the top to change cube view",
  "Rotate the cube with the button below it",
  "Game is saved every 20 seconds (if move is made)",
  "Save game manually using save button at the top right corner",
  "Save and use id to continue from last saved point",
];

export {
  music1,
  music2,
  acceptSfx,
  clickSfx,
  cubeSfx,
  rejectSfx,
  keyboardSfx,
  pauseMenu,
  settingsOpts,
  tipsOpts,
  music3,
};
