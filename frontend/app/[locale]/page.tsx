import BusinessDiscoveryCarousel from "@/components/home-page/hero";
import CategoriesSection from "@/components/home-page/explore-tabs";
import { Button } from "@/components/common/button";
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

export default async function LandingPage({ params }: {
  params: { locale: string };
}) {
  const { locale } = await params;

  // Get translations and locale for RTL detection
  const t = await getTranslations({ locale, namespace: "LandingPage" });

  // Check if the current locale is RTL
  const isRTL = locale === "ar";

  const SectionHeader = ({ title, highlight, description, type }: {
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
