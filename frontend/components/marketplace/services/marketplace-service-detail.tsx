"use client"
import { Calendar, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Badge } from "@/components/common/badge"
import { useTranslations } from "next-intl"

interface MarketplaceServiceDetailsProps {
  service: {
    id: string
    name: string
    category: string
    subcategory: string
    description: string
    startingPrice: number
    seller: string
  }
}

export default function MarketplaceServiceDetails({ service }: MarketplaceServiceDetailsProps) {
  const t = useTranslations()

  return (
    <div className="space-y-6">
      <Card className="bg-white border rounded-xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("marketplace.details.description")}</h2>
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in quam nisl. Suspendisse suscipit
            venenatis turpis, non ullamcorper nisl laoreet vitae. Cras ornare ex convallis nisl faucibus vehicula. Fusce
            quis molestie magna, eget tempus felis. In hac habitasse platea dictumst. Pellentesque ut dui nec purus
            pulvinar fringilla feugiat eget mi. Donec non sapien quam. Ut molestie dui non risus accumsan, nec blandit
            nulla facilisis. Sed metus urna, commodo ut turpis at, congue molestie justo. Aliquam nisl elit, tincidunt
            lacinia volutpat ac, finibus ut eros. Quisque volutpat mi quam, eu luctus est porta ut. Sed turpis est,
            sagittis vel turpis non, facilisis fermentum orci. Etiam sed imperdiet dui.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-transparent !rounded-md">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-4 lg:space-y-6">
            {/* Service Summary */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3 lg:mb-4">
                <Badge className="bg-green-100 text-green-700 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  {t("marketplace.badges.service")}
                </Badge>
                <Badge className="bg-primary/10 text-primary rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  {service.category}
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  {service.subcategory}
                </Badge>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-xl border lg:rounded-2xl p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">{t("marketplace.services.startingFrom")}</div>
                    <div className="text-2xl lg:text-3xl font-bold text-primary">{service.startingPrice} KD</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="bg-white border rounded-xl lg:rounded-2xl p-4 lg:p-6">
              <h3 className="font-bold text-gray-900 mb-3 lg:mb-4 text-base lg:text-lg">
                {t("marketplace.details.serviceInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm lg:text-base">{t("marketplace.details.availability")}</div>
                    <div className="text-gray-600 text-sm">{t("marketplace.details.contactForScheduling")}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm lg:text-base">{t("marketplace.details.responseTime")}</div>
                    <div className="text-gray-600 text-sm">{t("marketplace.details.within24Hours")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
