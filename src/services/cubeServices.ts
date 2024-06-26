import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
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

  updateGame(gameInfo: Omit<GameInfoInt, "startedAt" | "isDone">) {
    const docRef = doc(db, `players/${gameInfo.uid}/games/${gameInfo.id}`);

    return updateDoc(docRef, gameInfo);
  }

  fetchGame(uid: string) {
    const q = query(
      collection(db, `players/${uid}/games`),
      where("isDone", "==", false)
    );
    return getDocs(q);
  }

  fetchPlayer(uid: string) {
    const docRef = doc(db, `players/${uid}`);
    return getDoc(docRef);
  }
}

export const cubeServices = new CubeServices();
