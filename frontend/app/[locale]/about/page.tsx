import { useTranslations } from "next-intl"
import Image from "next/image"
import {
  Heart,
  Users,
  Target,
  Eye,
  MapPin,
  Zap,
  Gift,
  Shield,
  Search,
  MessageCircle,
  BarChart,
} from "lucide-react"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Badge } from "@/components/common/badge"
import CallToActionSection from "@/components/about-page/call-to-action"
import { cn } from "@/lib/utils"

export default function AboutPage() {
  const t = useTranslations("about")

  const timeline = [
    {
      year: "2020",
      title: t("timeline.2020.title"),
      description: t("timeline.2020.description"),
    },
    {
      year: "2021",
      title: t("timeline.2021.title"),
      description: t("timeline.2021.description"),
    },
    {
      year: "2022",
      title: t("timeline.2022.title"),
      description: t("timeline.2022.description"),
    },
    {
      year: "2023",
      title: t("timeline.2023.title"),
      description: t("timeline.2023.description"),
    },
    {
      year: "2024",
      title: t("timeline.2024.title"),
      description: t("timeline.2024.description"),
    },
  ]

  const customerBenefits = [
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: t("benefits.discover.title"),
      description: t("benefits.discover.description"),
      borderColor: "border-primary",
      gradient: "from-primary/10 to-primary/5",
    },
    {
      icon: <Gift className="w-8 h-8 text-secondary" />,
      title: t("benefits.save.title"),
      description: t("benefits.save.description"),
      borderColor: "border-secondary",
      gradient: "from-secondary/10 to-secondary/5",
    },
    {
      icon: <Zap className="w-8 h-8 text-tertiary" />,
      title: t("benefits.exclusive.title"),
      description: t("benefits.exclusive.description"),
      borderColor: "border-tertiary",
      gradient: "from-tertiary/10 to-tertiary/5",
    },
    {
      icon: <Heart className="w-8 h-8 text-failure" />,
      title: t("benefits.personalized.title"),
      description: t("benefits.personalized.description"),
      borderColor: "border-failure",
      gradient: "from-failure/10 to-failure/5",
    },
    {
      icon: <Shield className="w-8 h-8 text-success" />,
      title: t("benefits.trusted.title"),
      description: t("benefits.trusted.description"),
      borderColor: "border-success",
      gradient: "from-success/10 to-success/5",
    },
    {
      icon: <Users className="w-8 h-8 text-info" />,
      title: t("benefits.community.title"),
      description: t("benefits.community.description"),
      borderColor: "border-info",
      gradient: "from-info/10 to-info/5",
    },
  ]

  const businessSupports = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: t("business.increase.title"),
      description: t("business.increase.description"),
      gradient: "from-primary/10 to-primary/5",
      image: "/about-support-1.svg",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-secondary" />,
      title: t("business.boost.title"),
      description: t("business.boost.description"),
      gradient: "from-secondary/10 to-secondary/5",
      image: "/about-support-2.svg",
    },
    {
      icon: <BarChart className="w-8 h-8 text-tertiary" />,
      title: t("business.marketing.title"),
      description: t("business.marketing.description"),
      gradient: "from-tertiary/10 to-tertiary/5",
      image: "/about-support-3.svg",
    },
  ];


  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
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
                  <div className="text-lg sm:text-h4 font-bold">1000+</div>
                  <div className="text-xs sm:text-small-regular opacity-80">
                    {t("hero.stats.businesses")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-h4 font-bold">50K+</div>
                  <div className="text-xs sm:text-small-regular opacity-80">
                    {t("hero.stats.customers")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-h4 font-bold">2.5M+</div>
                  <div className="text-xs sm:text-small-regular opacity-80">
                    {t("hero.stats.saved")}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Images */}
            <div className="lg:block relative">
              <div className="grid grid-cols-2 gap-4">
                {/* shrink image sizes slightly */}
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

      {/* Our Story Section - Full width gradient background */}
      <section className="w-full py-20 bg-gradient-to-b from-[#F9FAFB] to-[#FAF5FF] rounded-t-[3rem] -mt-8">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h4 md:text-h2 font-bold text-black-1 mb-6">{t("story.title")}</h2>
            <p className="text-large-regular text-grey-2 max-w-3xl mx-auto">
              {t("story.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative">
              <Image
                src="/about-page-story.svg"
                alt="Founder Story"
                width={500}
                height={400}
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-h5 font-bold text-black-1">{t("story.content.title")}</h3>
              <p className="text-medium-regular text-grey-2 leading-relaxed text-justify">
                {t("story.content.paragraph1")}
              </p>
              <p className="text-medium-regular text-grey-2 leading-relaxed text-justify">
                {t("story.content.paragraph2")}
              </p>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=64&width=64&text=Founder"
                    alt="Founder"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-normal-semibold text-black-1">{t("story.founder.name")}</div>
                  <div className="text-small-regular text-grey-2">{t("story.founder.title")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="relative">
            {/* Vertical line only on large screens */}
            <div className="hidden lg:block absolute ltr:left-1/2 rtl:right-1/2 transform ltr:-translate-x-1/2 rtl:translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            <div className="space-y-8 lg:space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row items-center ${index % 2 === 0
                      ? "lg:ltr:flex-row lg:rtl:flex-row-reverse"
                      : "lg:ltr:flex-row-reverse lg:rtl:flex-row"
                    }`}
                >
                  {/* Card */}
                  <div
                    className={`w-full lg:w-1/2 ${index % 2 === 0
                        ? "lg:ltr:pr-8 lg:ltr:text-right lg:rtl:pl-8 lg:rtl:text-left"
                        : "lg:ltr:pl-8 lg:ltr:text-left lg:rtl:pr-8 lg:rtl:text-right"
                      }`}
                  >
                    <Card className="rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <CardContent className="p-6 sm:p-8">
                        <Badge className="bg-gradient-to-r from-primary to-secondary text-white rounded-full px-3 py-1 mb-3 text-sm sm:text-base">
                          {item.year}
                        </Badge>
                        <h4 className="text-base sm:text-lg md:text-xl font-bold text-black-1 mb-2">
                          {item.title}
                        </h4>
                        <p className="text-sm sm:text-base text-grey-2 leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline Dot (only on large screens) */}
                  <div className="hidden lg:block relative z-10">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  <div className="w-full lg:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* Mission & Vision Cards - Full width white background */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission Card */}
            <Card className="rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:scale-102 overflow-hidden bg-gradient-to-br from-primary to-primary/80">
              <CardContent className="p-12 text-white">
                <div className="flex items-center mb-6 rtl:flex-row-reverse">
                  <div className="w-16 h-16 bg-tertiary rounded-2xl flex items-center justify-center ltr:mr-4 rtl:ml-4">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-h4 font-bold">{t("mission.title")}</h3>
                </div>
                <p className="text-large-regular leading-relaxed mb-6">
                  {t("mission.description")}
                </p>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Badge className="bg-tertiary text-primary rounded-full px-4 py-2">
                    <Users className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                    {t("mission.badge1")}
                  </Badge>
                  <Badge className="bg-white/20 text-white rounded-full px-4 py-2">
                    <Heart className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                    {t("mission.badge2")}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Vision Card */}
            <Card className="rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:scale-102 overflow-hidden bg-gradient-to-br from-secondary to-secondary/80">
              <CardContent className="p-12 text-white">
                <div className="flex items-center mb-6 rtl:flex-row-reverse">
                  <div className="w-16 h-16 bg-tertiary rounded-2xl flex items-center justify-center ltr:mr-4 rtl:ml-4">
                    <Eye className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-h4 font-bold">{t("vision.title")}</h3>
                </div>
                <p className="text-large-regular leading-relaxed mb-6">
                  {t("vision.description")}
                </p>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Badge className="bg-tertiary text-secondary rounded-full px-4 py-2">
                    <Target className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                    {t("vision.badge1")}
                  </Badge>
                  <Badge className="bg-white/20 text-white rounded-full px-4 py-2">
                    <Eye className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                    {t("vision.badge2")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How We Help Customers Section - Full width gradient background */}
      <section className="w-full py-20 bg-gradient-to-b from-[#F9FAFB] to-[#FAF5FF]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h4 md:text-h2 font-bold text-black-1 mb-6">{t("customers.title")}</h2>
            <p className="text-medium-regular text-grey-1 max-w-3xl mx-auto">
              {t("customers.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerBenefits.map((benefit, index) => (
              <Card
                key={index}
                className={cn(
                  "rounded-[12px] hover:shadow-xl transition-all duration-300 transform hover:scale-102 overflow-hidden border-1 border-grey-5"
                )}
              >
                <div className={cn("h-2 bg-gradient-to-r", benefit.gradient)}></div>
                <CardContent className="p-8 text-center">
                  <div
                    className={cn(
                      "w-[48px] h-[48px] bg-gradient-to-r rounded-xl flex items-center justify-center mx-auto mb-6",
                      benefit.gradient
                    )}
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="text-medium-bold text-black-1 mb-4">{benefit.title}</h3>
                  <p className="text-small-regular text-grey-2 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* How We Support Businesses Section - Full width gradient background */}
      <section className="w-full py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h4 md:text-h2 font-bold text-black mb-6">{t("business.title")}</h2>
            <p className="text-medium-regular text-grey-1 max-w-3xl mx-auto">
              {t("business.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businessSupports.map((support, index) => (
              <Card
                key={index}
                className={cn(
                  "rounded-[16px] h-[480px] flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-102 overflow-hidden border border-grey-5 bg-white"
                )}
              >
                <div className={cn("h-2 bg-gradient-to-r", support.gradient)}></div>

                {/* Top Image Section */}
                <div className="relative w-full h-2/3 mt-2">
                  <Image
                    src={support.image}
                    alt={support.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Bottom Content Section */}
                <CardContent className="flex flex-col justify-center items-center flex-1 p-6 text-center">
                  <h3 className="text-medium-bold text-black-1 mb-2">{support.title}</h3>
                  <p className="text-small-regular text-grey-2 leading-relaxed  max-w-[250px]">
                    {support.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Call-to-Action Section */}
      <CallToActionSection />
    </div>
  )
}