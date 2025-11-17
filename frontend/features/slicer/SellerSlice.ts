import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { HandleApiError } from "@/features/utils/HandleApiError";
import { CREATE_SELLER_API } from "../api/Api";
import { baseUrl, getConfigFormData } from "./Slicer";

// ✅ Async thunk for creating seller
export const CreateSeller = createAsyncThunk(
  "seller/CreateSeller",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + CREATE_SELLER_API,
        data,
        getConfigFormData()
      );

      toast.success(response.data.message || "Seller created successfully!");
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

// ✅ Load saved seller data from sessionStorage
const savedData =
  typeof window !== "undefined" ? sessionStorage.getItem("sellerData") : null;

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  isAuthenticated: false,
  role: null,
  user: null,
  sellerData: savedData ? JSON.parse(savedData) : {},
};

// ✅ Seller slice
const Seller = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setSellerData: (state, action) => {
      const payload = { ...action.payload };

      // ✅ Create temporary preview URLs for images before storing
      const safePayload: any = {};

      if (payload.logo instanceof File) {
        safePayload.logoPreview = URL.createObjectURL(payload.logo);
      }

      if (payload.gallery && Array.isArray(payload.gallery)) {
        safePayload.galleryPreviews = payload.gallery.map((file: File) =>
          URL.createObjectURL(file)
        );
      }

      // ✅ Merge safe (preview-only) data with old state
      state.sellerData = {
        ...state.sellerData,
        ...safePayload,
        ...payload,
      };

      // ✅ Remove non-serializable values before saving to session
      const dataToSave = { ...state.sellerData };
      delete dataToSave.logo;
      delete dataToSave.gallery;

      sessionStorage.setItem("sellerData", JSON.stringify(dataToSave));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreateSeller.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(CreateSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // ✅ Use response data safely
        state.sellerData = action.payload?.data || action.payload;
        sessionStorage.setItem("sellerData", JSON.stringify(state.sellerData));
      })
      .addCase(CreateSeller.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { setSellerData } = Seller.actions;
export default Seller.reducer;
