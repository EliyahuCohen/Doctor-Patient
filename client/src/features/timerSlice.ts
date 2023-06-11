import { createSlice } from "@reduxjs/toolkit";
export interface timerType {
  time: number;
}
const initialState: timerType = {
  time: 0,
};
const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setNewTime: (state: timerType, action: { payload: number }) => {
      state.time = action.payload;
    },
  },
});
export const { setNewTime } = timerSlice.actions;
export default timerSlice.reducer;
