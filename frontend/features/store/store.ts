import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slicer/AuthSlice";
import sellerReducer from "../slicer/SellerSlice";
import adReducer from "../slicer/AdSlice";
import chatReducer from "../slicer/ChatSlice";
import notificationReducer from "../slicer/NotificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    seller: sellerReducer,
    ad: adReducer,
    chat: chatReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ Ignore non-serializable data for specific slices
        ignoredActions: ["seller/setSellerData", "ad/setAdData"],
        ignoredPaths: [
          "seller.sellerData.logo",
          "seller.sellerData.gallery",
          "ad.adData.images",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
