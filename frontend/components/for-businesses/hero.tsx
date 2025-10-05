import { getTranslations } from "next-intl/server"
import { Badge } from "@/components/common/badge"
import { Heart } from "lucide-react"
import Image from "next/image"

interface HeroSectionProps {
  locale: string
}

export async function HeroSection({ locale }: HeroSectionProps) {
  const t = await getTranslations({ locale, namespace: "ForBusinesses" })
  const isRTL = locale === "ar"

  return (
    <section className="relative min-h-[400px] max-h-[500px] w-full overflow-hidden bg-gradient-to-r from-primary to-secondary">
      <div className="absolute inset-0 bg-black/20 w-full"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-white space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6 pt-6">
              <Badge className="bg-white/20 text-white border-white/30 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-lg">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 ltr:mr-2 rtl:ml-2" />
                {t("hero.badge")}
              </Badge>
              <h1 className="text-2xl sm:text-h2 md:text-h1 font-bold leading-tight">
                {t("hero.title.part1")}{" "}
                <span className="text-tertiary">{t("hero.title.part2")}</span>
              </h1>
              <p className="text-base sm:text-large-regular opacity-90 leading-relaxed">
                {t("hero.subtitle")}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between sm:justify-start sm:space-x-6 rtl:space-x-reverse">
              <div className="text-center">
                <div className="text-lg sm:text-h4 font-bold">5,000+</div>
                <div className="text-xs sm:text-small-regular opacity-80">
                  {t("hero.stats.businesses")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-h4 font-bold">50,000+</div>
                <div className="text-xs sm:text-small-regular opacity-80">
                  {t("hero.stats.customers")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-h4 font-bold">2M KD</div>
                <div className="text-xs sm:text-small-regular opacity-80">
                  {t("hero.stats.saved")}
                </div>
              </div>
            </div>
          </div>

          {/* Right Images */}
          <div className="lg:block relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-0 lg:mt-15">
                <Image
                  src="/about-page-2.png"
                  alt="Happy Customers"
                  width={250}
                  height={140}
                  className="rounded-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
              <div className="space-y-8 mt-10 lg:mt-24">
                <Image
                  src="/about-page-3.png"
                  alt="Local Business"
                  width={250}
                  height={140}
                  className="rounded-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                />
                <Image
                  src="/about-page-1.png"
                  alt="Community Event"
                  width={250}
                  height={160}
                  className="rounded-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}