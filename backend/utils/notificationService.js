// services/notificationService.js
const Notification = require("../models/notification.model");
const User = require("../models/user.model");
const Seller = require("../models/seller.model");
const Favorite = require("../models/ad/favorite.model");
const Ad = require("../models/ad/baseAd.model");

/**
 * Notification Service
 * Handles creation of all types of smart notifications
 */

class NotificationService {
  /**
   * Get correct URL based on adType
   */
  static getAdUrl(adType, adId) {
    const urlMap = {
      product: `/product/${adId}`,
      service: `/service/${adId}`,
      event: `/event/${adId}`,
      offer: `/offer/${adId}`,
      explore: `/explore/${adId}`,
    };

    return urlMap[adType] || `/ad-details/${adId}`;
  }

  /**
   * Get correct action type based on adType
   */
  static getActionType(adType) {
    const actionMap = {
      product: "view_product",
      service: "view_service",
      event: "view_event",
      offer: "view_offer",
      explore: "view_explore",
    };

    return actionMap[adType] || "view_ad";
  }

  /**
   * Get seller location from Seller model
   */
  static async getSellerLocation(userId) {
    try {
      const seller = await Seller.findOne({ userId }).select(
        "city neighbourhood"
      );
      return seller
        ? {
            city: seller.city,
            neighbourhood: seller.neighbourhood,
          }
        : null;
    } catch (error) {
      console.error("Error getting seller location:", error);
      return null;
    }
  }

  /**
   * Find users in same location (via Seller model) - EXCLUDE SELLER
   */
  static async findUsersInLocation(locationType, location, excludeUserId) {
    try {
      // Find sellers in the same location EXCLUDING the current seller
      const sellersInArea = await Seller.find({
        [locationType]: location,
        userId: { $ne: excludeUserId }, // Exclude the current seller
      }).select("userId");

      console.log(
        `📊 Found ${sellersInArea.length} sellers in ${locationType}: ${location}`
      );

      if (sellersInArea.length === 0) {
        return [];
      }

      const sellerUserIds = sellersInArea.map((seller) => seller.userId);

      // Get users associated with these sellers
      const usersInArea = await User.find({
        _id: { $in: sellerUserIds },
        isVerified: true,
      }).select("_id");

      console.log(
        `👥 Found ${usersInArea.length} users in ${locationType}: ${location}`
      );

      return usersInArea.map((user) => user._id);
    } catch (error) {
      console.error("Error finding users in location:", error);
      return [];
    }
  }

  /**
   * Filter out seller from target users
   */
  static excludeSeller(userIds, sellerId) {
    return userIds.filter(
      (userId) => userId.toString() !== sellerId.toString()
    );
  }

  /**
   * New Flash Deal Notification
   * Triggered when a new flash deal is posted
   */
  static async notifyNewFlashDeal(flashDeal, sellerDetails) {
    try {
      console.log("🔔 [notifyNewFlashDeal] Starting...");

      // Get users who have favorited ads in this category
      const adsInCategory = await Ad.find({
        category: flashDeal.category,
      }).select("_id");

      const adIds = adsInCategory.map((ad) => ad._id);

      const favoritesInCategory = await Favorite.find({
        adId: { $in: adIds },
      }).distinct("userId");

      console.log(
        `📊 Found ${favoritesInCategory.length} users interested in ${flashDeal.category}`
      );

      // EXCLUDE SELLER from target users
      let targetUserIds = this.excludeSeller(
        favoritesInCategory,
        flashDeal.userId
      );

      // DEVELOPMENT: If no favorites, send to some active users (EXCLUDING SELLER)
      if (targetUserIds.length === 0) {
        console.log(
          "🔄 No interested users found, sending to random active users..."
        );
        const randomUsers = await User.find({
          isVerified: true,
          _id: { $ne: flashDeal.userId }, // EXCLUDE SELLER
        })
          .limit(10)
          .select("_id");

        targetUserIds = randomUsers.map((user) => user._id);
        console.log(
          `📢 Sending to ${targetUserIds.length} random active users (excluding seller)`
        );
      }

      if (targetUserIds.length === 0) {
        console.log("ℹ️ No users found at all, skipping notifications");
        return [];
      }

      const actionUrl = this.getAdUrl(flashDeal.adType, flashDeal._id);
      const actionType = this.getActionType(flashDeal.adType);

      const notificationData = {
        type: "NEW_FLASH_DEAL",
        title: "🔥 New Flash Deal Available!",
        message: `${flashDeal.title} - Up to ${flashDeal.discountPercent}% OFF`,
        description: `Grab this amazing deal on ${flashDeal.title}. Limited time offer!`,
        adId: flashDeal._id,
        actionData: {
          actionType: actionType,
          actionUrl: actionUrl,
          actionParams: {
            offerId: flashDeal._id,
            dealType: "flash",
            adType: flashDeal.adType,
          },
        },
        priceData: {
          originalPrice: flashDeal.fullPrice,
          newPrice: Math.round(
            flashDeal.fullPrice -
              (flashDeal.fullPrice * flashDeal.discountPercent) / 100
          ),
          discountPercent: flashDeal.discountPercent,
        },
        tags: ["flash_deal", "hot_deal", flashDeal.category],
        expiresAt: flashDeal.expiryDate,
      };

      // Create notifications for all target users (EXCLUDING SELLER)
      const notifications = targetUserIds.map((userId) => ({
        ...notificationData,
        userId,
        isRead: false,
        isClicked: false,
      }));

      const result = await Notification.insertMany(notifications);
      console.log(
        `✅ Created ${result.length} flash deal notifications (excluding seller)`
      );
      return result;
    } catch (error) {
      console.error("❌ Error creating new flash deal notification:", error);
      throw error;
    }
  }

  /**
   * Deal in Your Area Notification
   * Notify users in the same city/neighbourhood (via Seller model)
   */
  static async notifyDealInYourArea(ad, locationType) {
    try {
      console.log("🏙️ [notifyDealInYourArea] Starting...", { locationType });

      // Get seller's location from Seller model
      const sellerLocation = await this.getSellerLocation(ad.userId);

      if (!sellerLocation) {
        console.log("❌ Seller location not found");
        return [];
      }

      const location = sellerLocation[locationType]; // 'city' or 'neighbourhood'

      if (!location) {
        console.log(`❌ No ${locationType} found for seller`);
        return [];
      }

      console.log(`📍 Seller ${locationType}: ${location}`);

      // Find users in the same location (automatically excludes seller)
      const usersInArea = await this.findUsersInLocation(
        locationType,
        location,
        ad.userId
      );

      if (usersInArea.length === 0) {
        console.log(
          `ℹ️ No users found in this ${locationType}, skipping notifications`
        );
        return [];
      }

      const actionUrl = this.getAdUrl(ad.adType, ad._id);
      const actionType = this.getActionType(ad.adType);

      const notificationData = {
        type: "DEAL_IN_YOUR_AREA",
        title: "📍 Deal Near You!",
        message: `New ${ad.adType} in your area: ${ad.title}`,
        description: `Check out this new ${ad.adType} available near ${location}`,
        adId: ad._id,
        actionData: {
          actionType: actionType,
          actionUrl: actionUrl,
          actionParams: {
            adId: ad._id,
            adType: ad.adType,
            location: location,
            locationType: locationType,
          },
        },
        geoData: {
          distance: 0,
          city: locationType === "city" ? location : sellerLocation.city,
          neighbourhood:
            locationType === "neighbourhood"
              ? location
              : sellerLocation.neighbourhood,
        },
        tags: ["local_deal", "nearby", ad.category, ad.adType],
      };

      // Create notifications for users in area (already excludes seller)
      const notifications = usersInArea.map((userId) => ({
        ...notificationData,
        userId,
        isRead: false,
        isClicked: false,
      }));

      const result = await Notification.insertMany(notifications);
      console.log(
        `✅ Created ${result.length} local deal notifications (excluding seller)`
      );
      return result;
    } catch (error) {
      console.error("❌ Error creating local deal notification:", error);
      throw error;
    }
  }

  /**
   * Flash Deal Ending Soon Notification
   * Triggered 30 minutes before flash deal expires
   */
  static async notifyFlashDealEndingSoon(flashDeal, claimedUserIds) {
    try {
      // EXCLUDE SELLER from claimed users
      const targetUserIds = this.excludeSeller(
        claimedUserIds,
        flashDeal.userId
      );

      if (targetUserIds.length === 0) {
        console.log("ℹ️ No users to notify (excluding seller)");
        return [];
      }

      const timeRemaining = Math.round(
        (flashDeal.expiryDate - new Date()) / 1000 / 60
      ); // minutes

      const actionUrl = this.getAdUrl(flashDeal.adType, flashDeal._id);
      const actionType = this.getActionType(flashDeal.adType);

      const notificationData = {
        type: "FLASH_DEAL_ENDING_SOON",
        title: "⏰ Deal Ending Soon!",
        message: `${flashDeal.title} expires in ${timeRemaining} minutes!`,
        description: `Hurry! This amazing deal will be gone soon. ${flashDeal.discountPercent}% OFF - Don't miss out!`,
        adId: flashDeal._id,
        actionData: {
          actionType: actionType,
          actionUrl: actionUrl,
          actionParams: {
            offerId: flashDeal._id,
            dealType: "flash",
            adType: flashDeal.adType,
            urgency: true,
          },
        },
        expiresAt: flashDeal.expiryDate,
        isRead: false,
        isClicked: false,
      };

      const notifications = targetUserIds.map((userId) => ({
        ...notificationData,
        userId,
      }));

      const result = await Notification.insertMany(notifications);
      console.log(
        `✅ Created ${result.length} ending soon notifications (excluding seller)`
      );
      return result;
    } catch (error) {
      console.error(
        "❌ Error creating flash deal ending soon notification:",
        error
      );
      throw error;
    }
  }

  /**
   * General New Ad Notification
   * For users interested in similar categories - EXCLUDE SELLER
   */
  static async notifyNewAd(ad, sellerDetails) {
    try {
      console.log("🔔 [notifyNewAd] Starting...", ad.adType);

      // Get users who have favorited ads in this category
      const adsInCategory = await Ad.find({
        category: ad.category,
      }).select("_id");

      const adIds = adsInCategory.map((ad) => ad._id);

      const favoritesInCategory = await Favorite.find({
        adId: { $in: adIds },
      }).distinct("userId");

      console.log(
        `📊 Found ${favoritesInCategory.length} users interested in ${ad.category}`
      );

      // EXCLUDE SELLER from target users
      let targetUserIds = this.excludeSeller(favoritesInCategory, ad.userId);

      // DEVELOPMENT: If no favorites, send to some active users (EXCLUDING SELLER)
      if (targetUserIds.length === 0) {
        console.log(
          "🔄 No interested users found, sending to random active users..."
        );
        const randomUsers = await User.find({
          isVerified: true,
          _id: { $ne: ad.userId }, // EXCLUDE SELLER
        })
          .limit(15)
          .select("_id");

        targetUserIds = randomUsers.map((user) => user._id);
        console.log(
          `📢 Sending to ${targetUserIds.length} random active users (excluding seller)`
        );
      }

      if (targetUserIds.length === 0) {
        console.log("ℹ️ No users found at all, skipping notifications");
        return [];
      }

      const actionUrl = this.getAdUrl(ad.adType, ad._id);
      const actionType = this.getActionType(ad.adType);

      const notificationData = {
        type: "NEW_AD",
        title: `🆕 New ${
          ad.adType.charAt(0).toUpperCase() + ad.adType.slice(1)
        }!`,
        message: `${ad.title} - Check it out!`,
        description: `A new ${ad.adType} has been posted in ${ad.category} category`,
        adId: ad._id,
        actionData: {
          actionType: actionType,
          actionUrl: actionUrl,
          actionParams: { adId: ad._id, adType: ad.adType },
        },
        tags: ["new_ad", ad.category, ad.adType],
        isRead: false,
        isClicked: false,
      };

      // Create notifications for target users (EXCLUDING SELLER)
      const notifications = targetUserIds.map((userId) => ({
        ...notificationData,
        userId,
      }));

      const result = await Notification.insertMany(notifications);
      console.log(
        `✅ Created ${result.length} new ad notifications (excluding seller)`
      );
      return result;
    } catch (error) {
      console.error("❌ Error creating new ad notification:", error);
      throw error;
    }
  }

  /**
   * Price Drop Notification - EXCLUDE SELLER
   */
  static async notifyPriceDrop(ad, oldPrice, newPrice) {
    try {
      // Get users who have favorited this ad
      const favoritedUsers = await Favorite.find({
        adId: ad._id,
      }).distinct("userId");

      // EXCLUDE SELLER from target users
      const targetUserIds = this.excludeSeller(favoritedUsers, ad.userId);

      if (targetUserIds.length === 0) {
        console.log(
          "ℹ️ No users have favorited this ad (excluding seller), skipping price drop notifications"
        );
        return [];
      }

      const discountPercent = Math.round(
        ((oldPrice - newPrice) / oldPrice) * 100
      );

      const actionUrl = this.getAdUrl(ad.adType, ad._id);
      const actionType = this.getActionType(ad.adType);

      const notificationData = {
        type: "PRICE_DROP",
        title: "💰 Price Dropped!",
        message: `${ad.title} - Now ${discountPercent}% OFF!`,
        description: `The price for ${ad.title} has dropped from ₹${oldPrice} to ₹${newPrice}`,
        adId: ad._id,
        actionData: {
          actionType: actionType,
          actionUrl: actionUrl,
          actionParams: {
            adId: ad._id,
            adType: ad.adType,
            priceDrop: true,
          },
        },
        priceData: {
          originalPrice: oldPrice,
          newPrice: newPrice,
          discountPercent: discountPercent,
        },
        tags: ["price_drop", "discount", ad.category],
        isRead: false,
        isClicked: false,
      };

      const notifications = targetUserIds.map((userId) => ({
        ...notificationData,
        userId,
      }));

      const result = await Notification.insertMany(notifications);
      console.log(
        `✅ Created ${result.length} price drop notifications (excluding seller)`
      );
      return result;
    } catch (error) {
      console.error("❌ Error creating price drop notification:", error);
      throw error;
    }
  }
}

module.exports = NotificationService;
