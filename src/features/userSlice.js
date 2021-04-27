import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isSignedIn: false,
    userData: null,
    selectedImg:null,
    selectedImgId:null,
  },
  reducers: {
    setSignedIn: (state, action) => {
      state.isSignedIn = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setSelectedImg: (state, action) => {
      state.selectedImg = action.payload;
    },
    setSelectedImgId: (state, action) => {
      state.selectedImgId = action.payload;
    },
  },
});

export const {
  setSignedIn,
  setUserData,
  setSelectedImg,
  setSelectedImgId
} = userSlice.actions;

export const selectSignedIn = (state) => state.user.isSignedIn;
export const selectUserData = (state) => state.user.userData;
export const selectImg = (state) => state.user.selectedImg;
export const selectImgId = (state) => state.user.selectedImgId;
export default userSlice.reducer;