// Frontend: ChatSlice.js (Updated thunks)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { HandleApiError } from "@/features/utils/HandleApiError";
import {
  GET_AD_DETAILS_API,
  GET_CHAT_ROOM_MESSAGES_API,
  GET_USERS_API,
} from "../api/Api";
import { baseUrl, getConfig } from "./Slicer";

export const GetAdDetailsForChat = createAsyncThunk(
  "chat/GetAdDetailsForChat",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseUrl + GET_AD_DETAILS_API}/${id}`,
        getConfig()
      );
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const GetUsersForSidebar = createAsyncThunk(
  "chat/GetUsersForSidebar",
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseUrl + GET_USERS_API}`,
        getConfig()
      );
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const GetChatRoomMessages = createAsyncThunk(
  "chat/GetChatRoomMessages",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseUrl + GET_CHAT_ROOM_MESSAGES_API}/${id}`,
        getConfig()
      );
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const MarkAsRead = createAsyncThunk(
  "chat/MarkAsRead",
  async (chatRoomId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}chat/mark-read/${chatRoomId}`,
        {},
        getConfig()
      );
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const GetOrCreateChatRoom = createAsyncThunk(
  "chat/GetOrCreateChatRoom",
  async (otherUserId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseUrl}chat/room/${otherUserId}`,
        getConfig()
      );
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  chatUsers: [], // Add to store chatUsers
  messages: [], // Optional
};

const chat = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetUsersForSidebar.fulfilled, (state, action) => {
      state.chatUsers = action.payload.chatUsers;
    });
    // Add other cases if needed
  },
});

export default chat.reducer;
