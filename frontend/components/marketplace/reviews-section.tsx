// components/offer-detail/ReviewsSection.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ThumbsUp, Check } from "lucide-react"
import { Button } from "@/components/common/button"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Badge } from "@/components/common/badge"
import { TextField } from "@/components/common/text-field"

interface Review {
  id: number
  name: string
  avatar: string
  rating: number
  date: string
  comment: string
  verified: boolean
  helpful: number
}

interface ReviewsSectionProps {
  reviews: Review[]
  offer: {
    rating: number
    reviewCount: number
  }
}

export default function ReviewsSection({ reviews, offer }: ReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const ratingDistribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ]

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating)
  }

  const handleStarHover = (rating: number) => {
    setHoveredRating(rating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  return (
    <Card className="rounded-2xl lg:rounded-2xl">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Customer Reviews</h3>
          <Button variant="primary" onClick={() => setShowReviewForm(!showReviewForm)} className="">
            Write a Review
          </Button>
        </div>

        {/* Overall Rating */}
        <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="text-center sm:text-left">
              <div className="text-3xl lg:text-4xl font-bold text-primary">{offer.rating}</div>
              <div className="flex justify-center sm:justify-start mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 lg:w-4 lg:h-4 ${
                      i < Math.floor(offer.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs lg:text-sm text-gray-600">{offer.reviewCount} reviews</div>
            </div>

            <div className="flex-1 w-full">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center space-x-2 mb-1">
                  <span className="text-xs lg:text-sm w-2">{item.stars}</span>
                  <Star className="w-2 h-2 lg:w-3 lg:h-3 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 lg:h-2">
                    <div
                      className="bg-yellow-400 h-1.5 lg:h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs lg:text-sm text-gray-600 w-8 lg:w-10">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-purple-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6">
            <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Write Your Review</h4>
            <div className="space-y-3 lg:space-y-4">
              <div>
                <label className="block text-xs lg:text-sm font-medium mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="p-1"
                      onClick={() => handleStarClick(rating)}
                      onMouseEnter={() => handleStarHover(rating)}
                      onMouseLeave={handleStarLeave}
                    >
                      <Star
                        className={`w-5 h-5 lg:w-6 lg:h-6 transition-colors ${
                          rating <= (hoveredRating || selectedRating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs lg:text-sm font-medium mb-2">Your Review</label>
                <TextField
                  placeholder="Share your experience..."
                  className="rounded-xl lg:rounded-2xl border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-sm lg:text-base"
                />
              </div>
              <div className="flex space-x-2 lg:space-x-3">
                <Button className="bg-secondary rounded-xl lg:rounded-2xl text-sm lg:text-base px-3 lg:px-4 py-2">
                  Submit Review
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                  className="rounded-xl lg:rounded-2xl text-sm lg:text-base px-3 lg:px-4 py-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Individual Reviews */}
        <div className="space-y-3 lg:space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="rounded-xl lg:rounded-2xl">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start space-x-3 lg:space-x-4">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={40}
                    height={40}
                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-semibold text-sm lg:text-base truncate">{review.name}</h5>
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-700 rounded-full px-1.5 lg:px-2 py-0 text-xs">
                            <Check className="w-2 h-2 lg:w-3 lg:h-3 mr-0.5 lg:mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs lg:text-sm text-gray-500 flex-shrink-0">{review.date}</span>
                    </div>

                    <div className="flex items-center space-x-2 mb-2 lg:mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 lg:w-4 lg:h-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-2 lg:mb-3 text-sm lg:text-base leading-relaxed">{review.comment}</p>

                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-secondary transition-colors">
                        <ThumbsUp className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="text-xs lg:text-sm">Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {reviews.length > 0 && (
          <div className="text-center mt-4 lg:mt-6">
            <Button
              variant="outline"
              className="rounded-xl lg:rounded-2xl text-sm lg:text-base px-4 lg:px-6 py-2 bg-transparent"
            >
              Load More Reviews
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
