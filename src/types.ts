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
  // !Save the angle of rotationf for all cubes
}
