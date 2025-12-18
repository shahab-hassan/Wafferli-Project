import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { HandleApiError } from "@/features/utils/HandleApiError";
import {
  SIGNUP_API,
  SEND_SIGNUP_OTP_API,
  VERIFY_SIGNUP_OTP_API,
  CHECK_AUTH_API,
  VERIFY_OTP_API,
  LOGIN_API,
  LOGOUT_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  FORGOT_PASSWORD_API,
  RESET_PASSWORD_API,
  RESEND_OTP_API,
} from "../api/Api";
import { baseUrl, getConfig } from "./Slicer";

export const SendSignupOtp = createAsyncThunk(
  "auth/SendSignupOtp",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + SEND_SIGNUP_OTP_API,
        data,
        getConfig()
      );
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

// Verify Signup OTP thunk
export const VerifySignupOtp = createAsyncThunk(
  "auth/VerifySignupOtp",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + VERIFY_SIGNUP_OTP_API,
        data,
        getConfig()
      );
      toast.success(response.data.message || "Account created successfully!");
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);
//  SignUp thunk
export const SignUp = createAsyncThunk(
  "auth/SignUp",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + SIGNUP_API,
        data,
        getConfig()
      );

      toast.success(response.data.message || "Registration successful!");
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const ResendOtp = createAsyncThunk(
  "auth/ResendOtp",
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + RESEND_OTP_API,
        data,
        getConfig()
      );
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const Login = createAsyncThunk(
  "auth/Login",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseUrl + LOGIN_API, data, getConfig());

      toast.success(response.data.message || "Login successfuly!");
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const Logout = createAsyncThunk(
  "auth/Logout",
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseUrl + LOGOUT_API, {}, getConfig());

      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const CheckAuth = createAsyncThunk(
  "auth/CheckAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(baseUrl + CHECK_AUTH_API, getConfig());
      return res.data;
    } catch (err) {
      // const errorMsg = HandleApiError(err);
      return rejectWithValue(err);
    }
  }
);

// export const UserDetails = createAsyncThunk(
//   "auth/UserDetails",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(baseUrl + USER_DETALS_API, getConfig());
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   }
// );

export const UpdateProfile = createAsyncThunk(
  "auth/UpdateProfile",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        baseUrl + UPDATE_PROFILE_API,
        data,
        getConfig()
      );

      toast.success(response.data.message || "Update successfuly!");
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const ChangePassword = createAsyncThunk(
  "auth/ChangePassword",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        baseUrl + CHANGE_PASSWORD_API,
        data,
        getConfig()
      );

      toast.success(response.data.message || "Change Password successfuly!");
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const Forgot = createAsyncThunk(
  "auth/ForgotPassword",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + FORGOT_PASSWORD_API,
        data,
        getConfig()
      );

      toast.success(response.data.message || "Please Check Your Email");
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const Verify = createAsyncThunk(
  "auth/VerifyOtp",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + VERIFY_OTP_API,
        data,
        getConfig()
      );

      toast.success(response.data.message || "Verify Sucessfully!");
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const Reset = createAsyncThunk(
  "auth/Reset",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + RESET_PASSWORD_API,
        data,
        getConfig()
      );

      toast.success(response.data.message || "Verify Sucessfully!");
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const Resend = createAsyncThunk(
  "auth/Reset",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + RESEND_OTP_API,
        data,
        getConfig()
      );

      toast.success(response.data.message || "Verify Sucessfully!");
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
  isAuthenticated: false,
  role: null,
  user: null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SignUp.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(SignUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload?.data?.user || null;
        state.role = action.payload?.data?.user?.role || null;
      })

      .addCase(SignUp.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
      });

    builder
      .addCase(Login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(Login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload?.data?.user || null;
        state.role = action.payload?.data?.user?.role || null;
      })

      .addCase(Login.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
      });

    builder
      .addCase(Logout.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(Logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
      })
      .addCase(Logout.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
      });

    builder
      .addCase(CheckAuth.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(CheckAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload?.data || null;
        state.role = action.payload?.data?.role || null;
      })

      .addCase(CheckAuth.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
      });

    builder
      .addCase(UpdateProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(UpdateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload?.data || null;
        state.role = action.payload?.data?.role || null;
      })

      .addCase(UpdateProfile.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
      });
  },
});

export const { setRole } = AuthSlice.actions;

export default AuthSlice.reducer;
