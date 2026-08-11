/**
 * Rolls the demo dataset's time-sensitive dates forward without touching
 * anything else:
 *
 *   - flash deals   get a fresh 4–22 hour expiry so the countdown keeps ticking
 *   - offers        that have expired are pushed 30–75 days out
 *   - events        in the past are moved to a comparable slot in the future
 *   - claims        on live offers flip back from `expired` to `active`
 *
 * Run it with `npm run seed:refresh`. On a deployed demo it is worth scheduling
 * daily — node-cron is already a dependency, so in backend/index.js:
 *
 *   const cron = require("node-cron");
 *   cron.schedule("0 3 * * *", () => require("./seed/refresh").refresh());
 *
 * Without this, the Flash Deals page empties out 24 hours after seeding and the
 * Events page fills with dates that have already passed.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../config/.env") });

const mongoose = require("mongoose");
const Ad = require("../models/ad/baseAd.model");
// `expiryDate`, `flashDeal` and `eventDate` live on the discriminators, not on
// the base Ad schema. Writing them through the base model silently strips them
// from the update, so every query below goes through the discriminator model.
const OfferAd = require("../models/ad/offerAd.model");
const EventAd = require("../models/ad/eventAd.model");
const ClaimOffer = require("../models/ad/claimOffer.model");

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const refresh = async () => {
  const openedHere = mongoose.connection.readyState === 0;
  if (openedHere) await mongoose.connect(process.env.DB_URI);

  const now = new Date();
  const summary = {};

  // Flash deals: always a fresh sub-24h window.
  const flash = await OfferAd.find({ flashDeal: true }).select("_id");
  await OfferAd.bulkWrite(
    flash.map((ad) => ({
      updateOne: {
        filter: { _id: ad._id },
        update: {
          $set: {
            expiryDate: new Date(Date.now() + randInt(4, 22) * HOUR),
            createdAt: new Date(Date.now() - randInt(1, 6) * HOUR),
          },
        },
      },
    }))
  );
  summary.flashDeals = flash.length;

  // Standard offers that have lapsed.
  const stale = await OfferAd.find({
    flashDeal: { $ne: true },
    expiryDate: { $lt: now },
  }).select("_id");
  await OfferAd.bulkWrite(
    stale.map((ad) => ({
      updateOne: {
        filter: { _id: ad._id },
        update: { $set: { expiryDate: new Date(Date.now() + randInt(30, 75) * DAY) } },
      },
    }))
  );
  summary.offersExtended = stale.length;

  // Events that have already happened.
  const past = await EventAd.find({ eventDate: { $lt: now } }).select("_id");
  await EventAd.bulkWrite(
    past.map((ad) => ({
      updateOne: {
        filter: { _id: ad._id },
        update: { $set: { eventDate: new Date(Date.now() + randInt(5, 60) * DAY) } },
      },
    }))
  );
  summary.eventsRescheduled = past.length;

  // Claims marked expired against offers that are live again.
  const liveOfferIds = (
    await OfferAd.find({ expiryDate: { $gt: now } }).select("_id")
  ).map((a) => a._id);
  const revived = await ClaimOffer.updateMany(
    { status: "expired", offerId: { $in: liveOfferIds } },
    { $set: { status: "active" } }
  );
  summary.claimsReactivated = revived.modifiedCount;

  console.log("Refreshed demo dates:", summary);

  if (openedHere) await mongoose.connection.close();
  return summary;
};

if (require.main === module) {
  refresh()
    .then(() => process.exit(0))
    .catch(async (error) => {
      console.error("Refresh failed:", error);
      await mongoose.connection.close().catch(() => {});
      process.exit(1);
    });
}

module.exports = { refresh };
