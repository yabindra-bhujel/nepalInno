import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../config/instance";

export enum StatusActions {
  idle = "idle",
  loading = "loading",
  succeeded = "succeeded",
  failed = "failed",
}
export const fetchMe = createAsyncThunk("user/me", async () => {
  const response = await instance.get("/user/me");
  return response.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    status: StatusActions.idle as string,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.status = StatusActions.loading;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = StatusActions.succeeded;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = StatusActions.failed;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

// Selector to get the current user from the state
export const currentUser = (state: { user: { user: any } }) => state.user.user;

// Export the reducer
export default userSlice.reducer;
