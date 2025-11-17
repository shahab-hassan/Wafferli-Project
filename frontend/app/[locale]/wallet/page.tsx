"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Copy,
  Eye,
  MapPin,
  Phone,
  Globe,
  Search,
  Share2,
  QrCode,
  X,
  Gift,
} from "lucide-react";
import ClaimQRModal from "@/components/common/claim-qr-modal";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { MyClaimedOffer, SearchClaimedOffer } from "@/features/slicer/AdSlice";
import { Pagination } from "@/components/common/pagination";

// Loyalty tiers configuration
const LOYALTY_TIERS = {
  bronze: { min: 0, max: 500, name: "Bronze", color: "bg-orange-500" },
  silver: { min: 501, max: 1000, name: "Silver", color: "bg-gray-500" },
  gold: { min: 1001, max: 2000, name: "Gold", color: "bg-yellow-500" },
  diamond: { min: 2001, max: Infinity, name: "Diamond", color: "bg-blue-500" },
};

export default function MyWalletPage() {
  const t = useTranslations("wallet");

  const [claimedOffers, setClaimedOffers] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loyaltySummary, setLoyaltySummary] = useState<any>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showCodes, setShowCodes] = useState({});
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [copiedDiscount, setCopiedDiscount] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const overlayRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  // Calculate progress and next tier info based on backend data
  const calculateProgress = () => {
    if (!loyaltySummary)
      return { progress: 0, nextTier: null, pointsNeeded: 0 };

    const totalPoints = loyaltySummary.totalPoints || 0;
    const currentTier = loyaltySummary.membershipStatus?.toLowerCase();

    let nextTier = null;
    let progress = 0;
    let pointsNeeded = 0;

    // Find current tier and next tier
    const tiers = Object.keys(LOYALTY_TIERS);
    const currentTierIndex = tiers.findIndex((tier) => tier === currentTier);

    if (currentTierIndex !== -1 && currentTierIndex < tiers.length - 1) {
      nextTier = LOYALTY_TIERS[tiers[currentTierIndex + 1]];
      const currentTierConfig = LOYALTY_TIERS[currentTier];

      const pointsInCurrentTier = totalPoints - currentTierConfig.min;
      const totalPointsInTier = currentTierConfig.max - currentTierConfig.min;

      progress = Math.min(
        100,
        Math.max(0, (pointsInCurrentTier / totalPointsInTier) * 100)
      );
      pointsNeeded = nextTier.min - totalPoints;
    } else {
      // User is at the highest tier
      progress = 100;
      pointsNeeded = 0;
    }

    return { progress, nextTier, pointsNeeded };
  };

  // Fetch claimed offers from API
  const fetchAllWallet = async (page = 1, query = "") => {
    try {
      if (query.trim()) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }

      let res;

      if (query.trim()) {
        res = await dispatch(
          SearchClaimedOffer({ page, limit: 10, query }) as any
        ).unwrap();
      } else {
        res = await dispatch(
          MyClaimedOffer({ page, limit: 10 }) as any
        ).unwrap();
      }

      console.log("API Response:", res.data);

      // Set all data from API response
      setClaimedOffers(res.data.claims || []);
      setUserData(res.data.user || null);
      setLoyaltySummary(res.data.loyaltySummary || null);

      setPagination(
        res.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false,
        }
      );
    } catch (err) {
      console.error("Error fetching wallet:", err);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWallet(1, searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page: number) => {
    fetchAllWallet(page, searchQuery);
  };

  const handleShowQR = (offer: any) => {
    setSelectedOffer(offer);
    setShowQRModal(true);
  };

  const toggleCode = (id: any) => {
    setShowCodes((prev: any) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyReferral = async () => {
    try {
      if (userData?.referralCode) {
        await navigator.clipboard.writeText(userData.referralCode);
        setCopiedReferral(true);
        setTimeout(() => setCopiedReferral(false), 1200);
      }
    } catch {
      // ignore
    }
  };

  const copyDiscountCode = async (code: any) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedDiscount(true);
      setTimeout(() => setCopiedDiscount(false), 1200);
    } catch {
      // ignore
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (
    fullPrice: number,
    discountPercent: number
  ) => {
    return (fullPrice * (1 - discountPercent / 100)).toFixed(2);
  };

  const { progress, nextTier, pointsNeeded } = calculateProgress();
  const totalPoints = loyaltySummary?.totalPoints || 0;
  const membershipStatus = loyaltySummary?.membershipStatus || "Bronze";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          {t("myWallet")}
        </h1>

        {/* Loyalty Points Bar */}
        <div className="flex flex-col lg:flex-row gap-2 mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-4 flex items-center justify-between flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black">
                ⭐
              </div>
              <div>
                <div className="font-semibold">{t("loyaltyPoints")}</div>
                <div className="text-xs opacity-80">
                  {t("yourLoyaltyBalance")}
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold">{totalPoints} points</div>
          </div>

          <div className="bg-gray-500 text-white rounded-xl p-4 flex items-center justify-between flex-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center text-white">
                👑
              </div>
              <span>{membershipStatus} Member</span>
            </div>
            <div className="flex-1 mx-4 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm opacity-80 whitespace-nowrap">
              {nextTier ? (
                <>
                  {pointsNeeded} points to {nextTier.name}
                </>
              ) : (
                "Max level reached!"
              )}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {t("myClaimedOffers")}
              </h2>
              <span className="text-sm text-gray-500">
                {pagination.totalItems} {t("offers")}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("searchByOfferTitle")}
                value={searchQuery}
                onChange={handleSearch}
                className="w-full rounded-xl pl-10 pr-4 py-3 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-500">Loading your offers...</span>
                </div>
              </div>
            ) : claimedOffers.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium mb-2">
                  No claimed offers found
                </p>
                <p className="text-sm text-gray-400">
                  {searchQuery
                    ? "Try searching with different keywords"
                    : "Start claiming offers to see them here"}
                </p>
              </div>
            ) : (
              <>
                {claimedOffers.map((offer) => (
                  <div
                    key={offer._id}
                    className="bg-white rounded-xl p-4 border border-gray-200 mb-4 relative"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      {/* Offer Image */}
                      <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                        {offer.offerId?.images?.[0] && (
                          <img
                            src={offer.offerId.images[0]}
                            alt={offer.offerId.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        {/* Badge */}
                        <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-2 py-1 rounded text-xs font-semibold mb-1">
                          {offer.offerId?.adType?.toUpperCase() || "OFFER"}
                        </div>

                        <h3 className="font-bold text-gray-900">
                          {offer.offerId?.title || "No Title"}
                        </h3>

                        {/* Vendor/Seller Info */}
                        {offer.seller && (
                          <p className="text-sm text-gray-600">
                            {offer.seller.name}
                          </p>
                        )}

                        {/* Claim Date */}
                        {offer.claimedAt && (
                          <p className="text-xs text-gray-500">
                            Claimed on {formatDate(offer.claimedAt)}
                          </p>
                        )}

                        {/* Location & Expiry */}
                        <p className="text-xs text-gray-500">
                          {offer.offerId?.city && (
                            <>
                              📍 {offer.offerId.city}
                              {offer.offerId?.neighbourhood &&
                                `, ${offer.offerId.neighbourhood}`}
                              {" • "}
                            </>
                          )}
                          {offer.offerId?.expiryDate && (
                            <>
                              Valid until {formatDate(offer.offerId.expiryDate)}
                            </>
                          )}
                        </p>
                      </div>

                      {/* Price Section */}
                      <div className="text-right flex-shrink-0 w-full sm:w-auto">
                        {offer.offerId?.fullPrice && (
                          <p className="text-sm text-gray-400 line-through">
                            KWD {offer.offerId.fullPrice}
                          </p>
                        )}
                        {offer.offerId?.fullPrice &&
                          offer.offerId?.discountPercent && (
                            <p className="text-lg font-bold text-gray-900">
                              KWD{" "}
                              {calculateDiscountedPrice(
                                offer.offerId.fullPrice,
                                offer.offerId.discountPercent
                              )}
                            </p>
                          )}
                        {offer.loyaltyPoints && offer.loyaltyPoints > 0 && (
                          <p className="text-sm text-green-600 font-semibold">
                            +{offer.loyaltyPoints} points
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Offer Code Section */}
                    <div className="mt-4">
                      <label className="text-sm text-gray-600 block mb-1">
                        {t("offerCode")}:
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary/10 rounded-full px-4 py-2 relative">
                          <input
                            type={showCodes[offer._id] ? "text" : "password"}
                            value={offer.claimCode}
                            readOnly
                            className="w-full bg-transparent border-none focus:outline-none text-sm font-mono pr-8"
                          />
                          <button
                            onClick={() => toggleCode(offer._id)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => copyDiscountCode(offer.claimCode)}
                          className="text-primary flex items-center gap-1 whitespace-nowrap"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </button>
                      </div>
                      {copiedDiscount && (
                        <div className="text-xs text-green-600 mt-2">
                          {t("copied")}
                        </div>
                      )}
                    </div>

                    {/* Contact & Location Info */}
                    <div className="mt-3 flex items-center gap-4 text-xs text-primary flex-wrap">
                      {offer.seller?.city && (
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          {offer.seller.city}
                          {offer.seller.neighbourhood &&
                            `, ${offer.seller.neighbourhood}`}
                        </div>
                      )}
                      {offer.seller?.website && (
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <Globe className="w-4 h-4 flex-shrink-0" />
                          {offer.seller.website}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex flex-wrap justify-end gap-4 text-sm text-gray-600">
                      <button
                        onClick={() => handleShowQR(offer)}
                        className="flex items-center gap-1 hover:text-primary rounded-full bg-gray-50 px-3 py-1 border border-gray-200"
                      >
                        <QrCode className="w-4 h-4" />
                        {t("qrCode")}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 space-y-6">
            {/* Invite Friends Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  👥
                </div>
                <h3 className="font-bold text-gray-900">
                  {t("inviteFriends")}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{t("earn100Points")}</p>
              <div className="bg-gray-50 rounded-full px-4 py-2 flex justify-between items-center">
                <span className="text-gray-800 font-mono">
                  {userData?.referralCode || "Loading..."}
                </span>
                <button
                  onClick={copyReferral}
                  className="text-gray-600 hover:text-primary"
                  disabled={!userData?.referralCode}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copiedReferral && (
                <p className="text-xs text-green-600 mt-2">{t("copied")}</p>
              )}
            </div>

            {/* Loyalty Tiers */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("loyaltyTiers")}
              </h3>
              <div className="space-y-3">
                {Object.entries(LOYALTY_TIERS).map(([key, tier]) => (
                  <div
                    key={key}
                    className={`${
                      tier.color
                    } text-white rounded-xl p-3 relative ${
                      membershipStatus.toLowerCase() === key
                        ? "ring-2 ring-white ring-opacity-50"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold">👑 {tier.name}</span>
                      {membershipStatus.toLowerCase() === key && (
                        <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                          {t("current")}
                        </span>
                      )}
                    </div>
                    <ul className="text-xs space-y-1">
                      <li>
                        • {tier.min} - {tier.max === Infinity ? "∞" : tier.max}{" "}
                        points
                      </li>
                      <li>
                        •{" "}
                        {key === "bronze"
                          ? "5%"
                          : key === "silver"
                          ? "10%"
                          : key === "gold"
                          ? "15%"
                          : "20%"}{" "}
                        cashback
                      </li>
                      <li>
                        •{" "}
                        {key === "bronze"
                          ? "Basic"
                          : key === "silver"
                          ? "Exclusive"
                          : key === "gold"
                          ? "Premium"
                          : "VIP"}{" "}
                        deals
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQRModal && selectedOffer && (
        <ClaimQRModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          offer={selectedOffer}
        />
      )}
    </div>
  );
}
