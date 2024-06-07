import { createAsyncThunk } from "@reduxjs/toolkit";
import { GameInfoInt, PlayerInfoInt } from "../../types";
import { serverTimestamp } from "firebase/firestore";
import ShortUniqueId from "short-unique-id";
import { cubeServices } from "../../services/cubeServices";

const uid = new ShortUniqueId({ length: 10 });

export const createPlayer = createAsyncThunk<
  { playerInfo: PlayerInfoInt; gameInfo: GameInfoInt },
  { uid: string; playerName: string; aviUrl: string }
>("createPlayer", async (payload, thunkApi) => {
  try {
    const playerInfo: PlayerInfoInt = {
      uid: payload.uid,
      name: payload.playerName,
      avi: payload.aviUrl,
      createdAt: serverTimestamp(),
    };
    const gameInfo: GameInfoInt = {
      duration: 0,
      id: uid.randomUUID(),
      moves: 0,
      startedAt: serverTimestamp(),
      uid: payload.uid,
      isDone: false,
      updatedAt: serverTimestamp(),
    };
    await cubeServices.createPlayer(playerInfo);
    await cubeServices.createGame(gameInfo);

    return { playerInfo, gameInfo };
  } catch (err) {
    return thunkApi.rejectWithValue(err);
  }
});
