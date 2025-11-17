const cityEnum = [
  "kuwait-city",
  "hawalli",
  "farwaniya",
  "ahmadi",
  "jahra",
  "mubarak-al-kabeer",
];

const neighborhoodEnum = [
  "sharq",
  "dasman",
  "bneid-al-qar",
  "shuwaikh",
  "qabaliya",
  "mubarakiya",
  "salmiya",
  "jabriya",
  "mishref",
  "rumaithiya",
  "bayan",
  "al-zahra",
  "hawalli-city",
  "khaitan",
  "al-rai",
  "andalus",
  "firdous",
  "rabya",
  "ardhiya",
  "fahaheel",
  "mangaf",
  "mahboula",
  "abu-halala",
  "egaila",
  "sabahiya",
  "al-jahra-city",
  "naeem",
  "qaser",
  "saad-al-abdullah",
  "oyoun",
  "qurain",
  "qosour",
  "subhan",
  "adailiya",
];

// Offer

const offerCategoryEnum = [
  "restaurant",
  "hotel",
  "food",
  "attractions",
  "shopping",
  "spa",
  "entertainment",
  "fitness",
  "events",
  "travel",
  "services",
];

// Product

const productCategoriesEnum = [
  "electronics",
  "fashion",
  "home",
  "vehicles",
  "sports",
];

const productSubCategoriesEnum = {
  Electronics: [
    "smartphones",
    "laptops",
    "tablets",
    "accessories",
    "cameras",
    "headphones",
  ],
  Fashion: ["clothing", "shoes", "accessories", "watches", "jewelry", "bags"],
  Home: ["furniture", "appliances", "decor", "kitchen", "garden", "lighting"],
  Vehicles: ["cars", "motorcycles", "bicycles", "parts", "accessories"],
  Sports: ["equipment", "clothing", "shoes", "accessories", "fitness"],
};

// Service

const serviceCategoriesEnum = [
  "home-services",
  "automotive",
  "wellness",
  "professional",
  "education",
];

const serviceSubCategoriesEnum = {
  "home-services": [
    "cleaning",
    "plumbing",
    "electrical",
    "painting",
    "carpentry",
    "ac-repair",
  ],
  automotive: [
    "car-repair",
    "car-wash",
    "tire-service",
    "oil-change",
    "detailing",
    "mechanical",
  ],
  wellness: [
    "massage",
    "yoga",
    "fitness-training",
    "nutrition",
    "therapy",
    "meditation",
  ],
  professional: [
    "tutoring",
    "graphic-design",
    "web-development",
    "consulting",
    "accounting",
    "legal",
  ],
  education: [
    "language-classes",
    "music-lessons",
    "academic-tutoring",
    "skill-development",
    "test-prep",
    "arts",
  ],
};

const serviceTypeEnum = [
  "consultation",
  "repair",
  "installation",
  "cleaning",
  "beauty",
  "fitness",
  "education",
  "healthcare",
  "technical",
  "creative",
  "transport",
  "event",
  "legal",
  "financial",
];

const eventTypeEnum = [
  "concert",
  "conference",
  "workshop",
  "sports",
  "festival",
  "exhibition",
  "party",
  "other",
];

module.exports = {
  cityEnum,
  neighborhoodEnum,
  offerCategoryEnum,
  productCategoriesEnum,
  productSubCategoriesEnum,
  serviceCategoriesEnum,
  serviceSubCategoriesEnum,
  serviceTypeEnum,
  eventTypeEnum,
};
