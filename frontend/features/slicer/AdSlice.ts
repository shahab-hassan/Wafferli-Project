import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { HandleApiError } from "@/features/utils/HandleApiError";
import {
  // Ad
  CREATE_AD_API,
  GET_SUGGESTION_SEARCH_API,
  GET_MY_ADS_API,
  GET_AD_BY_ID_API,
  // Review
  CREATE_REVIEW_API,
  GET_REVIEWS_API,
  TOGGLE_REVIEW_LIKE_API,

  // Favorites
  TOGGLE_FAVORITE_API,
  GET_FAVORITES_API,

  // Explore
  GET_FEATURED_EXPLORE_API,
  GET_FEATURED_EXPLORE_DETAILS_API,
  GET__ALL_EXPLORE_API,
  GET_EXPLORE_SEARCH_API,

  // Product
  GET_FEATURED_PRODUCT_DETAILS_API,
  GET_PRODUCT_SEARCH_API,
  GET__ALL_PRODUCT_API,
  GET_FEATURED_PRODUCT_API,

  // Event
  GET_FEATURED_EVENT_API,
  GET_FEATURED_EVENT_DETAILS_API,
  GET__ALL_EVENTS_API,
  GET_EVENTS_SEARCH_API,

  // Service
  GET_FEATURED_SERVICE_API,
  GET_FEATURED_SERVICE_DETAILS_API,
  GET__ALL_SERVICE_API,
  GET_SERVICE_SEARCH_API,
  UPDATE_AD_API,
  DELETE_AD_API,

  // Offer/FlashDeal
  GET_OFFER_DETAILS_API,
  GET_FEATURED_FLASHDEAL_API,
  GET_ALL_FLASHDEAL_API,
  GET_FLASHDEAL_SEARCH_API,
  GET_OFFER_SEARCH_API,
  GET_ALL_OFFER_API,
  CLAIM_OFFER_API,
  MY_CLAIMED_OFFER_API,
  SEARCH_CLAIMED_OFFER_API,
  GET_SELLER_DETAILS_API,
} from "../api/Api";
import { baseUrl, getConfigFormData, getConfig } from "../slicer/Slicer";
import {
  AdState,
  BaseAdData,
  EventAdData,
  ExploreAdData,
  OfferAdData,
  ProductAdData,
  ServiceAdData,
} from "@/types/ad";

export const CreateAd = createAsyncThunk(
  "ad/CreateAd",
  async (data: FormData, { rejectWithValue }) => {
    try {
      // ✅ FormData ko readable object me convert kar rahe ho (sirf debugging ke liye)
      const formDataEntries: Record<string, any> = {};
      data.forEach((value, key) => {
        formDataEntries[key] = value instanceof File ? value.name : value;
      });
      console.log("📤 Sending FormData:", formDataEntries);

      // ✅ API call with FormData
      const response = await axios.post(baseUrl + CREATE_AD_API, data, {
        ...getConfigFormData(),
        timeout: 30000, // good practice to avoid hanging requests
      });

      // ✅ Success toast
      toast.success(response.data.message || "Ad created successfully!");
      return response.data;
    } catch (err) {
      // ✅ Custom error handler
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const GetMyAds = createAsyncThunk(
  "ad/GetMyAds",
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${GET_MY_ADS_API}`, {
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

export const GetAdById = createAsyncThunk(
  "ad/GetAdById",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${GET_AD_BY_ID_API}/${id}`, {
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

export const UpdatedAd = createAsyncThunk(
  "ad/UpdatedAd",
  async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      // ✅ Debug readable formdata
      const formDataEntries: Record<string, any> = {};
      data.forEach((value, key) => {
        formDataEntries[key] = value instanceof File ? value.name : value;
      });
      console.log("📤 Sending FormData:", formDataEntries);
      console.log(id, "id");
      // ✅ API call
      const response = await axios.put(
        `${baseUrl + UPDATE_AD_API}/${id}`,
        data,
        {
          ...getConfigFormData(),
          timeout: 30000,
        }
      );

      toast.success(response.data.message || "Ad updated successfully!");
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const DeletedAd = createAsyncThunk(
  "ad/DeletedAd",
  async (id: any, { rejectWithValue }) => {
    try {
      console.log("id:", id);
      const response = await axios.delete(
        `${baseUrl + DELETE_AD_API}/${id}`,
        getConfig()
      );
      toast.success(response.data.message || "Ad Deleted successfully!");
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Explore
export const GetFeaturedExplore = createAsyncThunk(
  "ad/GetFeaturedExplore",
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + GET_FEATURED_EXPLORE_API,
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

export const GetFeaturedExploreDetails = createAsyncThunk(
  "ad/GetFeaturedExploreDetails",
  async (id: string, { rejectWithValue }) => {
    // Change number to string
    try {
      const response = await axios.get(
        baseUrl + GET_FEATURED_EXPLORE_DETAILS_API + "/" + id,
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

export const GetAllExplore = createAsyncThunk(
  "ad/GetAllExplore",
  async (
    args: {
      page?: number;
      limit?: number;
      category?: string;
      city?: string;
      neighbourhood?: string;
      minRating?: number;
      features?: string[];
      sortBy?: string;
      sortOrder?: string;
    },
    { rejectWithValue }
  ) => {
    const { page = 1, limit = 9, ...filters } = args;
    try {
      const response = await axios.get(`${baseUrl}${GET__ALL_EXPLORE_API}`, {
        params: { page, limit, ...filters },
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
export const SearchExplore = createAsyncThunk(
  "ad/SearchExplore",
  async (
    args: {
      query?: string;
      page?: number;
      limit?: number;
      category?: string;
      city?: string;
      neighbourhood?: string;
      minRating?: number;
      features?: string[];
      sortBy?: string;
      sortOrder?: string;
    },
    { rejectWithValue }
  ) => {
    const { query, page = 1, limit = 9, ...filters } = args;
    try {
      const params = { query, page, limit, ...filters };
      const response = await axios.get(`${baseUrl}${GET_EXPLORE_SEARCH_API}`, {
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

// Product

export const GetFeaturedProduct = createAsyncThunk(
  "ad/GetFeaturedProduct",
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + GET_FEATURED_PRODUCT_API,
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

export const GetFeaturedProductDetails = createAsyncThunk(
  "ad/GetFeaturedProductDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + GET_FEATURED_PRODUCT_DETAILS_API + "/" + id,
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

export const GetAllProducts = createAsyncThunk(
  "ad/GetAllProducts",
  async (
    args: {
      page?: number;
      limit?: number;
      category?: string;
      subcategory?: string;
      city?: string;
      neighbourhood?: string;
      minRating?: number;
      features?: string[];
      sortBy?: string;
      sortOrder?: string;
    },
    { rejectWithValue }
  ) => {
    const { page = 1, limit = 9, ...filters } = args;
    try {
      const response = await axios.get(`${baseUrl}${GET__ALL_PRODUCT_API}`, {
        params: { page, limit, ...filters },
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
export const SearchProducts = createAsyncThunk(
  "ad/SearchProducts",
  async (
    args: {
      query?: string;
      page?: number;
      limit?: number;
      category?: string;
      city?: string;
      neighbourhood?: string;
      minRating?: number;
      features?: string[];
      sortBy?: string;
      sortOrder?: string;
    },
    { rejectWithValue }
  ) => {
    const { query, page = 1, limit = 9, ...filters } = args;
    try {
      const params = { query, page, limit, ...filters };
      const response = await axios.get(`${baseUrl}${GET_PRODUCT_SEARCH_API}`, {
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

// Events
export const GetFeaturedEventDetails = createAsyncThunk(
  "ad/GetFeaturedEventDetails",
  async (id: string, { rejectWithValue }) => {
    // Change number to string
    try {
      const response = await axios.get(
        baseUrl + GET_FEATURED_EVENT_DETAILS_API + "/" + id,
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

export const GetFeaturedEvent = createAsyncThunk(
  "ad/GetFeaturedEvent",
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + GET_FEATURED_EVENT_API,
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

export const GetAllEvents = createAsyncThunk(
  "ad/GetAllEvents",
  async (
    args: {
      page?: number;
      limit?: number;
      category?: string;
      city?: string;
      neighbourhood?: string;
      minRating?: number;
      features?: string[];
      sortBy?: string;
      sortOrder?: string;
    },
    { rejectWithValue }
  ) => {
    const { page = 1, limit = 9, ...filters } = args;
    try {
      const response = await axios.get(`${baseUrl}${GET__ALL_EVENTS_API}`, {
        params: { page, limit, ...filters },
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
export const SearchEvents = createAsyncThunk(
  "ad/SearchEvents",
  async (
    args: {
      query?: string;
      page?: number;
      limit?: number;
      category?: string;
      city?: string;
      neighbourhood?: string;
      minRating?: number;
      features?: string[];
      sortBy?: string;
      sortOrder?: string;
    },
    { rejectWithValue }
  ) => {
    const { query, page = 1, limit = 9, ...filters } = args;
    try {
      const params = { query, page, limit, ...filters };
      const response = await axios.get(`${baseUrl}${GET_EVENTS_SEARCH_API}`, {
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

// Service

export const GetFeaturedService = createAsyncThunk(
  "ad/GetFeaturedService",
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + GET_FEATURED_SERVICE_API,
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

export const GetFeaturedServiceDetails = createAsyncThunk(
  "ad/GetFeaturedServiceDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + GET_FEATURED_SERVICE_DETAILS_API + "/" + id,
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

export const GetAllService = createAsyncThunk(
  "ad/GetAllService",
  async (
    args: {
      page?: number;
      limit?: number;
      category?: string;
      city?: string;
      neighbourhood?: string;
      minRating?: number;
      sortBy?: string;
      sortOrder?: string;
    },
    { rejectWithValue }
  ) => {
    const { page = 1, limit = 9, ...filters } = args;
    try {
      const response = await axios.get(`${baseUrl}${GET__ALL_SERVICE_API}`, {
        params: { page, limit, ...filters },
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
export const SearchService = createAsyncThunk(
  "ad/SearchService",
  async (
    args: {
      query?: string;
      page?: number;
      limit?: number;
      category?: string;
      city?: string;
      neighbourhood?: string;
      minRating?: number;
      sortBy?: string;
      sortOrder?: string;
    },
    { rejectWithValue }
  ) => {
    const { query, page = 1, limit = 9, ...filters } = args;
    try {
      const params = { query, page, limit, ...filters };
      const response = await axios.get(`${baseUrl}${GET_SERVICE_SEARCH_API}`, {
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

// Offer/FlashDeal

export const GetFeaturedFlashDeal = createAsyncThunk(
  "ad/GetFeaturedFlashDeal",
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + GET_FEATURED_FLASHDEAL_API,
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

export const GetOfferDetails = createAsyncThunk(
  "ad/GetOfferDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseUrl + GET_OFFER_DETAILS_API + "/" + id,
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

export const GetAllFlashDeal = createAsyncThunk(
  "ad/GetAllFlashDeal",
  async (
    args: {
      page?: number;
      limit?: number;
      category?: string;
      city?: string;
      neighbourhood?: string;
      minRating?: number;
      maxRating?: number;
      minPrice?: number;
      maxPrice?: number;
      minDiscount?: number;
      maxDiscount?: number;
      sortBy?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Remove undefined and empty string values
      const cleanedParams = Object.entries(args).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      const response = await axios.get(`${baseUrl}${GET_ALL_FLASHDEAL_API}`, {
        params: cleanedParams,
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

export const SearchFlashDeal = createAsyncThunk(
  "ad/SearchFlashDeal",
  async (
    args: {
      query?: string;
      page?: number;
      limit?: number;
      category?: string;
      city?: string;
      neighbourhood?: string;
      minRating?: number;
      maxRating?: number;
      minPrice?: number;
      maxPrice?: number;
      minDiscount?: number;
      maxDiscount?: number;
      sortBy?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Remove undefined and empty string values
      const cleanedParams = Object.entries(args).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      const response = await axios.get(
        `${baseUrl}${GET_FLASHDEAL_SEARCH_API}`,
        {
          params: cleanedParams,
          ...getConfig(),
        }
      );
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const GetAllOffers = createAsyncThunk(
  "ad/GetAllOffers",
  async (
    args: {
      page?: number;
      limit?: number;
      category?: string;
      city?: string;
      neighbourhood?: string;
      minRating?: number;
      maxRating?: number;
      minPrice?: number;
      maxPrice?: number;
      minDiscount?: number;
      maxDiscount?: number;
      sortBy?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Remove undefined and empty string values
      const cleanedParams = Object.entries(args).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      const response = await axios.get(`${baseUrl}${GET_ALL_OFFER_API}`, {
        params: cleanedParams,
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

export const SearchOffers = createAsyncThunk(
  "ad/SearchOffers",
  async (
    args: {
      query?: string;
      page?: number;
      limit?: number;
      category?: string;
      city?: string;
      neighbourhood?: string;
      minRating?: number;
      maxRating?: number;
      minPrice?: number;
      maxPrice?: number;
      minDiscount?: number;
      maxDiscount?: number;
      sortBy?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Remove undefined and empty string values
      const cleanedParams = Object.entries(args).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      const response = await axios.get(`${baseUrl}${GET_OFFER_SEARCH_API}`, {
        params: cleanedParams,
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

export const ClaimOffer = createAsyncThunk(
  "ad/ClaimOffer",
  async (claimData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + CLAIM_OFFER_API,
        claimData,
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

// Review

export const GetAdReviews = createAsyncThunk(
  "ad/GetAdReviews",
  async (
    {
      adId,
      page = 1,
      limit = 5,
    }: { adId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${baseUrl}${GET_REVIEWS_API}/${adId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Load more reviews thunk
export const LoadMoreReviews = createAsyncThunk(
  "ad/LoadMoreReviews",
  async (
    { adId, page, limit = 5 }: { adId: string; page: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${baseUrl}${GET_REVIEWS_API}/${adId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const CreateReview = createAsyncThunk(
  "ad/createReview",
  async (reviewData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + CREATE_REVIEW_API + "/" + reviewData.adId,
        reviewData,
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

export const ToggleReviewLike = createAsyncThunk(
  "ad/ToggleReviewLike",
  async (reviewId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseUrl + TOGGLE_REVIEW_LIKE_API + "/" + reviewId,
        {},
        getConfig()
      );
      toast.success(response.data.message);
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Toggle favorite
export const toggleFavorite = createAsyncThunk(
  "favorite/toggleFavorite",
  async (adId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}${TOGGLE_FAVORITE_API}/${adId}`,
        {},
        getConfig()
      );
      toast.success(response.data.message);
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const GetFavorites = createAsyncThunk(
  "favorite/GetFavorites",
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseUrl}${GET_FAVORITES_API}`,
        getConfig()
      );
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const SearchSuggestion = createAsyncThunk(
  "ad/SearchSuggestion",
  async (
    { query, type = "all" }: { query: string; type?: string },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("q", query);
      if (type) params.append("type", type);

      const response = await axios.get(
        `${baseUrl}${GET_SUGGESTION_SEARCH_API}?${params.toString()}`
      );
      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const MyClaimedOffer = createAsyncThunk(
  "ad/MyClaimedOffer",
  async (
    { page = 1, limit = 5 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const config = getConfig();

      const response = await axios.get(`${baseUrl}${MY_CLAIMED_OFFER_API}`, {
        params: { page, limit },
        ...config, // ← config include properly
      });

      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const SearchClaimedOffer = createAsyncThunk(
  "ad/SearchClaimedOffer",
  async (
    {
      query,
      page = 1,
      limit = 5,
    }: { query: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const config = getConfig();

      const response = await axios.get(
        `${baseUrl}${SEARCH_CLAIMED_OFFER_API}`,
        {
          params: { query, page, limit },
          ...config, // ← config include properly
        }
      );

      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const GetSellerDetails = createAsyncThunk(
  "ad/GetSellerDetails",
  async (
    { sellerId, adType, page = 1, limit = 5 }: any,
    { rejectWithValue }
  ) => {
    try {
      const config = getConfig();

      const response = await axios.get(`${baseUrl}${GET_SELLER_DETAILS_API}`, {
        params: { sellerId, adType, page, limit },
        ...config, // ← config include properly
      });

      return response.data;
    } catch (err) {
      const errorMsg = HandleApiError(err);
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Common base initial state - sirf common fields
const commonInitialState: BaseAdData = {
  type: null,
  images: [],
  title: "",
  description: "",
  city: "",
  neighbourhood: "",
  phone: "",
  showPhone: false,
  locationSameAsProfile: false,
  paymentMode: "monthly",
};

// Type-specific initial states - common fields + type-specific fields
const initialExploreData: ExploreAdData = {
  ...commonInitialState,
  type: "explore",
  exploreName: "",
  exploreDescription: "",
  startTime: "",
  endTime: "",
};

const initialProductData: ProductAdData = {
  ...commonInitialState,
  type: "product",
  category: "",
  subCategory: "",
  recurring: false,
  quantity: null,
  askingPrice: null,
  discount: false,
  discountPercent: null,
};

const initialServiceData: ServiceAdData = {
  ...commonInitialState,
  type: "service",
  category: "",
  subCategory: "",
  servicePrice: "",
  serviceType: "",
};

const initialEventData: EventAdData = {
  ...commonInitialState,
  type: "event",
  eventType: "",
  eventDate: "",
  eventTime: "",
  endTime: "",
  features: [],
};

const initialOfferData: OfferAdData = {
  ...commonInitialState,
  type: "offer",
  expiryDate: "",
  flashDeal: false,
  discountDeal: false,
  fullPrice: null,
  discountPercent: null,
  offerDetail: "",
  category: "",
};

const initialState: AdState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMessage: undefined,

  adData: commonInitialState, // Default empty state
  featuredExploreAds: [],
  featuredProductAds: [],
  featuredEventAds: [],
  featuredExploreDetails: [],
  featuredProductDetails: [],
  featuredEventDetails: [],
  allAdReviews: [],
  currentPage: 1,
  hasMore: true,
  Ad: [],
};

const AdSlice = createSlice({
  name: "ad",
  initialState,
  reducers: {
    setAdData: (state, action) => {
      state.adData = { ...state.adData, ...action.payload };
    },
    resetAdData: (state) => {
      state.adData = commonInitialState;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = undefined;
    },

    setAdType: (state, action) => {
      // Reset to appropriate initial state based on type
      switch (action.payload) {
        case "product":
          state.adData = initialProductData;
          break;
        case "service":
          state.adData = initialServiceData;
          break;
        case "event":
          state.adData = initialEventData;
          break;
        case "offer":
          state.adData = initialOfferData;
          break;
        case "explore":
          state.adData = initialExploreData;
          break;
        default:
          state.adData = { ...commonInitialState, type: action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreateAd.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = undefined;
      })
      .addCase(CreateAd.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
      })
      .addCase(CreateAd.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      });

    builder
      .addCase(GetFeaturedExplore.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(GetFeaturedExplore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.featuredExploreAds = action.payload?.data || [];
      })

      .addCase(GetFeaturedExplore.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });

    builder
      .addCase(GetFeaturedProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(GetFeaturedProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.featuredProductAds = action.payload?.data || [];
      })

      .addCase(GetFeaturedProduct.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });

    builder
      .addCase(GetFeaturedEvent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(GetFeaturedEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.featuredEventAds = action.payload?.data || [];
      })

      .addCase(GetFeaturedEvent.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });

    builder
      .addCase(GetFeaturedExploreDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(GetFeaturedExploreDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.featuredExploreDetails = action.payload?.data || [];
      })

      .addCase(GetFeaturedExploreDetails.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });

    builder
      .addCase(GetFeaturedProductDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(GetFeaturedProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.featuredProductDetails = action.payload?.data || [];
      })

      .addCase(GetFeaturedProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });

    builder
      .addCase(GetFeaturedEventDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(GetFeaturedEventDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.featuredEventDetails = action.payload?.data || [];
      })

      .addCase(GetFeaturedEventDetails.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });

    builder
      .addCase(GetAdReviews.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(GetAdReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const data = action.payload?.data;

        // Initial load - replace all reviews
        state.allAdReviews = data?.reviews || [];
        state.currentPage = data?.pagination?.currentPage;
        state.hasMore = data?.pagination?.hasNext;
      })
      .addCase(GetAdReviews.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      // LoadMoreReviews - APPEND new reviews
      .addCase(LoadMoreReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LoadMoreReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const data = action.payload?.data;

        // Append new reviews to existing ones
        state.allAdReviews = [...state.allAdReviews, ...(data?.reviews || [])];
        state.currentPage = data?.pagination?.currentPage;
        state.hasMore = data?.pagination?.hasNext;
      })
      .addCase(LoadMoreReviews.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });

    builder
      .addCase(GetAdById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(GetAdById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const data = action.payload?.data.ad;
        state.Ad = data || [];
      })
      .addCase(GetAdById.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export const { setAdData, resetAdData, setAdType } = AdSlice.actions;
export default AdSlice.reducer;
