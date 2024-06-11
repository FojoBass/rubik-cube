import { createAsyncThunk } from "@reduxjs/toolkit";
import { GameInfoInt, PlayerInfoInt } from "../../types";
import { serverTimestamp } from "firebase/firestore";
import { cubeServices } from "../../services/cubeServices";

// todo First game info will be saved after first gamee initialization

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
    // const gameInfo: GameInfoInt = {
    //   duration: 0,
    //   id: uid.randomUUID(),
    //   moves: 0,
    //   startedAt: serverTimestamp(),
    //   uid: payload.uid,
    //   isDone: false,
    //   updatedAt: serverTimestamp(),
    // };
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

      return {
        ...playerInfo,
        createdAt: playerInfo?.startedAt
          ? playerInfo.startedAt.toDate().toString()
          : "",
      } as PlayerInfoInt;
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);
