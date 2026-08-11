/**
 * Wafferli demo data seeder.
 *
 *   npm run seed          seed the database (wipes marketplace collections first)
 *   npm run seed:refresh  only roll time-sensitive dates forward (see refresh.js)
 *
 * What it touches:
 *   wiped + rebuilt  users, sellers, ads, reviews, favorites, claimoffers,
 *                    notifications, chatrooms
 *   updated in place adminsettings.subscribedEmails
 *   never touched    admins, blogs, faqs, faqcategories, terms & privacy copy
 *
 * Everything is generated from a fixed PRNG seed, so two runs produce the same
 * catalogue — handy when you are screenshotting the app for a portfolio and want
 * the numbers to stay put between runs.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../config/.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const Seller = require("../models/seller.model");
const Ad = require("../models/ad/baseAd.model");
const ProductAd = require("../models/ad/productAd.model");
const ServiceAd = require("../models/ad/serviceAd.model");
const EventAd = require("../models/ad/eventAd.model");
const OfferAd = require("../models/ad/offerAd.model");
const ExploreAd = require("../models/ad/exploreAd.model");
const Review = require("../models/ad/review.model");
const Favorite = require("../models/ad/favorite.model");
const ClaimOffer = require("../models/ad/claimOffer.model");
const Notification = require("../models/notification.model");
const ChatRoom = require("../models/chat.model");
const AdminSettings = require("../models/adminSettingsModel");

const { SELLERS, BUYERS } = require("./people");
const { PRODUCTS, SERVICES, EVENTS, OFFERS, EXPLORES } = require("./ads");
const {
  REVIEWS,
  CHATS,
  NOTIFICATION_TEMPLATES,
  NEWSLETTER_EXTRA,
} = require("./engagement");
const { IMG } = require("./images");

const DEMO_PASSWORD = process.env.SEED_PASSWORD || "Wafferli@2025";

// ---------------------------------------------------------------------------
// deterministic randomness
// ---------------------------------------------------------------------------

let _state = 0x9e3779b9;
const rnd = () => {
  _state |= 0;
  _state = (_state + 0x6d2b79f5) | 0;
  let t = Math.imul(_state ^ (_state >>> 15), 1 | _state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const randInt = (min, max) => Math.floor(rnd() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const chance = (p) => rnd() < p;

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const now = () => new Date();
const daysFromNow = (d) => new Date(Date.now() + d * DAY);
const daysAgoDate = (d, jitterHours = 10) =>
  new Date(Date.now() - d * DAY - randInt(0, jitterHours) * HOUR);

const log = (...args) => console.log(...args);

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

/**
 * Mongoose stamps createdAt itself on insert, so backdating has to happen after
 * the document is saved. Done in bulk to keep the seed fast.
 */
const backdate = async (Model, entries) => {
  if (!entries.length) return;
  await Model.collection.bulkWrite(
    entries.map(({ _id, createdAt, updatedAt }) => ({
      updateOne: {
        filter: { _id },
        update: { $set: { createdAt, updatedAt: updatedAt || createdAt } },
      },
    }))
  );
};

const usedReferralCodes = new Set();
const referralCode = () => {
  let code;
  do {
    code = `WF-${Math.floor(rnd() * 36 ** 6)
      .toString(36)
      .toUpperCase()
      .padStart(6, "0")}`;
  } while (usedReferralCodes.has(code));
  usedReferralCodes.add(code);
  return code;
};

const usedClaimCodes = new Set();
const claimCode = () => {
  let code;
  do {
    code = String(randInt(100000000, 999999999));
  } while (usedClaimCodes.has(code));
  usedClaimCodes.add(code);
  return code;
};

// ---------------------------------------------------------------------------
// steps
// ---------------------------------------------------------------------------

const clearMarketplace = async () => {
  const results = await Promise.all([
    User.deleteMany({}),
    Seller.deleteMany({}),
    Ad.deleteMany({}),
    Review.deleteMany({}),
    Favorite.deleteMany({}),
    ClaimOffer.deleteMany({}),
    Notification.deleteMany({}),
    ChatRoom.deleteMany({}),
  ]);
  const removed = results.reduce((sum, r) => sum + (r.deletedCount || 0), 0);
  log(`  cleared ${removed} existing marketplace documents`);
  log("  left untouched: admins, blogs, faqs, faq categories, terms & privacy");
};

const createUsers = async () => {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const sellerDocs = SELLERS.map((s, i) => ({
    fullName: s.fullName,
    email: s.email,
    phone: s.phone,
    password: passwordHash,
    isVerified: true,
    role: "seller",
    referralCode: referralCode(),
    totalloyaltiyPoints: s.loyaltyPoints,
    _seedKey: s.key,
    _joinedDaysAgo: 240 - i * 6,
  }));

  const buyerDocs = BUYERS.map((b, i) => ({
    fullName: b.fullName,
    email: b.email,
    phone: b.phone,
    password: passwordHash,
    isVerified: i < BUYERS.length - 2, // leave two accounts mid-signup
    role: "user",
    referralCode: referralCode(),
    totalloyaltiyPoints: 0, // recalculated from actual claims later
    _seedKey: b.email,
    _joinedDaysAgo: 200 - i * 5,
    _loyaltyTarget: b.loyaltyPoints,
  }));

  const all = [...sellerDocs, ...buyerDocs];
  const created = await User.insertMany(
    all.map(({ _seedKey, _joinedDaysAgo, _loyaltyTarget, ...doc }) => doc)
  );

  await backdate(
    User,
    created.map((u, i) => ({
      _id: u._id,
      createdAt: daysAgoDate(all[i]._joinedDaysAgo),
    }))
  );

  const byKey = new Map();
  created.forEach((u, i) => {
    u._loyaltyTarget = all[i]._loyaltyTarget;
    byKey.set(all[i]._seedKey, u);
  });

  const sellers = created.slice(0, SELLERS.length);
  const buyers = created.slice(SELLERS.length);
  log(`  ${created.length} users (${sellers.length} sellers, ${buyers.length} buyers)`);
  return { users: created, sellerUsers: sellers, buyerUsers: buyers, byKey };
};

const createSellerProfiles = async (byKey) => {
  const payload = SELLERS.map((s) => ({
    userId: byKey.get(s.key)._id,
    ...s.seller,
  }));
  const created = await Seller.insertMany(payload);

  await backdate(
    Seller,
    created.map((doc, i) => ({
      _id: doc._id,
      createdAt: daysAgoDate(235 - i * 6),
    }))
  );

  const profiles = new Map();
  SELLERS.forEach((s, i) => profiles.set(s.key, created[i]));
  const businesses = created.filter((s) => s.businessType === "business").length;
  log(`  ${created.length} seller profiles (${businesses} business, ${created.length - businesses} individual)`);
  return profiles;
};

const buildBase = (entry, sellerUser, sellerProfile) => {
  const inherit = entry.locationSameAsProfile === true;
  return {
    images: entry.images,
    title: entry.title,
    description: entry.description,
    locationSameAsProfile: inherit,
    city: inherit ? sellerProfile.city : entry.city,
    neighbourhood: inherit ? sellerProfile.neighbourhood : entry.neighbourhood,
    phone: sellerUser.phone,
    showPhone: entry.showPhone !== false,
    paymentMode: entry.paymentMode || null,
    userId: sellerUser._id,
  };
};

const createAds = async (byKey, profiles) => {
  const created = [];
  const stamps = [];

  const save = async (Model, doc, entry) => {
    const ad = new Model(doc);
    await ad.save();
    // `createdAt` is immutable on a Mongoose document, so the backdated age
    // rides alongside it — later steps size review volume off how long a
    // listing has supposedly been live.
    const createdAt = daysAgoDate(entry.daysAgo);
    ad._ageDays = entry.daysAgo;
    created.push(ad);
    stamps.push({ _id: ad._id, createdAt });
    return ad;
  };

  for (const entry of PRODUCTS) {
    const user = byKey.get(entry.seller);
    const profile = profiles.get(entry.seller);
    await save(
      ProductAd,
      {
        ...buildBase(entry, user, profile),
        category: entry.category,
        subCategory: entry.subCategory,
        quantity: entry.quantity,
        askingPrice: entry.askingPrice,
        discount: !!entry.discount,
        discountPercent: entry.discount ? entry.discountPercent : null,
        recurring: !!entry.recurring,
      },
      entry
    );
  }

  for (const entry of SERVICES) {
    const user = byKey.get(entry.seller);
    const profile = profiles.get(entry.seller);
    await save(
      ServiceAd,
      {
        ...buildBase(entry, user, profile),
        category: entry.category,
        subCategory: entry.subCategory,
        servicePrice: entry.servicePrice,
        serviceType: entry.serviceType,
      },
      entry
    );
  }

  for (const entry of EVENTS) {
    const user = byKey.get(entry.seller);
    const profile = profiles.get(entry.seller);
    await save(
      EventAd,
      {
        ...buildBase(entry, user, profile),
        eventDate: daysFromNow(entry.inDays),
        eventTime: entry.eventTime,
        endTime: entry.endTime,
        eventType: entry.eventType,
        featuresAmenities: entry.featuresAmenities || [],
      },
      entry
    );
  }

  for (const entry of OFFERS) {
    const user = byKey.get(entry.seller);
    const profile = profiles.get(entry.seller);
    // Flash deals get a staggered expiry inside the next 24h so the countdown
    // on the flash deals page reads differently on each card.
    const expiryDate = entry.flashDeal
      ? new Date(Date.now() + randInt(4, 22) * HOUR)
      : daysFromNow(entry.expiryInDays);

    await save(
      OfferAd,
      {
        ...buildBase(entry, user, profile),
        flashDeal: !!entry.flashDeal,
        expiryDate,
        category: entry.category,
        claimDeal: entry.claimDeal !== false,
        discountDeal: !!entry.discountDeal,
        fullPrice: entry.discountDeal ? entry.fullPrice : undefined,
        discountPercent: entry.discountDeal ? entry.discountPercent : undefined,
        offerDetail: entry.discountDeal ? undefined : entry.offerDetail,
      },
      entry
    );
  }

  for (const entry of EXPLORES) {
    const user = byKey.get(entry.seller);
    const profile = profiles.get(entry.seller);
    await save(
      ExploreAd,
      {
        ...buildBase(entry, user, profile),
        exploreName: entry.exploreName,
        exploreDescription: entry.exploreDescription,
        startTime: entry.startTime || null,
        endTime: entry.endTime || null,
      },
      entry
    );
  }

  await backdate(Ad, stamps);

  const counts = created.reduce((acc, ad) => {
    acc[ad.adType] = (acc[ad.adType] || 0) + 1;
    return acc;
  }, {});
  log(
    `  ${created.length} ads — ` +
      Object.entries(counts)
        .map(([k, v]) => `${v} ${k}`)
        .join(", ")
  );
  return created;
};

const createReviews = async (ads, buyerUsers) => {
  const docs = [];
  const stamps = [];

  for (const ad of ads) {
    const pool = REVIEWS[ad.adType];
    // Older listings have had more time to collect reviews; a handful of the
    // newest ads have none at all, which is what a real catalogue looks like.
    const ageDays = ad._ageDays;
    let count = Math.min(pool.length, randInt(2, 5) + Math.floor(ageDays / 5));
    // Offers are recurring merchant promotions rather than one-off listings, so
    // even a flash deal posted this morning carries reviews from earlier runs of
    // the same deal.
    if (ad.adType === "offer") count = Math.min(pool.length, randInt(4, 9));
    // Featured carousels sort newest-first, so the freshest listing is always
    // the first card a visitor sees — leaving it on "0.0 (0)" reads as broken
    // data rather than as a new listing. Everything gets at least two reviews.
    count = Math.max(2, count);
    if (!count) continue;

    // Weight the draw towards the happier reviews. Sampling the pool flat means
    // a listing that only has two reviews can land on a 3.0 average purely by
    // chance, which misrepresents a seller the copy describes as well regarded.
    const weighted = pool.flatMap((r) => Array(r[0] >= 5 ? 3 : r[0] === 4 ? 2 : 1).fill(r));
    const texts = [];
    for (const review of shuffle(weighted)) {
      if (texts.length >= count) break;
      if (!texts.includes(review)) texts.push(review);
    }
    const reviewers = shuffle(
      buyerUsers.filter((u) => !u._id.equals(ad.userId))
    ).slice(0, count);

    texts.forEach(([rating, reviewText], i) => {
      const reviewer = reviewers[i];
      const doc = {
        adId: ad._id,
        userId: reviewer._id,
        rating,
        reviewText,
        userName: reviewer.fullName,
        likes: shuffle(buyerUsers)
          .slice(0, randInt(0, 6))
          .map((u) => u._id)
          .filter((id) => !id.equals(reviewer._id)),
      };
      docs.push(doc);
      stamps.push(randInt(1, Math.max(2, Math.floor(ageDays))));
    });
  }

  const created = await Review.insertMany(docs);
  await backdate(
    Review,
    created.map((r, i) => ({ _id: r._id, createdAt: daysAgoDate(stamps[i]) }))
  );

  // Mirror the aggregate the API keeps on the ad itself.
  const stats = await Review.aggregate([
    { $group: { _id: "$adId", avg: { $avg: "$rating" }, total: { $sum: 1 } } },
  ]);
  await Ad.bulkWrite(
    stats.map((s) => ({
      updateOne: {
        filter: { _id: s._id },
        update: {
          $set: {
            rating: parseFloat(s.avg.toFixed(1)),
            reviewsCount: s.total,
          },
        },
      },
    }))
  );

  log(`  ${created.length} reviews across ${stats.length} listings`);
  return created;
};

const createFavorites = async (ads, buyerUsers, sellerUsers) => {
  const docs = [];
  const seen = new Set();

  const addFor = (user, min, max) => {
    for (const ad of shuffle(ads).slice(0, randInt(min, max))) {
      if (ad.userId.equals(user._id)) continue; // nobody wishlists their own ad
      const key = `${user._id}:${ad._id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      docs.push({ userId: user._id, adId: ad._id, adType: ad.adType });
    }
  };

  buyerUsers.forEach((u) => addFor(u, 9, 24));
  sellerUsers.forEach((u) => addFor(u, 3, 9));

  const created = await Favorite.insertMany(docs);
  await backdate(
    Favorite,
    created.map((f) => ({ _id: f._id, createdAt: daysAgoDate(randInt(1, 60)) }))
  );

  const counts = await Favorite.aggregate([
    { $group: { _id: "$adId", total: { $sum: 1 } } },
  ]);
  await Ad.bulkWrite(
    counts.map((c) => ({
      updateOne: {
        filter: { _id: c._id },
        update: { $set: { favoritesCount: c.total } },
      },
    }))
  );

  log(`  ${created.length} wishlist entries`);
  return created;
};

const createClaims = async (ads, buyerUsers, sellerUsers) => {
  const claimable = ads.filter((a) => a.adType === "offer" && a.claimDeal);
  const pointsByOffer = new Map();
  OFFERS.forEach((o) => {
    const ad = claimable.find((a) => a.title === o.title);
    if (ad) pointsByOffer.set(ad._id.toString(), o.loyaltyPoints || 50);
  });

  const docs = [];

  // Claims are generated to land near each user's intended loyalty balance, so
  // the wallet total always equals the sum of the claims shown beneath it.
  for (const user of buyerUsers) {
    const target = user._loyaltyTarget || 0;
    if (target <= 0) continue;

    let total = 0;
    for (const offer of shuffle(claimable)) {
      if (total >= target) break;
      const points = pointsByOffer.get(offer._id.toString()) || 50;
      if (total + points > target * 1.15) continue;
      total += points;
      const claimedAt = daysAgoDate(randInt(1, 90));
      docs.push({
        userId: user._id,
        offerId: offer._id,
        claimCode: claimCode(),
        termsAndConditions: true,
        notification: chance(0.6),
        loyaltyPoints: points,
        claimedAt,
        status: new Date(offer.expiryDate) < now()
          ? "expired"
          : chance(0.3)
          ? "used"
          : "active",
        _createdAt: claimedAt,
      });
    }
    user._loyaltyActual = total;
  }

  // A few sellers claim deals from other sellers too.
  for (const user of shuffle(sellerUsers).slice(0, 6)) {
    const offer = pick(claimable.filter((a) => !a.userId.equals(user._id)));
    if (!offer) continue;
    const claimedAt = daysAgoDate(randInt(1, 45));
    const points = pointsByOffer.get(offer._id.toString()) || 50;
    docs.push({
      userId: user._id,
      offerId: offer._id,
      claimCode: claimCode(),
      termsAndConditions: true,
      notification: chance(0.5),
      loyaltyPoints: points,
      claimedAt,
      status: "active",
      _createdAt: claimedAt,
    });
  }

  const created = await ClaimOffer.insertMany(
    docs.map(({ _createdAt, ...d }) => d)
  );
  await backdate(
    ClaimOffer,
    created.map((c, i) => ({ _id: c._id, createdAt: docs[i]._createdAt }))
  );

  // Sync each user's running total with what they actually claimed. Two users
  // additionally carry a 100-point referral bonus, matching the signup flow.
  const totals = await ClaimOffer.aggregate([
    { $group: { _id: "$userId", total: { $sum: "$loyaltyPoints" } } },
  ]);
  const referralWinners = shuffle(buyerUsers).slice(0, 2).map((u) => u._id.toString());
  await User.bulkWrite(
    totals.map((t) => ({
      updateOne: {
        filter: { _id: t._id },
        update: {
          $set: {
            totalloyaltiyPoints:
              t.total + (referralWinners.includes(t._id.toString()) ? 100 : 0),
          },
        },
      },
    }))
  );

  log(`  ${created.length} offer claims with unique 9-digit codes`);
  return created;
};

const createNotifications = async (ads, users, byKey, profiles) => {
  const sellerName = (userId) => {
    const entry = SELLERS.find((s) => byKey.get(s.key)._id.equals(userId));
    if (!entry) return "A seller";
    return entry.seller.name || entry.fullName;
  };

  const offers = ads.filter((a) => a.adType === "offer");
  const flash = offers.filter((a) => a.flashDeal);
  const products = ads.filter((a) => a.adType === "product");

  const routeFor = (ad) =>
    ({
      product: "/product",
      service: "/service",
      event: "/events",
      offer: "/offers",
      explore: "/explore",
    }[ad.adType]);

  const docs = [];
  const stamps = [];

  const push = (user, type, ad, ageDays) => {
    const tpl = NOTIFICATION_TEMPLATES[type];
    const name = sellerName(ad.userId);
    const isRead = ageDays > 2 ? chance(0.8) : chance(0.25);
    const createdAt = daysAgoDate(ageDays, 20);
    docs.push({
      userId: user._id,
      type,
      title: tpl.title,
      message: tpl.message.replace("{title}", ad.title).replace("{seller}", name),
      description: tpl.description,
      adId: ad._id,
      priceData:
        type === "PRICE_DROP" && ad.askingPrice
          ? {
              originalPrice: ad.askingPrice,
              newPrice: Math.round(ad.askingPrice * 0.88),
              discountPercent: 12,
            }
          : undefined,
      actionData: {
        actionType: "VIEW_AD",
        actionUrl: `${routeFor(ad)}/${ad._id}`,
        actionParams: { adType: ad.adType, adId: ad._id.toString() },
      },
      tags: tpl.tags,
      isRead,
      readAt: isRead ? new Date(createdAt.getTime() + randInt(1, 40) * HOUR) : null,
      isClicked: isRead && chance(0.5),
      clickedAt: null,
      // Default is 24h, which would empty the bell almost immediately on a demo
      // site. 60 days keeps the panel populated without changing the schema.
      expiresAt: daysFromNow(60),
    });
    stamps.push(createdAt);
  };

  for (const user of users) {
    const own = new Set(ads.filter((a) => a.userId.equals(user._id)).map((a) => a.adType));
    const mine = (ad) => ad.userId.equals(user._id);

    flash.filter((a) => !mine(a)).slice(0, 2).forEach((ad) => push(user, "NEW_FLASH_DEAL", ad, randInt(0, 1)));
    shuffle(offers.filter((a) => !mine(a))).slice(0, 2).forEach((ad) => push(user, "DEAL_IN_YOUR_AREA", ad, randInt(1, 12)));
    shuffle(ads.filter((a) => !mine(a))).slice(0, randInt(1, 3)).forEach((ad) => push(user, "NEW_AD", ad, randInt(2, 20)));
    if (chance(0.5)) push(user, "PRICE_DROP", pick(products.filter((a) => !mine(a))), randInt(1, 15));
    if (chance(0.35)) push(user, "FLASH_DEAL_ENDING_SOON", pick(flash.filter((a) => !mine(a))), 0);
    if (chance(0.4)) push(user, "ORDER_UPDATE", pick(offers.filter((a) => !mine(a))), randInt(1, 30));
    if (chance(0.2) && own.size === 0) push(user, "OUT_OF_STOCK", pick(products), randInt(3, 25));
  }

  const created = await Notification.insertMany(docs);
  await backdate(
    Notification,
    created.map((n, i) => ({ _id: n._id, createdAt: stamps[i] }))
  );
  const unread = created.filter((n) => !n.isRead).length;
  log(`  ${created.length} notifications (${unread} unread)`);
  return created;
};

const createChats = async (ads, byKey) => {
  const adByTitle = new Map(ads.map((a) => [a.title, a]));
  const chatImages = [IMG.phoneB, IMG.sofaB, IMG.decorA, IMG.attarA, IMG.laptopB];
  const created = [];

  for (const thread of CHATS) {
    const seller = byKey.get(thread.seller);
    const buyer = byKey.get(thread.buyer);
    const ad = adByTitle.get(thread.ad);
    if (!seller || !buyer || !ad) {
      log(`  ! skipped chat (unresolved ${!seller ? "seller" : !buyer ? "buyer" : "ad"}): ${thread.ad}`);
      continue;
    }

    const start = Date.now() - thread.hoursAgo * HOUR;
    const step = Math.max(2 * 60 * 1000, (thread.hoursAgo * HOUR) / (thread.messages.length + 4));

    const price =
      ad.askingPrice ?? ad.servicePrice ?? ad.fullPrice ?? null;

    const messages = thread.messages.map((m, i) => {
      const author = m.from === "seller" ? seller : buyer;
      const createdAt = new Date(start + i * step);
      const unreadTail = i >= thread.messages.length - thread.unread;
      return {
        user: author._id,
        message: m.text,
        images: m.images ? chatImages.slice(0, m.images) : [],
        location: m.location
          ? {
              lat: 29.3375,
              lng: 48.0758,
              address: "Salem Al Mubarak Street, Salmiya, Kuwait",
            }
          : undefined,
        productReference: m.withProductRef
          ? {
              productId: ad._id,
              title: ad.title,
              price,
              image: ad.images?.[0] || null,
            }
          : undefined,
        isEdited: false,
        isDeleted: false,
        createdAt,
        deliveredAt: new Date(createdAt.getTime() + randInt(1, 20) * 1000),
        readAt: unreadTail ? null : new Date(createdAt.getTime() + randInt(1, 30) * 60 * 1000),
      };
    });

    const last = messages[messages.length - 1];
    const room = await ChatRoom.create({
      user1: buyer._id,
      user2: seller._id,
      messages,
      lastMessage: {
        user: last.user,
        message: last.message,
        images: last.images,
        createdAt: last.createdAt,
      },
      unreadCount: thread.unread,
    });

    await backdate(ChatRoom, [
      { _id: room._id, createdAt: messages[0].createdAt, updatedAt: last.createdAt },
    ]);
    created.push(room);
  }

  const totalMessages = created.reduce((n, r) => n + r.messages.length, 0);
  log(`  ${created.length} chat rooms holding ${totalMessages} messages`);
  return created;
};

const updateNewsletter = async (buyerUsers) => {
  const emails = [
    ...new Set([...buyerUsers.map((u) => u.email), ...NEWSLETTER_EXTRA]),
  ];
  const settings = await AdminSettings.findOne();
  if (settings) {
    settings.subscribedEmails = emails;
    await settings.save();
  } else {
    await AdminSettings.create({ subscribedEmails: emails });
  }
  log(`  ${emails.length} newsletter subscribers`);
};

// ---------------------------------------------------------------------------

const summarise = async () => {
  const rows = [
    ["users", await User.countDocuments()],
    ["sellers", await Seller.countDocuments()],
    ["ads", await Ad.countDocuments()],
    ["  products", await Ad.countDocuments({ adType: "product" })],
    ["  services", await Ad.countDocuments({ adType: "service" })],
    ["  events", await Ad.countDocuments({ adType: "event" })],
    ["  offers", await Ad.countDocuments({ adType: "offer" })],
    ["    flash deals", await Ad.countDocuments({ adType: "offer", flashDeal: true })],
    ["  explore", await Ad.countDocuments({ adType: "explore" })],
    ["promoted ads", await Ad.countDocuments({ paymentMode: { $ne: null } })],
    ["reviews", await Review.countDocuments()],
    ["favorites", await Favorite.countDocuments()],
    ["offer claims", await ClaimOffer.countDocuments()],
    ["notifications", await Notification.countDocuments()],
    ["chat rooms", await ChatRoom.countDocuments()],
  ];

  log("\n  Final counts");
  rows.forEach(([label, count]) =>
    log(`    ${String(label).padEnd(20)} ${count}`)
  );

  const tiers = { Bronze: 0, Silver: 0, Gold: 0, Diamond: 0 };
  for (const u of await User.find().select("totalloyaltiyPoints").lean()) {
    const p = u.totalloyaltiyPoints || 0;
    tiers[p >= 3000 ? "Diamond" : p >= 2000 ? "Gold" : p >= 1000 ? "Silver" : "Bronze"]++;
  }
  log(
    `\n  Membership tiers: ${Object.entries(tiers)
      .map(([t, n]) => `${t} ${n}`)
      .join(" · ")}`
  );
};

const run = async () => {
  if (!process.env.DB_URI) {
    console.error("DB_URI is not set. Expected it in backend/config/.env");
    process.exit(1);
  }

  await mongoose.connect(process.env.DB_URI);
  log(`Connected to ${mongoose.connection.name}\n`);

  log("Clearing marketplace collections");
  await clearMarketplace();

  log("\nSeeding");
  const { users, sellerUsers, buyerUsers, byKey } = await createUsers();
  const profiles = await createSellerProfiles(byKey);
  const ads = await createAds(byKey, profiles);
  await createReviews(ads, buyerUsers);
  await createFavorites(ads, buyerUsers, sellerUsers);
  await createClaims(ads, buyerUsers, sellerUsers);
  await createNotifications(ads, users, byKey, profiles);
  await createChats(ads, byKey);
  await updateNewsletter(buyerUsers);

  await summarise();

  log(`\n  Every seeded account signs in with: ${DEMO_PASSWORD}`);
  log(`  Example seller: ${SELLERS[0].email}`);
  log(`  Example buyer:  ${BUYERS[0].email}\n`);

  await mongoose.connection.close();
};

if (require.main === module) {
  run()
    .then(() => process.exit(0))
    .catch(async (error) => {
      console.error("\nSeeding failed:", error);
      await mongoose.connection.close().catch(() => {});
      process.exit(1);
    });
}

module.exports = { run };
