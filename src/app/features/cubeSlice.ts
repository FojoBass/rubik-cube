import { createSlice } from "@reduxjs/toolkit";
import { GameInfoInt, PlayerInfoInt } from "../../types";
import { createPlayer } from "./cubeAsyncThunk";

interface InitialStateInt {
  playerInfo: PlayerInfoInt | null;
  loading: boolean;
  gameInfo: GameInfoInt | null;
  error: any;
  isCreateSuccess: boolean;
  isCreateFailed: boolean;
}

const initialState: InitialStateInt = {
  playerInfo: null,
  loading: false,
  gameInfo: null,
  error: null,
  isCreateFailed: false,
  isCreateSuccess: false,
};

export const cubeSlice = createSlice({
  name: "cube",
  initialState,
  reducers: {
    resetCreateFailed(state) {
      state.isCreateFailed = false;
    },
    resetCreateSuccess(state) {
      state.isCreateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPlayer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPlayer.fulfilled, (state, action) => {
        state.loading = false;
        state.gameInfo = {
          ...action.payload.gameInfo,
          startedAt: "",
          updatedAt: "",
        };
        state.playerInfo = { ...action.payload.playerInfo, createdAt: "" };
        state.isCreateSuccess = true;
      })
      .addCase(createPlayer.rejected, (state, error) => {
        state.loading = false;
        state.isCreateFailed = true;
        state.error = error;
      });
  },
});

export default cubeSlice.reducer;
