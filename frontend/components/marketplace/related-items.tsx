"use client"
import { useState, useRef, useEffect } from "react"
import { MarketplaceProductCard } from "./marketplace-product-card"
import { MarketplaceServiceCard } from "./marketplace-service-card"
import { Button } from "@/components/common/button"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Unified interface to support both Product and Service card props
interface RelatedOffer {
  id: string
  name: string
  business?: string
  category?: string
  subcategory?: string
  image: string
  discount?: string | number
  originalPrice?: number
  salePrice?: number
  startingPrice?: number
  rating: number
  description: string
  badge?: "sponsored" | "brand_new" | null
  condition?: string
  inStock?: boolean
  location?: string
}

interface RelatedOffersProps {
  isProduct: boolean // Prop to determine card type
}

export default function RelatedOffers({ isProduct }: RelatedOffersProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isScrollable, setIsScrollable] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Dummy data for 4 products
  const productOffers: RelatedOffer[] = [
    {
      id: "1",
      name: "Wireless Headphones",
      business: "TechTrend",
      image: "/placeholder.svg?height=200&width=300",
      discount: "20% OFF",
      originalPrice: 100,
      salePrice: 80,
      rating: 4.5,
      description: "High-quality wireless headphones with noise cancellation.",
      badge: "sponsored",
      condition: "New",
      inStock: true,
      location: "Kuwait City",
    },
    {
      id: "2",
      name: "Smartphone X",
      business: "Mobile Innovations",
      image: "/placeholder.svg?height=200&width=300",
      discount: "15% OFF",
      originalPrice: 300,
      salePrice: 255,
      rating: 4.8,
      description: "Latest smartphone with advanced camera features.",
      badge: "brand_new",
      condition: "New",
      inStock: true,
      location: "Dubai",
    },
    {
      id: "3",
      name: "Laptop Pro",
      business: "TechCorp",
      image: "/placeholder.svg?height=200&width=300",
      discount: "10% OFF",
      originalPrice: 1200,
      salePrice: 1080,
      rating: 4.3,
      description: "Powerful laptop for professional and gaming use.",
      badge: null,
      condition: "New",
      inStock: false,
      location: "Riyadh",
    },
    {
      id: "4",
      name: "Smart Watch",
      business: "WearableTech",
      image: "/placeholder.svg?height=200&width=300",
      discount: "25% OFF",
      originalPrice: 200,
      salePrice: 150,
      rating: 4.6,
      description: "Fitness tracking smartwatch with heart rate monitor.",
      badge: "sponsored",
      condition: "New",
      inStock: true,
      location: "Doha",
    },
    {
      id: "11",
      name: "Smart Watch",
      business: "WearableTech",
      image: "/placeholder.svg?height=200&width=300",
      discount: "25% OFF",
      originalPrice: 200,
      salePrice: 150,
      rating: 4.6,
      description: "Fitness tracking smartwatch with heart rate monitor.",
      badge: "sponsored",
      condition: "New",
      inStock: true,
      location: "Doha",
    },
  ]

  // Dummy data for 4 services
  const serviceOffers: RelatedOffer[] = [
    {
      id: "5",
      name: "Home Cleaning Service",
      business: "Clean Sweep",
      category: "Home Services",
      subcategory: "Cleaning",
      image: "/placeholder.svg?height=200&width=300",
      startingPrice: 50,
      rating: 4.7,
      description: "Professional home cleaning for apartments and villas.",
      badge: "sponsored",
      location: "Kuwait City",
    },
    {
      id: "6",
      name: "Car Repair",
      business: "AutoFix",
      category: "Automotive",
      subcategory: "Repair",
      image: "/placeholder.svg?height=200&width=300",
      startingPrice: 75,
      rating: 4.4,
      description: "Expert car repair and maintenance services.",
      badge: null,
      location: "Dubai",
    },
    {
      id: "7",
      name: "Personal Training",
      business: "FitLife",
      category: "Fitness",
      subcategory: "Training",
      image: "/placeholder.svg?height=200&width=300",
      startingPrice: 60,
      rating: 4.9,
      description: "Customized fitness training sessions with certified trainers.",
      badge: "sponsored",
      location: "Riyadh",
    },
    {
      id: "8",
      name: "Plumbing Service",
      business: "PipePros",
      category: "Home Services",
      subcategory: "Plumbing",
      image: "/placeholder.svg?height=200&width=300",
      startingPrice: 45,
      rating: 4.2,
      description: "Reliable plumbing solutions for leaks and installations.",
      badge: null,
      location: "Doha",
    },
    {
      id: "9",
      name: "Plumbing Service",
      business: "PipePros",
      category: "Home Services",
      subcategory: "Plumbing",
      image: "/placeholder.svg?height=200&width=300",
      startingPrice: 45,
      rating: 4.2,
      description: "Reliable plumbing solutions for leaks and installations.",
      badge: null,
      location: "Doha",
    },
  ]

  // Select offers based on isProduct prop
  const offers = isProduct ? productOffers : serviceOffers

  const checkScrollable = () => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current
      setIsScrollable(scrollWidth > clientWidth)
    }
  }

  useEffect(() => {
    checkScrollable()
    window.addEventListener('resize', checkScrollable)
    return () => window.removeEventListener('resize', checkScrollable)
  }, [offers])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0].getBoundingClientRect().width
      const gap = parseFloat(getComputedStyle(scrollContainerRef.current).gap) || 16
      const scrollAmount = cardWidth + gap
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      setCurrentIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0].getBoundingClientRect().width
      const gap = parseFloat(getComputedStyle(scrollContainerRef.current).gap) || 16
      const scrollAmount = cardWidth + gap
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      setCurrentIndex((prev) => Math.min(prev + 1, offers.length - 1))
    }
  }

  return (
    <Card className="rounded-2xl lg:rounded-3xl border-none">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">You Might Also Like</h3>
          <Button
            variant="ghost"
            className="text-primary hover:text-secondary rounded-xl lg:rounded-2xl text-sm lg:text-base"
          >
            View More
          </Button>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex flex-row gap-2 lg:gap-4 overflow-x-auto max-w-7xl mx-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {offers.map((relatedOffer) => (
              <div
                key={relatedOffer.id}
                className="w-[280px] h-[480px] sm:w-[260px] sm:h-[440px] md:w-[240px] md:h-[420px] lg:w-[280px] lg:h-[480px] rounded-lg flex flex-col flex-shrink-0 snap-center"
              >
                {isProduct ? (
                  <MarketplaceProductCard
                    id={relatedOffer.id}
                    name={relatedOffer.name}
                    brand={relatedOffer.business || "Unknown"}
                    image={relatedOffer.image}
                    rating={relatedOffer.rating}
                    price={relatedOffer.salePrice || 0}
                    originalPrice={relatedOffer.originalPrice}
                    discount={typeof relatedOffer.discount === "string" ? parseInt(relatedOffer.discount) : relatedOffer.discount}
                    description={relatedOffer.description}
                    badge={relatedOffer.badge}
                    condition={relatedOffer.condition || "New"}
                    seller={relatedOffer.business || "Unknown"}
                    inStock={relatedOffer.inStock !== undefined ? relatedOffer.inStock : true}
                    location={relatedOffer.location}
                  />
                ) : (
                  <MarketplaceServiceCard
                    id={relatedOffer.id}
                    name={relatedOffer.name}
                    category={relatedOffer.category || "General"}
                    subcategory={relatedOffer.subcategory || "Other"}
                    image={relatedOffer.image}
                    rating={relatedOffer.rating}
                    startingPrice={relatedOffer.startingPrice || relatedOffer.salePrice || 0}
                    description={relatedOffer.description}
                    badge={relatedOffer.badge === "brand_new" ? "sponsored" : relatedOffer.badge}
                    seller={relatedOffer.business || "Unknown"}
                    location={relatedOffer.location}
                  />
                )}
              </div>
            ))}
          </div>

          {isScrollable && (
            <>
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 md:pl-4">
                <Button
                  variant="ghost"
                  className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md border border-primary disabled:opacity-50 w-10 h-10 md:w-12 md:h-12"
                  onClick={scrollLeft}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </Button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:pr-4">
                <Button
                  variant="ghost"
                  className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md border border-primary disabled:opacity-50 w-10 h-10 md:w-12 md:h-12"
                  onClick={scrollRight}
                  disabled={currentIndex >= offers.length - 1}
                >
                  <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}