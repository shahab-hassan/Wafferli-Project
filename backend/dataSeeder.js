const mongoose = require("mongoose");
const faker = require("faker");

// Models
const User = require("./models/user.model");
const Seller = require("./models/seller.model");
const Ad = require("./models/ad/baseAd.model");
const ProductAd = require("./models/ad/productAd.model");
const ServiceAd = require("./models/ad/serviceAd.model");
const EventAd = require("./models/ad/eventAd.model");
const OfferAd = require("./models/ad/offerAd.model");
const ExploreAd = require("./models/ad/exploreAd.model");
const Favorite = require("./models/ad/favorite.model");
const ClaimOffer = require("./models/ad/claimOffer.model");
const Notification = require("./models/notification.model");

const {
  cityEnum,
  neighborhoodEnum,
  offerCategoryEnum,
  productCategoriesEnum,
  productSubCategoriesEnum,
  serviceCategoriesEnum,
  serviceSubCategoriesEnum,
  eventTypeEnum,
} = require("./utils/data");

// Use environment variable if available, otherwise fallback to the existing connection string
const MONGO_URI = process.env.DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

/**
 * Utility helpers
 */
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Clear collections we will seed
 */
const clearCollections = async () => {
  await Promise.all([
    User.deleteMany({}),
    Seller.deleteMany({}),
    mongoose.connection.collection("ads").deleteMany({}),
    Favorite.deleteMany({}),
    ClaimOffer.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log("Cleared target collections");
};

/**
 * Create users
 */
const createUsers = async (count = 20) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      fullName: faker.name.findName(),
      email: `user${Date.now()}_${i}@example.com`,
      phone: `965${randInt(10000000, 99999999)}`,
      password: "password123",
      isVerified: true,
      role: i < 4 ? "seller" : "user", // first few will be sellers
    });
  }
  const created = await User.insertMany(users);
  console.log(`Created ${created.length} users`);
  return created;
};

/**
 * Create sellers for some users
 */
const createSellers = async (users) => {
  const sellers = [];
  const sellerUsers = users.filter((u, idx) => idx < 6); // make first 6 users sellers
  for (const u of sellerUsers) {
    sellers.push({
      userId: u._id,
      businessType: rand(["individual", "business"]),
      category: rand(["electronics", "fashion", "home", "services"]),
      city: rand(cityEnum),
      neighbourhood: rand(neighborhoodEnum),
      name: faker.company.companyName(),
      description: faker.lorem.sentence(),
      phone: undefined,
    });
  }
  const created = await Seller.insertMany(sellers);
  console.log(`Created ${created.length} sellers`);
  return created;
};

/**
 * Create various ads for each seller
 * We will insert product ads using raw collection insert to avoid the product subcategory casing validator issue
 */
const createAdsForSellers = async (sellers, users) => {
  const adsCollection = mongoose.connection.collection("ads");
  const createdAds = [];

  for (const seller of sellers) {
    const sellerUser = users.find(
      (u) => u._id.toString() === seller.userId.toString()
    );

    // 1) Offer (flash deal)
    const offer = new OfferAd({
      title: `Flash Deal: ${faker.commerce.productName()}`,
      description: faker.lorem.sentences(2),
      phone: seller.phone || `965${randInt(10000000, 99999999)}`,
      userId: seller.userId,
      city: seller.city,
      neighbourhood: seller.neighbourhood,
      flashDeal: true,
      expiryDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      category: rand(offerCategoryEnum),
      claimDeal: false,
      discountDeal: true,
      fullPrice: randInt(10, 500),
      discountPercent: randInt(10, 70),
    });
    await offer.save();
    createdAds.push(offer);

    // 2) Service
    const serviceCategory = rand(serviceCategoriesEnum);
    const serviceSub = rand(serviceSubCategoriesEnum[serviceCategory]);
    const service = new ServiceAd({
      title: `${serviceSub} Service by ${seller.name || "Local"}`,
      description: faker.lorem.sentences(2),
      phone: seller.phone || `965${randInt(10000000, 99999999)}`,
      userId: seller.userId,
      city: seller.city,
      neighbourhood: seller.neighbourhood,
      category: serviceCategory,
      subCategory: serviceSub,
      servicePrice: randInt(10, 200),
      serviceType: rand(["repair", "cleaning", "installation"]),
    });
    await service.save();
    createdAds.push(service);

    // 3) Event
    const event = new EventAd({
      title: `${rand(eventTypeEnum)} Event - ${faker.company.catchPhrase()}`,
      description: faker.lorem.sentences(2),
      phone: seller.phone || `965${randInt(10000000, 99999999)}`,
      userId: seller.userId,
      city: seller.city,
      neighbourhood: seller.neighbourhood,
      eventDate: new Date(Date.now() + randInt(2, 30) * 24 * 60 * 60 * 1000),
      eventTime: "18:00",
      endTime: "21:00",
      eventType: rand(eventTypeEnum),
    });
    await event.save();
    createdAds.push(event);

    // 4) Explore
    const explore = new ExploreAd({
      title: `Explore: ${faker.lorem.words(3)}`,
      description: faker.lorem.sentences(2),
      phone: seller.phone || `965${randInt(10000000, 99999999)}`,
      userId: seller.userId,
      city: seller.city,
      neighbourhood: seller.neighbourhood,
      exploreName: faker.company.bs(),
      exploreDescription: faker.lorem.sentence(),
    });
    await explore.save();
    createdAds.push(explore);

    // 5) Product - insert raw to bypass model subcategory validator mismatch
    const productDoc = {
      title: faker.commerce.productName(),
      description: faker.lorem.sentences(2),
      phone: seller.phone || `965${randInt(10000000, 99999999)}`,
      userId: seller.userId,
      city: seller.city,
      neighbourhood: seller.neighbourhood,
      images: [],
      adType: "product",
      category: rand(productCategoriesEnum),
      subCategory: "general",
      quantity: randInt(1, 50),
      discount: rand([true, false]),
      recurring: false,
      askingPrice: randInt(5, 1000),
      discountPercent: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const insertRes = await adsCollection.insertOne(productDoc);
    const insertedProduct = await Ad.findById(insertRes.insertedId);
    createdAds.push(insertedProduct);
  }

  console.log(`Created ${createdAds.length} ads across all sellers`);
  return createdAds;
};

/**
 * Create favorites and claims to establish relationships
 */
const createFavoritesAndClaims = async (users, ads) => {
  const favorites = [];
  const claims = [];

  // Randomly favorite some ads by some users
  for (const u of users.slice(0, 10)) {
    const ad = rand(ads);
    favorites.push({
      userId: u._id,
      adId: ad._id,
      adType: ad.adType || ad.adType,
    });
  }
  await Favorite.insertMany(favorites);

  // Create a few claim offers for offer ads
  const offerAds = ads.filter((a) => a.adType === "offer");
  for (let i = 0; i < Math.min(offerAds.length, 5); i++) {
    const offer = offerAds[i];
    const user = users[i];
    claims.push({
      userId: user._id,
      offerId: offer._id,
      claimCode: `C${Date.now().toString().slice(-6)}${i}`,
      termsAndConditions: true,
      notification: false,
      loyaltyPoints: randInt(0, 50),
      status: "active",
    });
  }
  await ClaimOffer.insertMany(claims);

  console.log(
    `Created ${favorites.length} favorites and ${claims.length} claim offers`
  );
};

/**
 * Main seeding orchestrator
 */
const seedData = async () => {
  try {
    await connectDB();
    await clearCollections();

    const users = await createUsers(20);
    const sellers = await createSellers(users);
    const ads = await createAdsForSellers(sellers, users);
    await createFavoritesAndClaims(users, ads);

    console.log("Seeding completed successfully");
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seeder when executed directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData };
