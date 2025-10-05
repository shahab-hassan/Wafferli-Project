import { getTranslations } from "next-intl/server"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Badge } from "@/components/common/badge"
import { Eye, BarChart3, CreditCard, Target } from "lucide-react"

interface BenefitsSectionProps {
  locale: string
}

const benefitIcons = [Eye, BarChart3, CreditCard, Target]
const benefitColors = [
  "from-purple-100 to-purple-50",
  "from-pink-100 to-pink-50",
  "from-green-100 to-green-50",
  "from-blue-100 to-blue-50",
]
const iconColors = ["text-purple-600", "text-pink-600", "text-green-600", "text-blue-600"]

export async function BenefitsSection({ locale }: BenefitsSectionProps) {
  const t = await getTranslations({ locale, namespace: "ForBusinesses" })
  const isRTL = locale === "ar"

  const benefits = [
    {
      title: t("benefits.items.reach.title"),
      description: t("benefits.items.reach.description"),
      stat: t("benefits.items.reach.stat"),
    },
    {
      title: t("benefits.items.analytics.title"),
      description: t("benefits.items.analytics.description"),
      stat: t("benefits.items.analytics.stat"),
    },
    {
      title: t("benefits.items.payment.title"),
      description: t("benefits.items.payment.description"),
      stat: t("benefits.items.payment.stat"),
    },
    {
      title: t("benefits.items.sponsored.title"),
      description: t("benefits.items.sponsored.description"),
      stat: t("benefits.items.sponsored.stat"),
    },
  ]

  return (
    <section className="mt-4">
      <div className="max-w-[1440px] w-full container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t("benefits.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("benefits.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefitIcons[index]
            return (
              <Card
                key={index}
                className="rounded-xl border !border-[1px] hover:shadow-md transition-all duration-300 transform hover:scale-102 border-0 overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${benefitColors[index]}`}></div>
                <CardContent className="p-8">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${benefitColors[index]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`w-8 h-8 ${iconColors[index]}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
