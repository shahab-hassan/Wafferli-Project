"use client"
import { MapPin, Navigation, Clock } from "lucide-react"
import { Button } from "@/components/common/button"
import { Card, CardContent } from "@/components/common/shadecn-card"

interface LocationSectionProps {
  business: {
    name: string
    address: string
    coordinates: { lat: number; lng: number }
  }
}

export default function LocationSection({ business }: LocationSectionProps) {
  const handleGetDirections = () => {
    const url = `https://www.openstreetmap.org/?mlat=${business.coordinates.lat}&mlon=${business.coordinates.lng}&zoom=16`
    window.open(url, "_blank")
  }

  return (
    <Card className="border-0 bg-white border">
      <CardContent className="p-0">
        <h3 className="px-2 sm:px-3 lg:px-4 pt-4 sm:pt-2 lg:pt-4 text-lg sm:text-xl font-bold text-gray-900 mb-2 lg:mb-4">
          Location & Directions
        </h3>

        {/* Map section with OpenStreetMap */}
        <div className="relative h-70 sm:h-60 lg:h-100 rounded-2xl overflow-hidden mb-4 lg:mb-6 px-2">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${business.coordinates.lng - 0.01}%2C${business.coordinates.lat - 0.01}%2C${business.coordinates.lng + 0.01}%2C${business.coordinates.lat + 0.01}&layer=mapnik&marker=${business.coordinates.lat}%2C${business.coordinates.lng}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
          ></iframe>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <Button variant="primary" onClick={handleGetDirections} className="flex-1">
              <Navigation className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Get Directions
            </Button>

            <div className="flex items-center justify-center sm:justify-start space-x-3 lg:space-x-4 text-gray-600 text-sm lg:text-base">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                <span>2.3 km away</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                <span>8 min drive</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
