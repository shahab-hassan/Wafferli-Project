"use client"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Badge } from "@/components/common/badge"
import { useTranslations } from "next-intl"

interface MarketplaceProductDetailsProps {
  product: {
    id: string
    name: string
    brand: string
    description: string
    price: number
    originalPrice?: number
    discount?: number
    condition: string
    category: string
    subcategory: string
    inStock: boolean
    seller: string
  }
}

export default function MarketplaceProductDetails({ product }: MarketplaceProductDetailsProps) {
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
            {/* Product Summary */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3 lg:mb-4">
                <Badge className="bg-blue-100 text-blue-700 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  {t("marketplace.badges.product")}
                </Badge>
                <Badge className="bg-primary/10 text-primary rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  {product.brand}
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  {product.condition}
                </Badge>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-xl border lg:rounded-2xl p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 lg:space-x-3 mb-1 lg:mb-2">
                      <span className="text-2xl lg:text-3xl font-bold text-primary">{product.price} KD</span>
                      {product.originalPrice && (
                        <span className="text-lg lg:text-xl text-gray-400 line-through">
                          {product.originalPrice} KD
                        </span>
                      )}
                    </div>
                    {product.discount && product.originalPrice && (
                      <div className="text-yellow-600 font-semibold text-sm lg:text-base">
                        You save {product.originalPrice - product.price} KD ({product.discount}% off)
                      </div>
                    )}
                  </div>
                  {product.discount && (
                    <div className="text-right">
                      <div className="text-xl lg:text-2xl font-bold text-green-600">{product.discount}%</div>
                      <div className="text-xs lg:text-sm text-gray-600">Discount</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="bg-white border rounded-xl lg:rounded-2xl p-4 lg:p-6">
              <h3 className="font-bold text-gray-900 mb-3 lg:mb-4 text-base lg:text-lg">
                {t("marketplace.details.availability")}
              </h3>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
                <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                  {product.inStock ? t("marketplace.inStock") : t("marketplace.outOfStock")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
