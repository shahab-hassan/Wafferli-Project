/**
 * Verified image catalogue for the demo dataset.
 *
 * Every id below was fetched from the Unsplash CDN and visually checked so the
 * photo actually matches the listing it is attached to. Keep that habit if you
 * add more: a listing with an unrelated photo is the fastest way to make a
 * marketplace look fake.
 *
 * `next.config.mjs` sets `images.unoptimized`, so remote URLs render as-is and
 * no domain allow-list is needed.
 */

const photo = (id, w = 1200, h = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

// Square crop, used for seller logos.
const square = (id, size = 400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${size}&h=${size}&q=80`;

const IDS = {
  // ---- electronics ----
  phoneA: "photo-1592750475338-74b7b21085ab",
  phoneB: "photo-1511707171634-5f897ff02aa9",
  phoneC: "photo-1523206489230-c012c64b2b48",
  androidA: "photo-1610945265064-0e34e5519bbf",
  androidB: "photo-1583573636246-18cb2246697f",
  laptopA: "photo-1517336714731-489689fd1ca8",
  laptopB: "photo-1496181133206-80ce9b88a853",
  laptopC: "photo-1541807084-5c52b6b3adef",
  tabletA: "photo-1544244015-0df4b3ffc6b0",
  tabletB: "photo-1561154464-82e9adf32764",
  headphonesA: "photo-1505740420928-5e560c06d30e",
  headphonesB: "photo-1546435770-a3e426bf472b",
  cameraA: "photo-1502920917128-1aa500764cbd",
  cameraB: "photo-1516035069371-29a1b244cc32",
  droneA: "photo-1473968512647-3e447244af8f",
  tvA: "photo-1593359677879-a4bb92f829d1",
  consoleA: "photo-1486401899868-0e435ed85128",

  // ---- fashion ----
  smartwatchA: "photo-1546868871-7041f2a55e12",
  watchA: "photo-1523275335684-37898b6baf30",
  watchB: "photo-1547996160-81dfa63595aa",
  clothingA: "photo-1485231183945-fffde7cc051e",
  clothingB: "photo-1525507119028-ed4c629a60a3",
  clothingC: "photo-1441986300917-64674bd600d8",
  shoesA: "photo-1542291026-7eec264c27ff",
  shoesB: "photo-1560769629-975ec94e6a86",
  shoesC: "photo-1595950653106-6c9ebd614d3a",
  jewelryA: "photo-1515562141207-7a88fb7ce338",
  jewelryB: "photo-1605100804763-247f67b3557e",
  bagA: "photo-1553062407-98eeb64c6a62",
  bagB: "photo-1584917865442-de89df76afd3",
  abayaA: "photo-1583391733956-3750e0ff4e8b",
  // Unbranded bottles — deliberately not a real fragrance house, since these
  // are attached to an invented perfumery.
  attarA: "photo-1615634260167-c8cdede054de",
  attarB: "photo-1602928321679-560bb453f190",

  // ---- home ----
  sofaA: "photo-1555041469-a586c61ea9bc",
  sofaB: "photo-1567016432779-094069958ea5",
  fridgeA: "photo-1571175443880-49e1d25b2bc5",
  washerA: "photo-1626806787461-102c1bfaaea1",
  decorA: "photo-1513694203232-719a280e022f",
  decorB: "photo-1522708323590-d24dbb6b0267",
  kitchenA: "photo-1556909212-d5b604d0c90d",
  kitchenB: "photo-1600489000022-c2086d79f9d4",
  kitchenC: "photo-1556911220-bff31c812dba",
  gardenA: "photo-1416879595882-3373a0480b5b",
  gardenB: "photo-1585320806297-9794b3e4eeae",
  lightingA: "photo-1507473885765-e6ed057f782c",
  lightingB: "photo-1524634126442-357e0eac3c14",
  flowersA: "photo-1487070183336-b863922373d4",
  toysA: "photo-1558060370-d644479cb6f7",
  babyA: "photo-1522771930-78848d9293e8",
  booksA: "photo-1507842217343-583bb7270b66",

  // ---- vehicles ----
  carA: "photo-1503376780353-7e6692767b70",
  carB: "photo-1552519507-da3b142c6e3d",
  carC: "photo-1494976388531-d1058494cdd8",
  suvDesertA: "photo-1533473359331-0135ef1b58bf",
  sedanA: "photo-1621007947382-bb3c3994e3fb",
  carD: "photo-1541443131876-44b03de101c5",
  carE: "photo-1519501025264-65ba15a82390",
  motorcycleA: "photo-1558981806-ec527fa84c39",
  motorcycleB: "photo-1568772585407-9361f9bf3a87",
  bicycleA: "photo-1485965120184-e220f721d03e",
  bicycleB: "photo-1532298229144-0ec0c57515c7",
  carPartsA: "photo-1486262715619-67b85e0b08d3",
  carPartsB: "photo-1487754180451-c456f719a1fc",

  // ---- sports & fitness ----
  cyclingA: "photo-1517649763962-0c623066013b",
  trackA: "photo-1461896836934-ffe607ba8211",
  gymA: "photo-1534438327276-14e5300c3a48",
  gymB: "photo-1571902943202-507ec2618e8f",
  gymC: "photo-1517836357463-d25dfeac3438",
  pilatesA: "photo-1571019613454-1cb2f99b2d8b",
  trainerA: "photo-1571019614242-c5c5dee9f50b",
  padelA: "photo-1554068865-24cecd4e34b8",
  footballA: "photo-1431324155629-1a6deb1dec8d",
  ballA: "photo-1552667466-07770ae110d0",
  climbingA: "photo-1564769662533-4f00a87b4056",

  // ---- home services ----
  cleaningA: "photo-1581578731548-c64695cc6952",
  cleaningB: "photo-1527515637462-cff94eecc1ac",
  plumbingA: "photo-1607472586893-edb57bdc0e39",
  plumbingB: "photo-1621905251189-08b45d6a269e",
  electricalA: "photo-1621905251918-48416bd8575a",
  electricalB: "photo-1558618666-fcd25c85cd64",
  paintingA: "photo-1562259949-e8e7689d7828",
  paintingB: "photo-1589939705384-5185137a7f0f",
  carpentryA: "photo-1504148455328-c376907d081c",
  carpentryB: "photo-1601058268499-e52658b8bb88",
  constructionA: "photo-1523413363574-c30aa1c2a516",
  moversA: "photo-1600518464441-9154a4dea21b",
  laundryA: "photo-1545173168-9f1947eebb7f",
  petcareA: "photo-1450778869180-41d0601e046e",

  // ---- automotive services ----
  carRepairA: "photo-1530046339160-ce3e530c7d2f",
  carWashA: "photo-1520340356584-f9917d1eea6f",
  carWashB: "photo-1607860108855-64acf2078ed9",
  carDetailA: "photo-1601362840469-51e4d8d58785",

  // ---- wellness ----
  massageA: "photo-1544161515-4ab6ce6db874",
  spaA: "photo-1540555700478-4be289fbecef",
  yogaA: "photo-1544367567-0f2fcb009e0b",
  yogaB: "photo-1506126613408-eca07ce68773",
  nutritionA: "photo-1490645935967-10de6ba17061",
  nutritionB: "photo-1512621776951-a57141f2eefd",
  salonA: "photo-1560066984-138dadb4c035",
  barberA: "photo-1503951914875-452162b0f3f1",
  nailsA: "photo-1604654894610-df63bc536371",

  // ---- professional ----
  tutoringA: "photo-1503676260728-1c00da094a0b",
  tutoringB: "photo-1522202176988-66273c2fd55f",
  designA: "photo-1626785774573-4b799315345d",
  designB: "photo-1561070791-2526d30994b5",
  webdevA: "photo-1461749280684-dccba630e2f6",
  webdevB: "photo-1498050108023-c5249f4df085",
  consultingA: "photo-1552664730-d307ca884978",
  consultingB: "photo-1600880292203-757bb62b4baf",
  accountingA: "photo-1554224155-6726b3ff858f",
  accountingB: "photo-1450101499163-c8848c66ca85",
  legalA: "photo-1589829545856-d10d557cf95f",
  legalB: "photo-1436450412740-6b988f486c6b",
  languageA: "photo-1523240795612-9a054b0db644",
  musicA: "photo-1514320291840-2e0a9bf2a9ae",
  musicB: "photo-1493225457124-a3eb161ffa5f",
  photographerA: "photo-1554048612-b6a482bc67e5",

  // ---- events ----
  concertA: "photo-1516450360452-9312f5e86fc7",
  concertB: "photo-1459749411175-04bf5292ceea",
  concertC: "photo-1501281668745-f7f57925c3b4",
  conferenceA: "photo-1540575467063-178a50c2df87",
  conferenceB: "photo-1505373877841-8d25f7d46678",
  workshopA: "photo-1517245386807-bb43f82c33c4",
  workshopB: "photo-1524178232363-1fb2b075b655",
  festivalA: "photo-1533174072545-7a4b6ad7a6c3",
  festivalB: "photo-1514525253161-7a46d19cd819",
  exhibitionA: "photo-1531058020387-3be344556be6",
  partyA: "photo-1492684223066-81342ee5ff30",
  partyB: "photo-1530103862676-de8c9debad1d",
  cateringA: "photo-1555244162-803834f70033",

  // ---- food & hospitality ----
  restaurantA: "photo-1517248135467-4c7edcad34c4",
  restaurantB: "photo-1555396273-367ea4eb4db5",
  restaurantC: "photo-1414235077428-338989a2e8c0",
  rooftopA: "photo-1560624052-449f5ddf0c31",
  hotelA: "photo-1566073771259-6a8506099945",
  hotelB: "photo-1571896349842-33c89424de2d",
  burgerA: "photo-1568901346375-23c9450c58cd",
  burgerB: "photo-1571091718767-18b5b1457add",
  coffeeA: "photo-1554118811-1e0d58224f24",
  coffeeB: "photo-1495474472287-4d71bcdd2085",
  cafeA: "photo-1501339847302-ac426a4a7cbb",
  cafeB: "photo-1445116572660-236099ec97a0",
  sushiA: "photo-1579871494447-9811cf80d66c",
  pizzaA: "photo-1513104890138-7c749659a591",
  dessertA: "photo-1563805042-7684c019e1cb",
  juiceA: "photo-1600271886742-f049cd451bba",
  grillA: "photo-1544025162-d76694265947",
  arabicFoodA: "photo-1541518763669-27fef04b14ea",
  arabicFoodB: "photo-1585937421612-70a008356fbe",
  stewA: "photo-1580651315530-69c8e0026377",
  seafoodA: "photo-1559737558-2f5a35f4523b",
  bakeryA: "photo-1509440159596-0249088772ff",

  // ---- retail & leisure ----
  shoppingA: "photo-1483985988355-763728e1935b",
  mallA: "photo-1519567241046-7f570eee3ce6",
  cinemaA: "photo-1536440136628-849c177e76a1",
  cinemaB: "photo-1478720568477-152d9b164e26",
  travelA: "photo-1436491865332-7a61a109cc05",
  travelB: "photo-1488646953014-85cb44e25828",

  // ---- places to explore ----
  souqA: "photo-1555529669-e69e7aa0ba9a",
  souqB: "photo-1533900298318-6b8da08a523e",
  spicesA: "photo-1596040033229-a9821ebd058d",
  beachA: "photo-1507525428034-b723cf961d3e",
  beachB: "photo-1519046904884-53103b34b206",
  desertA: "photo-1547234935-80c7145ec969",
  islandA: "photo-1518623489648-a173ef7824f3",
  divingA: "photo-1544551763-46a013bb70d5",
  aquariumA: "photo-1544552866-d3ed42536cfd",
  fishA: "photo-1544551763-77ef2d0cfc6c",
  museumA: "photo-1554907984-15263bfd63bd",
  museumB: "photo-1518998053901-5348d3961a04",
  galleryA: "photo-1577720580479-7d839d829c73",
  parkA: "photo-1519331379826-f10be5486c6f",
  libraryA: "photo-1521587760476-6c12a4b040da",
  amusementA: "photo-1513889961551-628c1e5e2ee9",
};

const IMG = Object.fromEntries(
  Object.entries(IDS).map(([key, id]) => [key, photo(id)])
);

const LOGO = Object.fromEntries(
  Object.entries(IDS).map(([key, id]) => [key, square(id)])
);

module.exports = { IMG, LOGO, IDS, photo, square };
