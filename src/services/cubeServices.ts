import { doc, setDoc } from "firebase/firestore";
import { GameInfoInt, PlayerInfoInt } from "../types";
import { db } from "./config";

class CubeServices {
  createPlayer(playerInfo: PlayerInfoInt) {
    const docRef = doc(db, `players/${playerInfo.uid}`);
    return setDoc(docRef, playerInfo);
  }

  createGame(gameInfo: GameInfoInt) {
    const docRef = doc(db, `players/${gameInfo.uid}/games/${gameInfo.id}`);
    return setDoc(docRef, gameInfo);
  }
}

export const cubeServices = new CubeServices();
