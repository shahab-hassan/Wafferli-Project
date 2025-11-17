import BusinessDiscoveryCarousel from "@/components/home-page/hero";
import CategoriesSection from "@/components/home-page/explore-tabs";
import { Button } from "@/components/common/button";
import { CardSlider } from "@/components/common/sliders/card-slider";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { FlashDealsSlider } from "@/components/common/sliders/flash-slider";
import { FeaturedBlogsSection } from "@/components/home-page/featured-blogs-section";
import FAQSection from "@/components/home-page/FAQ/faq";
import GetWafferliApp from "@/components/home-page/GetWafferliApp";
import Newsletter from "@/components/home-page/newsletter";
import Link from "next/link";
import ExploreSection from "@/components/common/exploreSection";
import ProductSection from "@/components/common/productSection";
import EventSection from "@/components/common/eventSection";

export default async function LandingPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;

  // Get translations and locale for RTL detection
  const t = await getTranslations({ locale, namespace: "LandingPage" });

  // Check if the current locale is RTL
  const isRTL = locale === "ar";

  const sampleItems = [
    // Sponsored first
    {
      id: "1",
      title: "Scientific Center",
      subtitle: "Popular with families this week",
      image: "/placeholder.svg?height=145&width=320&query=scientific center",
      category: "Landmarks",
      rating: 4.8,
      reviewCount: 423,
      distance: "4.2 km",
      price: "$",
      isFree: false,
      badge: "sponsored",
    },
    {
      id: "2",
      title: "Souq Al-Mubarakiya",
      subtitle: "Trending for authentic shopping",
      image: "/placeholder.svg?height=145&width=320&query=souq market",
      category: "Shopping",
      rating: 4.4,
      reviewCount: 668,
      distance: "1.8 km",
      isFree: true,
      badge: "sponsored",
    },
    // Trending next
    {
      id: "3",
      title: "Marina Beach",
      subtitle: "Perfect weather this week",
      image: "/placeholder.svg?height=145&width=320&query=marina beach",
      category: "Beach",
      rating: 4.3,
      reviewCount: 234,
      distance: "6.7 km",
      isFree: true,
      badge: "trending",
    },
    {
      id: "4",
      title: "Scientific Center",
      subtitle: "Popular with families this week",
      image: "/placeholder.svg?height=145&width=320&query=scientific center",
      category: "Landmarks",
      rating: 4.8,
      reviewCount: 423,
      distance: "4.2 km",
      price: "$",
      isFree: false,
      badge: "trending",
    },
    // Normal last
    {
      id: "5",
      title: "Souq Al-Mubarakiya",
      subtitle: "Trending for authentic shopping",
      image: "/placeholder.svg?height=145&width=320&query=souq market",
      category: "Shopping",
      rating: 4.4,
      reviewCount: 668,
      distance: "1.8 km",
      isFree: true,
      badge: null,
    },
    {
      id: "6",
      title: "Marina Beach",
      subtitle: "Perfect weather this week",
      image: "/placeholder.svg?height=145&width=320&query=marina beach",
      category: "Beach",
      rating: 4.3,
      reviewCount: 234,
      distance: "6.7 km",
      isFree: true,
      badge: null,
    },
    {
      id: "7",
      title: "Scientific Center",
      subtitle: "Popular with families this week",
      image: "/placeholder.svg?height=145&width=320&query=scientific center",
      category: "Landmarks",
      rating: 4.8,
      reviewCount: 423,
      distance: "4.2 km",
      price: "$",
      isFree: false,
      badge: null,
    },
  ];

  const demoDeals = [
    {
      id: "1",
      title: "Pizza Palace",
      subtitle: "Authentic Italian cuisine with wood-fired pizzas",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      location: "Downtown, NY",
      rating: 4.8,
      reviewCount: 120,
      originalPrice: "$45.00",
      discountedPrice: "$29.00",
      discountPercentage: 35,
      expiryDate: "2025-09-11T02:15:30Z", // YYYY-MM-DDTHH:mm:ssZ
      badge: "trending",
    },
    {
      id: "2",
      title: "Burger Bistro",
      subtitle: "Gourmet burgers made with premium ingredients",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      location: "Midtown, NY",
      rating: 4.6,
      reviewCount: 89,
      originalPrice: "$32.00",
      discountedPrice: "$19.00",
      discountPercentage: 40,
      expiryDate: "2025-09-11T02:22:45Z",
      badge: "sponsored",
    },
    {
      id: "3",
      title: "Sushi Zen",
      subtitle: "Fresh sushi and traditional Japanese dishes",
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
      location: "East Village, NY",
      rating: 4.9,
      reviewCount: 156,
      originalPrice: "$60.00",
      discountedPrice: "$42.00",
      discountPercentage: 30,
      expiryDate: "2025-09-11T02:08:12Z",
      badge: "expiring_soon",
    },
    {
      id: "4",
      title: "Taco Fiesta",
      subtitle: "Authentic Mexican street tacos and margaritas",
      image:
        "https://images.unsplash.com/photo-1565299585323-38174c5d5ed6?w=400&h=300&fit=crop",
      location: "SoHo, NY",
      rating: 4.5,
      reviewCount: 73,
      originalPrice: "$28.00",
      discountedPrice: "$17.00",
      discountPercentage: 39,
      expiryDate: "2025-09-11T02:33:22Z",
    },
    {
      id: "5",
      title: "Pasta Corner",
      subtitle: "Handmade pasta with traditional Italian sauces",
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
      location: "Little Italy, NY",
      rating: 4.7,
      reviewCount: 94,
      originalPrice: "$38.00",
      discountedPrice: "$25.00",
      discountPercentage: 34,
      expiryDate: "2025-09-11T02:19:55Z",
    },
    {
      id: "6",
      title: "Steakhouse Prime",
      subtitle: "Premium cuts of beef and fine dining experience",
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
      location: "Upper East Side, NY",
      rating: 4.9,
      reviewCount: 203,
      originalPrice: "$85.00",
      discountedPrice: "$59.00",
      discountPercentage: 31,
      expiryDate: "2025-09-11T02:41:08Z",
    },
  ];
  const SectionHeader = ({
    title,
    highlight,
    description,
    type,
  }: {
    type: "explore" | "event" | "product";
    title: string;
    highlight: string;
    description: string;
  }) => (
    <div className="mb-4">
      <div
        className={cn(
          "flex justify-between items-center mb-2",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Heading */}
        <h1
          className={cn(
            "text-h6 md:text-h5 flex-1",
            isRTL ? "text-right order-2" : "text-left order-1"
          )}
        >
          {title}{" "}
          <span className="text-h6 md:text-h5 text-primary">{highlight}</span>
        </h1>

        {/* Button */}
        <Link
          href={`/${type}`}
          className={cn(
            "text-primary flex items-center gap-2",
            isRTL ? "flex-row-reverse order-1" : "flex-row order-2"
          )}
        >
          <Button variant="outline" size="sm">
            {t("common.viewAll")} {isRTL ? "←" : "→"}
          </Button>
        </Link>
      </div>
      <p
        className={cn(
          "text-normal-regular sm:text-medium-regular",
          isRTL ? "text-right" : "text-left"
        )}
      >
        {description}
      </p>
    </div>
  );

  return (
    <div
      className="flex flex-col justify-center items-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <header className="w-full max-w-[1440px] justify-center items-center">
        <BusinessDiscoveryCarousel />
      </header>
      <main className="max-w-[1440px] w-full flex flex-col justify-center items-center">
        {/* Category section */}
        <section className="max-w-[1120px] w-full pt-[32px] mb-2">
          <h1 className="text-h5 md:text-h4 text-center mb-[8px]">
            {t("categories.title")}
          </h1>
          <p className="text-medium-regular text-center mb-[12px] px-3">
            {t("categories.description")}
          </p>
          <CategoriesSection />
        </section>

        {/* Explore Section */}
        <section className="max-w-[1120px] w-full pt-[32px] mb-2 mt-2 px-3">
          <SectionHeader
            title={t("explore.titlePrefix")}
            highlight={t("explore.titleHighlight")}
            description={t("explore.description")}
            type="explore"
          />
          <ExploreSection />
          {/* <CardSlider type="explore" items={sampleItems} showDots={true} /> */}
        </section>

        {/* Services Section */}
        <section className="max-w-[1120px] w-full pt-[32px] mb-2 mt-2 px-3">
          <SectionHeader
            // title={t("services.titlePrefix")}
            title={t("services.titlePrefix")}
            // highlight={t("services.titleHighlight")}
            highlight="Events"
            description={t("services.description")}
            type="event"
          />
          <EventSection />
          {/* <CardSlider type="services" items={sampleItems} showDots={true} /> */}
        </section>

        {/* Products Section */}
        <section className="max-w-[1120px] w-full pt-[32px] mb-4 mt-2 px-3">
          <SectionHeader
            title={t("products.titlePrefix")}
            highlight={t("products.titleHighlight")}
            description={t("products.description")}
            type="product"
          />
          <ProductSection />
          {/* <CardSlider type="products" items={sampleItems} showDots={true} /> */}
        </section>

        <FlashDealsSlider autoSlideInterval={5000} />

        <FeaturedBlogsSection />

        <FAQSection />

        <GetWafferliApp />

        <Newsletter />
      </main>
    </div>
  );
}
