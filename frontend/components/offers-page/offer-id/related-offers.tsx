"use client"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/common/button"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Badge } from "@/components/common/badge"

interface RelatedOffer {
  id: number
  business: string
  title: string
  image: string
  discount: string
  originalPrice: number
  salePrice: number
  rating: number
}

interface RelatedOffersProps {
  offers: RelatedOffer[]
}

export default function RelatedOffers({ offers }: RelatedOffersProps) {
  return (
    <Card className="rounded-2xl lg:rounded-3xl border-0">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 space-y-2 sm:space-y-0">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">You Might Also Like</h3>
          <Button 
            variant="ghost" 
            className="text-purple-600 hover:text-purple-700 rounded-xl lg:rounded-2xl text-sm lg:text-base self-start sm:self-auto"
          >
            View More Similar Offers
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {offers.map((relatedOffer) => (
            <Link key={relatedOffer.id} href={`/offers/${relatedOffer.id}`}>
              <Card className="rounded-xl lg:rounded-2xl hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer h-full">
                <div className="relative">
                  <Image
                    src={relatedOffer.image}
                    alt={relatedOffer.title}
                    width={200}
                    height={120}
                    className="w-full h-28 sm:h-32 lg:h-40 object-cover rounded-t-xl lg:rounded-t-2xl"
                  />
                  <Badge className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-purple-600 text-white rounded-full px-2 lg:px-3 py-0.5 lg:py-1 text-xs lg:text-sm">
                    {relatedOffer.discount}
                  </Badge>
                </div>
                
                <CardContent className="p-3 lg:p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm lg:text-base line-clamp-1">
                      {relatedOffer.business}
                    </h4>
                    <p className="text-gray-600 text-xs lg:text-sm mb-2 lg:mb-3 line-clamp-2 leading-relaxed">
                      {relatedOffer.title}
                    </p>
                  </div>
                  
                  <div className="space-y-2 lg:space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <span className="text-gray-400 line-through text-xs lg:text-sm">
                          {relatedOffer.originalPrice} KD
                        </span>
                        <span className="text-purple-600 font-bold text-sm lg:text-base">
                          {relatedOffer.salePrice} KD
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                        <span className="text-xs lg:text-sm font-medium">{relatedOffer.rating}</span>
                      </div>
                    </div>
                    
                    <Button 
                    variant="primary"
                    className="w-full">
                      View Offer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}