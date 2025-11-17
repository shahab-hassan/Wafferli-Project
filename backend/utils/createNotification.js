// services/notificationTrigger.js
const NotificationService = require("./notificationService");

const createNotificationsForNewAd = async (ad) => {
  try {
    console.log(
      `🔔 Triggering notifications for ad: ${ad._id}, type: ${ad.adType}`
    );

    // Verify ad exists in database first
    const Ad = require("../models/ad/baseAd.model");
    const adExists = await Ad.findById(ad._id);
    if (!adExists) {
      console.log("❌ Ad not found in database, skipping notifications");
      return;
    }

    console.log("✅ Ad verified, proceeding with notifications...");

    // Get seller details for location-based notifications
    const Seller = require("../models/seller.model");
    const seller = await Seller.findOne({ userId: ad.userId });

    if (!seller) {
      console.log(
        "❌ Seller profile not found, will proceed with general notifications only"
      );
    } else {
      console.log("📍 Seller location:", {
        city: seller.city,
        neighbourhood: seller.neighbourhood,
      });
    }

    switch (ad.adType) {
      case "offer":
        await handleOfferNotifications(ad, seller);
        break;
      case "product":
      case "service":
      case "event":
      case "explore":
        await handleGeneralAdNotifications(ad, seller);
        break;
      default:
        console.log(`⚠️ Unknown adType: ${ad.adType}`);
    }

    console.log(`✅ Notifications created successfully for ad: ${ad._id}`);
  } catch (error) {
    console.error("❌ Error creating notifications for new ad:", error);
  }
};

/**
 * Handle notifications for new offers
 */
const handleOfferNotifications = async (ad, seller) => {
  try {
    // Flash Deal Notification
    if (ad.flashDeal) {
      console.log("⚡ Creating flash deal notification...");
      await NotificationService.notifyNewFlashDeal(ad, seller);
    }

    // Deal in Your Area (city-based) - only if seller has city
    if (seller && seller.city) {
      console.log("🏙️ Notifying users in the same city...");
      await NotificationService.notifyDealInYourArea(ad, "city");
    }

    // Deal in Your Area (neighbourhood-based) - only if seller has neighbourhood
    if (seller && seller.neighbourhood) {
      console.log("🏘️ Notifying users in the same neighbourhood...");
      await NotificationService.notifyDealInYourArea(ad, "neighbourhood");
    }

    // General new offer notification
    console.log("📢 Creating general offer notification...");
    await NotificationService.notifyNewAd(ad, seller);
  } catch (error) {
    console.error("Error handling offer notifications:", error);
  }
};

/**
 * Handle notifications for general ads
 */
const handleGeneralAdNotifications = async (ad, seller) => {
  try {
    // Deal in Your Area (city-based) - only if seller has city
    if (seller && seller.city) {
      console.log("🏙️ Notifying users in the same city...");
      await NotificationService.notifyDealInYourArea(ad, "city");
    }

    // Deal in Your Area (neighbourhood-based) - only if seller has neighbourhood
    if (seller && seller.neighbourhood) {
      console.log("🏘️ Notifying users in the same neighbourhood...");
      await NotificationService.notifyDealInYourArea(ad, "neighbourhood");
    }

    // General new ad notification
    console.log("📢 Creating general ad notification...");
    await NotificationService.notifyNewAd(ad, seller);
  } catch (error) {
    console.error("Error handling general ad notifications:", error);
  }
};

module.exports = { createNotificationsForNewAd };
