export interface BaseAdData {
  type: "product" | "service" | "event" | "offer" | "explore" | null;
  images: File[];
  title: string;
  description: string;
  city: string;
  neighbourhood: string;
  phone: string;
  showPhone: boolean;
  locationSameAsProfile: boolean;
  paymentMode: "monthly" | "annually" | null;
}

export interface ExploreAdData extends BaseAdData {
  type: "explore";
  exploreName: string;
  exploreDescription: string;
  startTime: string;
  endTime: string;
}

export interface ProductAdData extends BaseAdData {
  type: "product";
  category: string;
  subCategory: string;
  recurring: boolean;
  quantity: number | null;
  askingPrice: number | null;
  discount: boolean;
  discountPercent: number | null;
}

export interface ServiceAdData extends BaseAdData {
  type: "service";
  category: string;
  subCategory: string;
  serviceType: string;
  servicePrice: string | number;
}

export interface EventAdData extends BaseAdData {
  type: "event";
  eventType: string;
  eventDate: string;
  eventTime: string;
  endTime: string;
  features: string[];
}

export interface OfferAdData extends BaseAdData {
  type: "offer";
  expiryDate: string;
  flashDeal: boolean;
  discountDeal: boolean;
  fullPrice: number | null;
  discountPercent: number | null;
  offerDetail: string;
  category: string;
}

export type AdData =
  | BaseAdData
  | ExploreAdData
  | ProductAdData
  | ServiceAdData
  | EventAdData
  | OfferAdData;

export interface AdState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  errorMessage?: string;
  adData: AdData;
  featuredExploreAds: any[];
  featuredProductAds: any[];
  featuredEventAds: any[];
  featuredExploreDetails: any[];
  featuredProductDetails: any[];
  featuredEventDetails: any[];
  allAdReviews: any[];
  currentPage: number;
  hasMore: boolean;
  Ad: [];
}
