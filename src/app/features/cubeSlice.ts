import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameInfoInt, PlayerInfoInt } from "../../types";
import {
  createGame,
  createPlayer,
  getGameInfo,
  getPlayer,
  updateGame,
} from "./cubeAsyncThunk";

interface InitialStateInt {
  playerInfo: PlayerInfoInt | null;
  loading: boolean;
  gameInfo: GameInfoInt | null;
  error: any;
  isInitializeSuccess: boolean;
  isInitializeFailed: boolean;
  saving: boolean;
  savingSuccess: boolean;
  savingFailed: boolean;
  fetchingGame: boolean;
  fetchingPlayer: boolean;
  fetchingPlayerSuccess: boolean;
  fetchingPlayerFailed: boolean;
  fetchingGameSuccess: boolean;
  fetchingGameFailed: boolean;
}

const initialState: InitialStateInt = {
  playerInfo: null,
  loading: false,
  gameInfo: null,
  error: null,
  isInitializeFailed: false,
  isInitializeSuccess: false,
  saving: false,
  savingSuccess: false,
  savingFailed: false,
  fetchingGame: false,
  fetchingPlayer: false,
  fetchingPlayerSuccess: false,
  fetchingPlayerFailed: false,
  fetchingGameSuccess: false,
  fetchingGameFailed: false,
};

export const cubeSlice = createSlice({
  name: "cube",
  initialState,
  reducers: {
    resetInitializedFailed(state) {
      state.isInitializeFailed = false;
    },
    resetInitializedSuccess(state) {
      state.isInitializeSuccess = false;
    },
    resetFetchingPlayerFailed(state) {
      state.fetchingPlayerFailed = false;
    },
    resetFetchingPlayerSuccess(state) {
      state.fetchingPlayerSuccess = false;
    },
    resetFetchingGameFailed(state) {
      state.fetchingGameFailed = false;
    },
    resetFetchingGameSuccess(state) {
      state.fetchingGameSuccess = false;
    },
    resetSavingSuccess(state) {
      state.savingSuccess = false;
    },
    resetSavingFailed(state) {
      state.savingFailed = false;
    },
  },
  extraReducers: (builder) => {
    // ? Create Player
    builder
      .addCase(createPlayer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPlayer.fulfilled, (state, action) => {
        state.loading = false;
        state.playerInfo = { ...action.payload.playerInfo, createdAt: "" };
        state.isInitializeSuccess = true;
      })
      .addCase(createPlayer.rejected, (state, error) => {
        state.loading = false;
        state.isInitializeFailed = true;
        state.error = error;
      });

    // ? Create Game
    builder
      .addCase(createGame.pending, (state) => {
        state.saving = true;
      })
      .addCase(
        createGame.fulfilled,
        (state, action: PayloadAction<GameInfoInt>) => {
          state.saving = false;
          state.savingSuccess = true;
          state.gameInfo = action.payload;
        }
      )
      .addCase(createGame.rejected, (state, error) => {
        state.saving = false;
        state.savingFailed = true;
        state.error = error;
      });

    // ? UPdate Game
    builder
      .addCase(updateGame.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateGame.fulfilled, (state) => {
        state.saving = false;
        state.savingSuccess = true;
      })
      .addCase(updateGame.rejected, (state, error) => {
        state.saving = false;
        state.savingFailed = true;
        state.error = error;
      });

    // ? Fetch Game
    builder
      .addCase(getGameInfo.pending, (state) => {
        state.fetchingGame = true;
      })
      .addCase(
        getGameInfo.fulfilled,
        (state, action: PayloadAction<GameInfoInt>) => {
          state.fetchingGame = false;
          state.gameInfo = action.payload;
          state.fetchingGameSuccess = true;
        }
      )
      .addCase(getGameInfo.rejected, (state, error) => {
        state.fetchingGame = false;
        state.fetchingGameFailed = true;
        state.error = error;
      });

    // ? Fetch Player
    builder
      .addCase(getPlayer.pending, (state) => {
        state.fetchingPlayer = true;
        state.loading = true;
      })
      .addCase(
        getPlayer.fulfilled,
        (state, action: PayloadAction<PlayerInfoInt>) => {
          state.fetchingPlayer = false;
          state.playerInfo = action.payload;
          state.fetchingPlayerSuccess = true;
          state.loading = false;
          state.isInitializeSuccess = true;
        }
      )
      .addCase(getPlayer.rejected, (state, error) => {
        state.fetchingPlayer = false;
        state.error = error;
        state.fetchingPlayerFailed = true;
        state.loading = false;
        state.isInitializeFailed = true;
      });
  },
});

export default cubeSlice.reducer;
