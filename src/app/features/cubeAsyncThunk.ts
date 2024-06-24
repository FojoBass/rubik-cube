import { createAsyncThunk } from "@reduxjs/toolkit";
import { GameInfoInt, PlayerInfoInt } from "../../types";
import { serverTimestamp } from "firebase/firestore";
import { cubeServices } from "../../services/cubeServices";

// todo Setup congratulatory modal
// todo remeber to merge branch

// ? Create Player
export const createPlayer = createAsyncThunk<
  { playerInfo: PlayerInfoInt },
  { uid: string; playerName: string; aviUrl: string }
>("createPlayer", async (payload, thunkApi) => {
  try {
    const playerInfo: PlayerInfoInt = {
      uid: payload.uid,
      name: payload.playerName,
      avi: payload.aviUrl,
      createdAt: serverTimestamp(),
    };
    await cubeServices.createPlayer(playerInfo);

    return { playerInfo };
  } catch (err) {
    return thunkApi.rejectWithValue(err);
  }
});

// ? Create Game
export const createGame = createAsyncThunk<GameInfoInt, GameInfoInt>(
  "createGame",
  async (payload, thunkApi) => {
    try {
      await cubeServices.createGame(payload);
      return { ...payload, startedAt: "", updatedAt: "" };
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

// ? Update Game
export const updateGame = createAsyncThunk<
  void,
  Omit<GameInfoInt, "startedAt" | "isDone">
>("updateGame", async (payload, thunkApi) => {
  try {
    await cubeServices.updateGame(payload);
  } catch (err) {
    return thunkApi.rejectWithValue(err);
  }
});

// ? Game Info
export const getGameInfo = createAsyncThunk<GameInfoInt, { uid: string }>(
  "getGameInfo",
  async (payload, thunkApi) => {
    try {
      const { uid } = payload;
      let gameInfo: any;
      const querySnapshot = await cubeServices.fetchGame(uid);

      querySnapshot.forEach((doc) => {
        gameInfo = doc.data();
      });

      console.log({ gameInfo });

      return {
        ...gameInfo,
        startedAt: gameInfo?.startedAt
          ? gameInfo.startedAt.toDate().toString()
          : "",
        updatedAt: gameInfo?.updatedAt
          ? gameInfo.updatedAt.toDate().toString()
          : "",
      } as GameInfoInt;
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

// ? Get Player
export const getPlayer = createAsyncThunk<PlayerInfoInt, { uid: string }>(
  "getPlayer",
  async (payload, thunkApi) => {
    try {
      const { uid } = payload;
      const res = await cubeServices.fetchPlayer(uid);

      let playerInfo = res.data();

      if (!playerInfo) {
        throw new Error("No player info");
      }

      return {
        ...playerInfo,
        createdAt: playerInfo?.startedAt
          ? playerInfo.startedAt.toDate().toString()
          : "",
      } as PlayerInfoInt;
    } catch (err: any) {
      return thunkApi.rejectWithValue({
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
    }
  }
);
