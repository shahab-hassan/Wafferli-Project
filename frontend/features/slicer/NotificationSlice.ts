import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { HandleApiError } from "@/features/utils/HandleApiError";
import { getConfig, baseUrl } from "./Slicer";

const GET_NOTIFICATION_API = "notifications";

// Fetch Notifications
export const GetNotification = createAsyncThunk(
  "notification/GetNotification",
  async (
    {
      page = 1,
      limit = 10,
      isRead,
    }: { page?: number; limit?: number; isRead?: boolean } = {},
    { rejectWithValue }
  ) => {
    try {
      const params: any = { page, limit };
      if (isRead !== undefined) params.isRead = isRead;

      const response = await axios.get(`${baseUrl}${GET_NOTIFICATION_API}`, {
        params,
        ...getConfig(),
      });

      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Mark Notification as Read
export const MarkNotificationRead = createAsyncThunk(
  "notification/MarkNotificationRead",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${baseUrl}notifications/${id}/read`,
        {},
        getConfig()
      );
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Mark Notification as Clicked
export const MarkNotificationClick = createAsyncThunk(
  "notification/MarkNotificationClick",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${baseUrl}notifications/${id}/click`,
        {},
        getConfig()
      );
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Initial State
const initialState = {
  notifications: [],
  pagination: null,
  loading: false,
  error: null,
  stats: {},
  statsLoading: false,
};

// Slice
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /** GET NOTIFICATIONS */
      .addCase(GetNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetNotification.fulfilled, (state, action) => {
        state.loading = false;

        state.notifications =
          action.payload?.data?.notifications ||
          action.payload?.notifications ||
          [];

        state.pagination =
          action.payload?.data?.pagination ||
          action.payload?.pagination ||
          null;

        state.stats = action.payload?.data?.stats || {};
      })
      .addCase(GetNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    /** MARK READ */
    builder.addCase(MarkNotificationRead.fulfilled, (state, action) => {
      const updated = action.payload?.notification;
      if (!updated) return;

      state.notifications = state.notifications.map((n: any) =>
        n._id === updated._id ? { ...n, ...updated } : n
      );
    });

    /** MARK CLICK */
    builder.addCase(MarkNotificationClick.fulfilled, (state, action) => {
      const updated = action.payload?.notification;
      if (!updated) return;

      state.notifications = state.notifications.map((n: any) =>
        n._id === updated._id ? { ...n, ...updated } : n
      );
    });
  },
});

export default notificationSlice.reducer;
