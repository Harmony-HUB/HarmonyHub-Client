import { createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import firebaseGoogleLoginThunk from "./firebaseGoogleLoginThunk";
import { UserData } from "../types";

type UserState = {
  data: UserData | null;
  loading: boolean;
  error: AxiosError | null;
};

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload;
    },
    setUserLogout: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(firebaseGoogleLoginThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(firebaseGoogleLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(firebaseGoogleLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as AxiosError;
      });
  },
});

export const { setUserData, setUserLogout } = userSlice.actions;

export default userSlice.reducer;
