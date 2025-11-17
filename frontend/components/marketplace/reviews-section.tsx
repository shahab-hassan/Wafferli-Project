// components/offer-detail/ReviewsSection.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ThumbsUp, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/common/button";
import { Card, CardContent } from "@/components/common/shadecn-card";
import { Badge } from "@/components/common/badge";
import { TextField } from "@/components/common/text-field";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateReview,
  GetAdReviews,
  LoadMoreReviews,
  ToggleReviewLike,
} from "@/features/slicer/AdSlice";
import toast from "react-hot-toast";

interface ReviewsSectionProps {
  adId: string;
}

export default function ReviewsSection({ adId }: ReviewsSectionProps) {
  const dispatch = useDispatch();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userName, setUserName] = useState("");
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  const { allAdReviews, hasMore, isLoading, currentPage } = useSelector(
    (state: any) => state.ad
  );
  // Get reviews from Redux store
  const handleLoadMore = () => {
    const nextPage = (currentPage || 1) + 1; // Current page se next page calculate karo
    dispatch(LoadMoreReviews({ adId, page: nextPage }) as any);
  };

  console.log(allAdReviews, "allAdReviews");

  useEffect(() => {
    if (!adId) return;
    dispatch(GetAdReviews({ adId, page: 1 }) as any);
  }, [adId, dispatch]);

  // Calculate average rating and review count from actual data
  const calculateRatingStats = () => {
    if (!allAdReviews || allAdReviews.length === 0) {
      return { averageRating: 0, totalReviews: 0, ratingDistribution: [] };
    }

    const totalRating = allAdReviews.reduce(
      (sum: number, review: any) => sum + review.rating,
      0
    );
    const averageRating = totalRating / allAdReviews.length;

    // Calculate rating distribution
    const distribution = [5, 4, 3, 2, 1].map((stars) => {
      const count = allAdReviews.filter(
        (review: any) => Math.round(review.rating) === stars
      ).length;
      const percentage = (count / allAdReviews.length) * 100;
      return { stars, count, percentage };
    });

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: allAdReviews.length,
      ratingDistribution: distribution,
    };
  };

  const { averageRating, totalReviews, ratingDistribution } =
    calculateRatingStats();

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleStarHover = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    if (!selectedRating || !reviewText.trim()) {
      toast.error("Please provide both rating and review text");
      return;
    }

    const reviewData = {
      adId,
      rating: selectedRating,
      reviewText: reviewText.trim(),
      userName: userName.trim() || "",
    };

    dispatch(CreateReview(reviewData) as any)
      .unwrap()
      .then(() => {
        setReviewText("");
        setUserName("");
        setSelectedRating(0);
        setShowReviewForm(false);
        // Refresh reviews
        dispatch(GetAdReviews({ adId, page: 1 }) as any);
      })
      .catch((error: any) => {
        console.error("Failed to submit review:", error);
      });
  };

  const handleLikeReview = (reviewId: string) => {
    dispatch(ToggleReviewLike(reviewId) as any)
      .unwrap()
      .then(() => {
        // Refresh reviews to get updated likes
        dispatch(GetAdReviews({ adId, page: 1 }) as any);
      })
      .catch((error: any) => {
        console.error("Failed to like review:", error);
      });
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="rounded-2xl lg:rounded-2xl">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Customer Reviews
          </h3>
          <Button
            variant="primary"
            onClick={() => setShowReviewForm(!showReviewForm)}
            className=""
          >
            Write a Review
          </Button>
        </div>

        {/* Overall Rating */}
        <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="text-center sm:text-left">
              <div className="text-3xl lg:text-4xl font-bold text-primary">
                {averageRating || 0}
              </div>
              <div className="flex justify-center sm:justify-start mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 lg:w-4 lg:h-4 ${
                      i < Math.floor(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs lg:text-sm text-gray-600">
                {totalReviews || 0} reviews
              </div>
            </div>

            <div className="flex-1 w-full">
              {ratingDistribution.length > 0
                ? ratingDistribution.map((item) => (
                    <div
                      key={item.stars}
                      className="flex items-center space-x-2 mb-1"
                    >
                      <span className="text-xs lg:text-sm w-2">
                        {item.stars}
                      </span>
                      <Star className="w-2 h-2 lg:w-3 lg:h-3 text-yellow-400 fill-current" />
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 lg:h-2">
                        <div
                          className="bg-yellow-400 h-1.5 lg:h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs lg:text-sm text-gray-600 w-8 lg:w-10">
                        {Math.round(item.percentage)}%
                      </span>
                    </div>
                  ))
                : // Static distribution when no reviews
                  [5, 4, 3, 2, 1].map((stars) => (
                    <div
                      key={stars}
                      className="flex items-center space-x-2 mb-1"
                    >
                      <span className="text-xs lg:text-sm w-2">{stars}</span>
                      <Star className="w-2 h-2 lg:w-3 lg:h-3 text-yellow-400 fill-current" />
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 lg:h-2">
                        <div
                          className="bg-yellow-400 h-1.5 lg:h-2 rounded-full transition-all duration-300"
                          style={{ width: "0%" }}
                        />
                      </div>
                      <span className="text-xs lg:text-sm text-gray-600 w-8 lg:w-10">
                        0%
                      </span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-purple-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6">
            <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">
              Write Your Review
            </h4>
            <div className="space-y-3 lg:space-y-4">
              <div>
                <label className="block text-xs lg:text-sm font-medium mb-2">
                  Your Name (Optional)
                </label>
                <TextField
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="rounded-xl lg:rounded-2xl border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-sm lg:text-base"
                />
              </div>
              <div>
                <label className="block text-xs lg:text-sm font-medium mb-2">
                  Rating *
                </label>
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
                <label className="block text-xs lg:text-sm font-medium mb-2">
                  Your Review *
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full rounded-xl lg:rounded-2xl border border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-sm lg:text-base p-3 min-h-[100px] resize-none"
                  rows={4}
                />
              </div>
              <div className="flex space-x-2 lg:space-x-3">
                <Button
                  onClick={handleSubmitReview}
                  className="bg-secondary rounded-xl lg:rounded-2xl text-sm lg:text-base px-3 lg:px-4 py-2"
                  disabled={!selectedRating || !reviewText.trim()}
                >
                  Submit Review
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewText("");
                    setUserName("");
                    setSelectedRating(0);
                  }}
                  className="rounded-xl lg:rounded-2xl text-sm lg:text-base px-3 lg:px-4 py-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Individual Reviews */}
        <div className="space-y-3 lg:space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {allAdReviews && allAdReviews.length > 0 ? (
            allAdReviews.map((review: any) => (
              <Card key={review._id} className="rounded-xl lg:rounded-2xl">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start space-x-3 lg:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {review.userAvatar ? (
                        <Image
                          src={review.userAvatar}
                          alt={review.userName || "User"}
                          width={48}
                          height={48}
                          className="rounded-full w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {(review.userName || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-semibold text-sm lg:text-base truncate">
                            {review.userName || "Anonymous User"}
                          </h5>
                        </div>
                        <span className="text-xs lg:text-sm text-gray-500 flex-shrink-0">
                          {review.createdAt
                            ? formatDate(review.createdAt)
                            : "Recently"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mb-2 lg:mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 lg:w-4 lg:h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-2 lg:mb-3 text-sm lg:text-base leading-relaxed">
                        {review.reviewText || "No review text provided"}
                      </p>

                      <div className="flex items-center space-x-4">
                        <button
                          className="flex items-center space-x-1 text-gray-500 hover:text-secondary transition-colors"
                          onClick={() => handleLikeReview(review._id)}
                        >
                          <ThumbsUp className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="text-xs lg:text-sm">
                            Helpful (
                            {(review.likes && review.likes.length) || 0})
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm lg:text-base">
                No reviews yet. Be the first to review!
              </p>
            </div>
          )}
        </div>
        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-4 lg:mt-6">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              className="rounded-xl lg:rounded-2xl text-sm lg:text-base px-4 lg:px-6 py-2 bg-transparent"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More Reviews"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
