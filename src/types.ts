import { FieldValue } from "firebase/firestore";

export enum Section {
  home = "home",
  about = "about",
  hof = "halloffame",
  scores = "scores",
  setts = "settings",
  main = "maingame",
}

export enum SoundIds {
  mus1 = "music1",
  mus2 = "music2",
  mus3 = "music3",
  acpt = "acceptSfx",
  click = "clickSfx",
  cube = "cubeSfx",
  rej = "rejectSfx",
  key = "keyboardSfx",
}

export enum ModalKeys {
  start = "startgame",
  pause = "pausegame",
  confirm = "confirmation",
  set = "settings",
  setsou = "set_sound",
  setcon = "set_controls",
  tips = "tips",
}

export enum ConfirmKeys {
  res = "Are you sure you want to reset",
  newGame = "No active game found. Start a new game",
}

export interface CubeInt {
  position: string;
  color: string;
}

export interface PlayerInfoInt {
  uid: string;
  name: string;
  avi: string;
  createdAt: FieldValue | string;
}

export interface GameInfoInt {
  id: string;
  startedAt: FieldValue | string;
  updatedAt: FieldValue | string;
  duration: number;
  moves: number;
  uid: string;
  isDone: boolean;
  cubes: {
    left: CubeInt[];
    right: CubeInt[];
    center: CubeInt[];
  };
}

export enum CubeEnum {
  r = "right",
  l = "left",
  c = "center",
  t = "top",
  b = "bottom",
}

export enum StorageKeys {
  rcs = "rc-sound",
}

export enum ControlType {
  bt = "button",
  s = "swipe",
  b = "both",
}

export enum CubeView {
  ufr = "up-face-right",
  ufl = "up-face-left",
  bfr = "bottom-face-right",
  bfl = "bottom-face-left",
}
