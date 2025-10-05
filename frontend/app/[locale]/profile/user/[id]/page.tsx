"use client"

import { useParams } from "next/navigation"
import LocationSection from "@/components/marketplace/location-section"
import ReviewsSection from "@/components/marketplace/reviews-section"
import AdsGrid from "@/components/profile/ads-grid"
import UserSidebar from "@/components/profile/user-sidebar"

// Mock data - in real app, this would come from API based on the ID
const getUserData = (id: string) => ({
  id,
  name: "Mohammad Mohid",
  memberSince: "14 August, 2025",
  activeAds: 10,
  phone: "+965 2222 3333",
  address: "Gulf Road, Kuwait City, Kuwait",
  coordinates: { lat: 29.3759, lng: 47.9774 },
})

export default function UserProfilePage() {
  const params = useParams()
  const user = getUserData(params.id as string)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6 order-last lg:order-none">
            <AdsGrid business={user} /> {/* Reusing AdsGrid with user data */}
          </div>
          <div className="lg:col-span-1 order-first lg:order-none">
            <UserSidebar user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}