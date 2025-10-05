"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Button } from "@/components/common/button"

interface TestimonialItem {
  name: string
  business: string
  category: string
  quote: string
  results: string
}

export default function TestimonialsCarousel({ locale }: { locale: string }) {
  const t = useTranslations("ForBusinesses")

  const getTestimonials = (): TestimonialItem[] => {
    try {
      const testimonials = t.raw("testimonials.items")
      if (Array.isArray(testimonials)) {
        return testimonials as TestimonialItem[]
      }
      return []
    } catch (error) {
      console.warn("Missing testimonials data, using fallback")
      return [
        {
          name: "Sarah Johnson",
          business: "Johnson's Bakery",
          category: "Food & Beverage",
          quote: "Our sales increased by 40% within the first month of using these ads. The targeting is incredibly effective!",
          results: "40% increase in sales"
        },
        {
          name: "Mike Chen",
          business: "Tech Repair Pro",
          category: "Technology",
          quote: "The analytics dashboard helped us understand our customers better. We've doubled our customer base!",
          results: "200% customer growth"
        },
        {
          name: "Emily Rodriguez",
          business: "Fitness First Gym",
          category: "Health & Fitness",
          quote: "Event promotions brought in 150 new members in just two weeks. Amazing results!",
          results: "150 new members"
        }
      ]
    }
  }

  const testimonials = getTestimonials()

  // state
  const [index, setIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [paused, setPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [translateX, setTranslateX] = useState(0)
  const [cardWidth, setCardWidth] = useState(520)
  const [gap, setGap] = useState(24)
  const isRTL = locale === "ar"

  // Touch swipe detection
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setPaused(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (touchStart == null || touchEnd == null) {
      setPaused(false)
      return
    }
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && !isAnimating) {
      isRTL ? goPrev() : goNext()
    }
    if (isRightSwipe && !isAnimating) {
      isRTL ? goNext() : goPrev()
    }

    setPaused(false)
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight px-2">
                {t("testimonials.title") || "What Our Clients Say"}
              </h2>
              <p className="text-lg sm:text-xl text-white/90 px-2">
                Loading testimonials...
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // autoplay with pause on hover/focus - slower on mobile
  useEffect(() => {
    if (paused || testimonials.length <= 1) return
    const isMobile = window.innerWidth < 768
    const interval = isMobile ? 6000 : 5000
    const id = window.setInterval(() => setIndex((s) => (s + 1) % testimonials.length), interval)
    return () => window.clearInterval(id)
  }, [paused, testimonials.length])

  // measure and compute translate - improved mobile responsiveness
  const computePosition = useCallback(() => {
    const container = containerRef.current
    if (!container || testimonials.length === 0) return

    const containerWidth = container.clientWidth

    // Proportions by width
    let cardProportion = 0.52
    if (containerWidth < 480) cardProportion = 0.95
    else if (containerWidth < 640) cardProportion = 0.92
    else if (containerWidth < 768) cardProportion = 0.85
    else if (containerWidth < 1024) cardProportion = 0.68

    const computedGap = containerWidth < 640 ? 16 : 24
    const computedCardWidth = Math.round(containerWidth * cardProportion)

    // offset to center card
    const offset = Math.round(containerWidth / 2 - computedCardWidth / 2)

    // base translate (use gap so spacing matches the visual gap)
    const base = -(index * (computedCardWidth + computedGap)) + offset

    // set measured values to state so render uses the same math
    setCardWidth(computedCardWidth)
    setGap(computedGap)
    setTranslateX(base)
  }, [index, testimonials.length])

  useEffect(() => {
    computePosition()
  }, [index, computePosition])

  useEffect(() => {
    let timeoutId: number | undefined
    const onResize = () => {
      if (timeoutId) window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(computePosition, 100)
    }
    window.addEventListener("resize", onResize)
    // initial
    computePosition()
    return () => {
      window.removeEventListener("resize", onResize)
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [computePosition])

  // navigation
  const goNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setIndex((s) => (s + 1) % testimonials.length)
    window.setTimeout(() => setIsAnimating(false), 650)
  }
  const goPrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setIndex((s) => (s - 1 + testimonials.length) % testimonials.length)
    window.setTimeout(() => setIsAnimating(false), 650)
  }
  const goTo = (i: number) => {
    if (isAnimating || i === index) return
    setIsAnimating(true)
    setIndex(i)
    window.setTimeout(() => setIsAnimating(false), 650)
  }

  // keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") (isRTL ? goNext : goPrev)()
      if (e.key === "ArrowRight") (isRTL ? goPrev : goNext)()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isRTL, isAnimating, testimonials.length])

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-primary to-secondary">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 tracking-tight px-2 leading-tight">
              {t("testimonials.title") || "What Our Clients Say"}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-2">
              {t("testimonials.subtitle") || "Real success stories from businesses like yours"}
            </p>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              ref={containerRef}
              className="relative h-[450px] xs:h-[480px] sm:h-[500px] md:h-[480px] lg:h-[520px] overflow-hidden"
              aria-roledescription="carousel"
              aria-label={t("testimonials.title") || "Client testimonials"}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-12 md:w-24 lg:w-36 bg-gradient-to-r from-primary to-transparent z-30"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-12 md:w-24 lg:w-36 bg-gradient-to-l from-secondary to-transparent z-30"></div>

              {/* track - we use inline gap so spacing matches computePosition */}
              <div
                className={`absolute left-0 top-0 flex items-center h-full transition-transform duration-700 ease-in-out z-20`}
                style={{ transform: `translateX(${translateX}px)`, gap: `${gap}px` }}
              >
                {testimonials.map((titem, i) => {
                  const isCenter = i === index

                  return (
                    <div
                      key={`testimonial-${i}`}
                      className="flex-shrink-0"
                      style={{
                        width: cardWidth,
                        boxSizing: "border-box",
                        transition: "transform 700ms ease, opacity 700ms ease",
                      }}
                    >
                      <div
                        className={`relative transform transition-transform duration-700 ease-in-out ${
                          isCenter ? "scale-100 z-30" : "scale-90 sm:scale-95 z-10 opacity-50 sm:opacity-60"
                        }`}
                        aria-hidden={!isCenter}
                      >
                        <Card className="rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl bg-white border-gray-200 h-full relative">
                          <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10 h-full flex flex-col justify-center">
                            <div className="text-center">
                              <div className="flex justify-center mb-4 sm:mb-6">
                                <div className="relative">
                                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-2 sm:border-4 border-yellow-400 shadow-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm sm:text-lg md:text-2xl">
                                      {titem?.name?.[0] || "?"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-center mb-4 sm:mb-6">
                                {[...Array(5)].map((_, s) => (
                                  <Star key={s} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 fill-current mx-0.5" />
                                ))}
                              </div>

                              <blockquote
                                className={`text-gray-700 mb-4 sm:mb-6 leading-relaxed font-medium italic ${
                                  isCenter ? "text-sm sm:text-base md:text-lg lg:text-xl" : "text-xs sm:text-sm md:text-base lg:text-lg"
                                }`}
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: window.innerWidth < 480 ? 4 : "unset",
                                  WebkitBoxOrient: "vertical",
                                  overflow: window.innerWidth < 480 ? "hidden" : "visible"
                                }}
                              >
                                "{titem?.quote || "Great service and excellent results!"}"
                              </blockquote>

                              <div
                                className={`bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold mb-3 sm:mb-4 ${
                                  isCenter ? "text-sm sm:text-base md:text-lg" : "text-xs sm:text-sm md:text-base"
                                }`}
                              >
                                {titem?.results || "Outstanding Results"}
                              </div>

                              <div className="text-gray-800">
                                <div className={`font-semibold mb-1 ${isCenter ? "text-sm sm:text-base md:text-lg" : "text-xs sm:text-sm md:text-base"}`}>
                                  {titem?.name || "Anonymous"}
                                </div>
                                <div className={`text-gray-600 font-medium mb-1 ${isCenter ? "text-xs sm:text-sm md:text-base" : "text-xs sm:text-xs md:text-sm"}`}>
                                  {titem?.business || "Local Business"}
                                </div>
                                <div className={`text-gray-500 uppercase tracking-wide ${isCenter ? "text-xs sm:text-xs md:text-sm" : "text-xs sm:text-xs"}`}>
                                  {titem?.category || "Business"}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Navigation and dots */}
            <div className="flex flex-col sm:flex-row justify-center items-center mt-6 sm:mt-8 md:mt-10 space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Navigation buttons - hidden on large screens (lg and up) */}
              <div className="flex items-center space-x-3 lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goPrev}
                  disabled={isAnimating}
                  className="rounded-full bg-white/20 border-white/30 text-white hover:bg-white hover:text-purple-600 transition-all duration-300 shadow-lg backdrop-blur-sm disabled:opacity-50 w-10 h-10 sm:w-12 sm:h-12 p-0"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goNext}
                  disabled={isAnimating}
                  className="rounded-full bg-white/20 border-white/30 text-white hover:bg-white hover:text-purple-600 transition-all duration-300 shadow-lg backdrop-blur-sm disabled:opacity-50 w-10 h-10 sm:w-12 sm:h-12 p-0"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>

              {/* Dot indicators */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    disabled={isAnimating}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 disabled:opacity-50 ${
                      i === index ? "bg-white shadow-lg scale-125" : "bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="block sm:hidden text-center mt-4">
              <p className="text-white/60 text-xs">
                Swipe left or right to browse testimonials
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
