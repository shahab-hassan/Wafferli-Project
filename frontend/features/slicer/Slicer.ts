import { createSlice } from "@reduxjs/toolkit";

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const baseUrlImg = process.env.NEXT_PUBLIC_BASE_URL_IMG;

//  Token getter function (checks both storages)
const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const getConfig = () => ({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getConfigFormData = () => ({
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});

const initialState = {
  isLoading: false,
  isError: false,
};

const Slicer = createSlice({
  name: "slicer",
  initialState,
  reducers: {},
});

export const {} = Slicer.actions;
export default Slicer.reducer;
