import music1 from "./assets/audios/music/Fantasy Chronicles.mp3";
import music2 from "./assets/audios/music/Beauty of the Earth.mp3";
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
};
