// data.ts

export const allCity = [
  "kuwait-city",
  "hawalli",
  "farwaniya",
  "ahmadi",
  "jahra",
  "mubarak-al-kabeer",
];

export const allNeighborhood = [
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

export const offerCategories = [
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
export const productCategoryOptions = {
  electronics: {
    label: "electronics",
    subcategories: [
      { value: "phones", label: "Phones" },
      { value: "laptops", label: "Laptops" },
      { value: "tablets", label: "Tablets" },
      { value: "accessories", label: "Accessories" },
      { value: "cameras", label: "Cameras" },
    ],
  },
  fashion: {
    label: "fashion",
    subcategories: [
      { value: "clothing", label: "Clothing" },
      { value: "shoes", label: "Shoes" },
      { value: "accessories", label: "Accessories" },
      { value: "watches", label: "Watches" },
      { value: "jewelry", label: "Jewelry" },
    ],
  },
  home: {
    label: "home",
    subcategories: [
      { value: "furniture", label: "Furniture" },
      { value: "appliances", label: "Appliances" },
      { value: "decor", label: "Decor" },
      { value: "kitchen", label: "Kitchen" },
      { value: "garden", label: "Garden" },
    ],
  },
  vehicles: {
    label: "vehicles",
    subcategories: [
      { value: "cars", label: "Cars" },
      { value: "motorcycles", label: "Motorcycles" },
      { value: "bicycles", label: "Bicycles" },
      { value: "parts", label: "Parts & Accessories" },
    ],
  },
};
export const productCategories = [
  "electronics",
  "fashion",
  "home",
  "vehicles",
  "sports",
];

export const productSubCategories = {
  electronics: [
    "smartphones",
    "laptops",
    "tablets",
    "accessories",
    "cameras",
    "headphones",
  ],
  fashion: ["clothing", "shoes", "accessories", "watches", "jewelry", "bags"],
  home: ["furniture", "appliances", "decor", "kitchen", "garden", "lighting"],
  vehicles: ["cars", "motorcycles", "bicycles", "parts", "accessories"],
  Sports: ["equipment", "clothing", "shoes", "accessories", "fitness"],
};

// data/service-data.ts

export const categoryOptions = {
  "home-services": {
    label: "Home Services",
    subcategories: [
      { value: "cleaning", label: "Cleaning" },
      { value: "plumbing", label: "Plumbing" },
      { value: "electrical", label: "Electrical" },
      { value: "painting", label: "Painting" },
      { value: "carpentry", label: "Carpentry" },
      { value: "ac-repair", label: "AC Repair" },
    ],
  },
  automotive: {
    label: "Automotive",
    subcategories: [
      { value: "car-repair", label: "Car Repair" },
      { value: "car-wash", label: "Car Wash" },
      { value: "tire-service", label: "Tire Service" },
      { value: "oil-change", label: "Oil Change" },
      { value: "detailing", label: "Detailing" },
      { value: "mechanical", label: "Mechanical" },
    ],
  },
  wellness: {
    label: "Wellness",
    subcategories: [
      { value: "massage", label: "Massage" },
      { value: "yoga", label: "Yoga" },
      { value: "fitness-training", label: "Fitness Training" },
      { value: "nutrition", label: "Nutrition" },
      { value: "therapy", label: "Therapy" },
      { value: "meditation", label: "Meditation" },
    ],
  },
  professional: {
    label: "Professional",
    subcategories: [
      { value: "tutoring", label: "Tutoring" },
      { value: "graphic-design", label: "Graphic Design" },
      { value: "web-development", label: "Web Development" },
      { value: "consulting", label: "Consulting" },
      { value: "accounting", label: "Accounting" },
      { value: "legal", label: "Legal" },
    ],
  },
  education: {
    label: "Education",
    subcategories: [
      { value: "language-classes", label: "Language Classes" },
      { value: "music-lessons", label: "Music Lessons" },
      { value: "academic-tutoring", label: "Academic Tutoring" },
      { value: "skill-development", label: "Skill Development" },
      { value: "test-prep", label: "Test Prep" },
      { value: "arts", label: "Arts" },
    ],
  },
} as const;

export const serviceTypeOptions = [
  { value: "consultation", label: "Consultation" },
  { value: "repair", label: "Repair" },
  { value: "installation", label: "Installation" },
  { value: "cleaning", label: "Cleaning" },
  { value: "beauty", label: "Beauty" },
  { value: "fitness", label: "Fitness" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "technical", label: "Technical" },
  { value: "creative", label: "Creative" },
  { value: "transport", label: "Transport" },
  { value: "event", label: "Event" },
  { value: "legal", label: "Legal" },
  { value: "financial", label: "Financial" },
] as const;

// Legacy data structures for backward compatibility
export const serviceCategories = [
  "Home Services",
  "Automotive",
  "Wellness",
  "Professional",
  "Education",
];

export const serviceSubCategories = {
  "Home Services": [
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Painting",
    "Carpentry",
    "AC Repair",
  ],
  Automotive: [
    "Car Repair",
    "Car Wash",
    "Tire Service",
    "Oil Change",
    "Detailing",
    "Mechanical",
  ],
  Wellness: [
    "Massage",
    "Yoga",
    "Fitness Training",
    "Nutrition",
    "Therapy",
    "Meditation",
  ],
  Professional: [
    "Tutoring",
    "Graphic Design",
    "Web Development",
    "Consulting",
    "Accounting",
    "Legal",
  ],
  Education: [
    "Language Classes",
    "Music Lessons",
    "Academic Tutoring",
    "Skill Development",
    "Test Prep",
    "Arts",
  ],
};

export const serviceType = [
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

export const eventType = [
  "concert",
  "conference",
  "workshop",
  "sports",
  "festival",
  "exhibition",
  "party",
  "other",
];

// Price range options for quick selection
export const priceRangeOptions = [
  { min: 0, max: 1000, label: "Under 1,000" },
  { min: 1000, max: 5000, label: "1,000 - 5,000" },
  { min: 5000, max: 10000, label: "5,000 - 10,000" },
  { min: 10000, max: 25000, label: "10,000 - 25,000" },
  { min: 25000, max: 50000, label: "25,000 - 50,000" },
  { min: 50000, max: 100000, label: "50,000 - 100,000" },
];
