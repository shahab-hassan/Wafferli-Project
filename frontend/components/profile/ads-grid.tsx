"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import MarketplaceCompactProductCard from "../profile/compact-product-card"
import MarketplaceCompactServiceCard from "../profile/compact-service-card"

const mockAds = [
  { type: "product", id: "1", rating: 4.6, badges: ["Product", "Apple", "Brand New"], title: "iPhone 15 Pro Max", desc: "256GB, Titanium Blue, Unlocked", stock: "In Stock", price: 450, originalPrice: 520 },
  { type: "service", id: "2", rating: 4.6, badges: ["Service", "Home & Personal Services"], title: "AC Repair & Maintenance", desc: "24/7 emergency AC repair service" },
  { type: "product", id: "3", rating: 4.5, badges: ["Product", "Apple", "Brand New"], title: "MacBook Pro 16\"", desc: "M3 Pro, 18GB RAM, 512GB SSD", stock: "In Stock", price: 1200, originalPrice: 1350 },
  { type: "product", id: "4", rating: 4.6, badges: ["Product", "Apple", "Brand New"], title: "iPhone 15 Pro Max", desc: "256GB, Titanium Blue, Unlocked", stock: "In Stock", price: 450, originalPrice: 520 },
  { type: "service", id: "5", rating: 4.6, badges: ["Service", "Home & Personal Services"], title: "AC Repair & Maintenance", desc: "24/7 emergency AC repair service" },
  { type: "product", id: "6", rating: 4.5, badges: ["Product", "Apple", "Brand New"], title: "MacBook Pro 16\"", desc: "M3 Pro, 18GB RAM, 512GB SSD", stock: "In Stock", price: 1200, originalPrice: 1350 },
  { type: "product", id: "7", rating: 4.6, badges: ["Product", "Apple", "Brand New"], title: "iPhone 15 Pro Max", desc: "256GB, Titanium Blue, Unlocked", stock: "In Stock", price: 450, originalPrice: 520 },
  { type: "service", id: "8", rating: 4.6, badges: ["Service", "Home & Personal Services"], title: "AC Repair & Maintenance", desc: "24/7 emergency AC repair service" },
  { type: "product", id: "9", rating: 4.5, badges: ["Product", "Apple", "Brand New"], title: "MacBook Pro 16\"", desc: "M3 Pro, 18GB RAM, 512GB SSD", stock: "In Stock", price: 1200, originalPrice: 1350 },
  { type: "product", id: "10", rating: 4.5, badges: ["Product", "Apple", "Brand New"], title: "MacBook Pro 16\"", desc: "M3 Pro, 18GB RAM, 512GB SSD", stock: "In Stock", price: 1200, originalPrice: 1350 },
  { type: "service", id: "11", rating: 4.6, badges: ["Service", "Home & Personal Services"], title: "AC Repair & Maintenance", desc: "24/7 emergency AC repair service" },
  { type: "product", id: "12", rating: 4.5, badges: ["Product", "Apple", "Brand New"], title: "MacBook Pro 16\"", desc: "M3 Pro, 18GB RAM, 512GB SSD", stock: "In Stock", price: 1200, originalPrice: 1350 },
]

interface AdsGridProps {
  business: any
}

export default function AdsGrid({ business }: AdsGridProps) {
  const t = useTranslations('profile')
  const [currentPage, setCurrentPage] = useState(1)
  const adsPerPage = 9
  const totalPages = Math.ceil(mockAds.length / adsPerPage)
  const showingFrom = (currentPage - 1) * adsPerPage + 1
  const showingTo = Math.min(currentPage * adsPerPage, mockAds.length)
  const currentAds = mockAds.slice((currentPage - 1) * adsPerPage, currentPage * adsPerPage)

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-4 text-sm gap-2">
        <div className="flex items-center">
          <select className="bg-primary/10 text-primary rounded-full px-3 py-1 mr-2">
            <option>{t("ads")}</option>
            <option>{t("all")}</option>
          </select>
          <span className="text-muted-foreground">({t("showingResults", { count: `${showingFrom}-${showingTo}` })})</span>
        </div>
        <div className="flex items-center">
          <select className="bg-background border border-border rounded-full px-3 py-1 mr-2">
            <option>{t("newestFirst")}</option>
          </select>
        
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentAds.map((ad) => (
          ad.type === "product" ? (
            <MarketplaceCompactProductCard key={ad.id} {...ad} />
          ) : (
            <MarketplaceCompactServiceCard key={ad.id} {...ad} />
          )
        ))}
      </div>
      <div className="mt-6 flex justify-center items-center space-x-2 text-sm">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="text-primary disabled:text-muted-foreground"
        >
          &lt;
        </button>
        <button 
          className={`${currentPage === 1 ? 'bg-primary text-white' : 'bg-background border border-border'} px-3 py-1 rounded`}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
        <span className="text-muted-foreground">...</span>
        <button 
          className={`${currentPage === 2 ? 'bg-primary text-white' : 'bg-background border border-border'} px-3 py-1 rounded`}
          onClick={() => setCurrentPage(2)}
        >
          2
        </button>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="text-primary disabled:text-muted-foreground"
        >
          &gt;
        </button>
      </div>
    </div>
  )
}