"use client"

import { useParams } from "next/navigation"
import LocationSection from "@/components/marketplace/location-section"
import AdsGrid from "@/components/profile/ads-grid"
import BusinessSidebar from "@/components/profile/business-sidebar"
import BusinessHero from "@/components/profile/business-hero"

// Mock data - in real app, this would come from API based on the ID
const getBusinessData = (id: string) => ({
  id,
  name: "Techzone Kuwait",
  memberSince: "14 August, 2025",
  activeAds: 10,
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ea molestie leo. Quisque ut elementum lorem, ut consequat est. Nunc lacinia justo ac tortor porttitor, non efficitur felis ornare. Duis gravida, dolor sed finibus interdum, nisl nisi aliquam.",
  phone: "+965 2222 3333",
  address: "Gulf Road, Kuwait City, Kuwait",
  website: "www.alboom-restaurant.com",
  facebook: true,
  instagram: "alboom",
  coordinates: { lat: 29.3759, lng: 47.9774 },
})

export default function BusinessProfilePage() {
  const params = useParams()
  const business = getBusinessData(params.id as string)

  return (
    <div className="min-h-screen bg-background">
      <BusinessHero />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6 order-last lg:order-none">
            <AdsGrid business={business} />
            <LocationSection business={business} />
          </div>
          <div className="lg:col-span-1 order-first lg:order-none">
            <BusinessSidebar business={business} />
          </div>
        </div>
      </div>
    </div>
  )
}