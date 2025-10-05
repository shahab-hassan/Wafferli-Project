"use client"
import { useState, useEffect, useRef } from "react"
import { ChevronRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/common/button"
import { FlashCard, FlashCardProps } from "@/components/cards/flash-card"
import { useTranslations } from "next-intl"
import Link from "next/link"

export interface FlashDealsSliderProps {
  deals: FlashCardProps[]
  autoSlideInterval?: number
  globalTimer?: {
    hours: number
    minutes: number
    seconds: number
  }
  className?: string
}

export function FlashDealsSlider({
  deals,
  autoSlideInterval = 5000,
  globalTimer = { hours: 11, minutes: 59, seconds: 59 },
  className,
}: FlashDealsSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(globalTimer)
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const sliderRef = useRef<HTMLDivElement>(null)

  // Check screen size and determine layout
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setScreenSize('mobile')
      } else if (width < 1024) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Determine items per slide based on screen size
  const getItemsPerSlide = () => {
    switch (screenSize) {
      case 'mobile':
        return 1
      case 'tablet':
        return 2
      case 'desktop':
        return 3
      default:
        return 3
    }
  }

  const itemsPerSlide = getItemsPerSlide()
  const totalSlides = Math.ceil(deals.length / itemsPerSlide)
  const canSlide = totalSlides > 1

  // Detect RTL from document
  const isRTL = typeof document !== "undefined"
    ? document?.documentElement?.dir === "rtl"
    : false

  // Global timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          clearInterval(timer)
          return { hours: 0, minutes: 0, seconds: 0 }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Auto slide functionality
  useEffect(() => {
    if (!canSlide || isPaused) return

    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, autoSlideInterval)

    return () => clearInterval(slideTimer)
  }, [canSlide, isPaused, autoSlideInterval, totalSlides])

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex)
  }

  const formatTime = (time: number) => time.toString().padStart(2, '0')
  const t = useTranslations("FlashDeals")

  // Get grid columns class based on screen size
  const getGridCols = () => {
    switch (screenSize) {
      case 'mobile':
        return 'grid-cols-1'
      case 'tablet':
        return 'grid-cols-2'
      case 'desktop':
        return 'grid-cols-3'
      default:
        return 'grid-cols-3'
    }
  }

  return (
    <div className={cn("w-full relative overflow-hidden", className)}>
      {/* Background Container */}
      <div className="absolute inset-0 w-full h-full">
        {/* Background Image - Responsive max widths */}
        <div className="relative w-full h-full max-w-[1440px] mx-auto">
          {/* Left Yellow Blob - Responsive sizing */}
          <div className="absolute left-0 top-0 w-[40%] sm:w-[50%] md:w-[46%] max-w-[665px] h-[35%] sm:h-[40%] max-h-[282px]">
            <svg
              viewBox="0 0 665 282"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 282C0 244.967 8.60156 208.297 25.3143 174.083C42.0272 139.87 66.5237 108.782 97.405 82.5957C128.286 56.4096 164.948 35.6382 205.296 21.4664C245.606 7.30811 288.807 0.01474 332.438 0.000823975L665 0C665 37.0327 656.398 73.7029 639.686 107.917C622.973 142.131 598.476 173.218 567.595 199.404C536.714 225.59 500.052 246.362 459.704 260.534C419.394 274.692 376.193 281.986 332.563 282H0Z"
                fill="#FECD07"
                opacity="0.9"
              />
            </svg>
          </div>

          {/* Right Yellow Blob - Responsive sizing */}
          <div className="absolute right-0 bottom-0 w-[40%] sm:w-[50%] md:w-[46%] max-w-[665px] h-[35%] sm:h-[40%] max-h-[282px] rotate-180">
            <svg
              viewBox="0 0 665 282"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 282C0 244.967 8.60156 208.297 25.3143 174.083C42.0272 139.87 66.5237 108.782 97.405 82.5957C128.286 56.4096 164.948 35.6382 205.296 21.4664C245.606 7.30811 288.807 0.01474 332.438 0.000823975L665 0C665 37.0327 656.398 73.7029 639.686 107.917C622.973 142.131 598.476 173.218 567.595 199.404C536.714 225.59 500.052 246.362 459.704 260.534C419.394 274.692 376.193 281.986 332.563 282H0Z"
                fill="#FECD07"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Container - Responsive with fixed height and rounded corners */}
      <div className="relative z-10 w-full max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div
          className="bg-white rounded-[24px] shadow-lg overflow-hidden"
          style={{ height: screenSize === 'mobile' ? 'auto' : '580px' }}
        >
          <div className="h-full flex flex-col p-2 sm:p-3 lg:p-4">
            {/* Header Section */}
            <div className="text-center mb-2 sm:mb-1 flex-shrink-0">
              {/* Title */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-warning fill-current" />
                <h2 className="text-xl sm:text-2xl lg:text-h4 text-warning font-bold">{t("title")}</h2>
              </div>

              {/* Subtitle */}
              <p className="text-medium-regular sm:text-medium-regular text-grey-1 mb-1 sm:mb-2">
                {t("subtitle")}
              </p>

              {/* Global Timer */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                <div className="flex items-center justify-center bg-primary text-white px-2 sm:px-4 py-1 sm:py-2 rounded-[100px] text-medium-semibold sm:text-medium-semibold font-bold min-w-[30px] min-h-[30px] sm:min-w-[50px] sm:min-h-[50px]">
                  {formatTime(timeLeft.hours)}
                </div>
                <span className="text-medium-semibold sm:text-base font-bold text-primary">:</span>
                <div className="flex items-center justify-center bg-primary text-white px-2 sm:px-4 py-1 sm:py-2 rounded-[100px] text-medium-semibold sm:text-medium-semibold font-bold min-w-[30px] min-h-[30px] sm:min-w-[50px] sm:min-h-[50px]">
                  {formatTime(timeLeft.minutes)}
                </div>
                <span className="text-sm sm:text-base font-bold text-primary">:</span>
                <div className="flex items-center justify-center bg-primary text-white px-2 sm:px-4 py-1 sm:py-2 rounded-[100px] text-medium-semibold sm:text-medium-semibold font-bold min-w-[30px] min-h-[30px] sm:min-w-[50px] sm:min-h-[50px]">
                  {formatTime(timeLeft.seconds)}
                </div>
              </div>
            </div>

            {screenSize === 'mobile' ? (
              // --- Mobile Layout ---
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{
                  transform: `translateX(${isRTL ? '' : '-'}${currentSlide * 100}%)`,
                }}
              >
                {deals.map((deal, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 px-2 flex items-center justify-center"
                  >
                    <FlashCard
                      {...deal}
                      className="w-full max-w-[280px] mx-auto"
                    />
                  </div>
                ))}
              </div>
            ) : screenSize === 'tablet' ? (
              // --- Tablet Layout ---
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{
                  transform: `translateX(${isRTL ? '' : '-'}${currentSlide * 100}%)`,
                  direction: isRTL ? 'rtl' : 'ltr',
                }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="w-full flex-shrink-0 h-full flex justify-center"
                  >
                    <div className="flex gap-2 h-full items-center justify-center">
                      {deals
                        .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                        .map((deal) => (
                          <FlashCard
                            key={deal.id}
                            {...deal}
                            className="w-full max-w-[280px]"
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // --- Desktop Layout ---
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{
                  transform: `translateX(${isRTL ? '' : '-'}${currentSlide * 100}%)`,
                  direction: isRTL ? 'rtl' : 'ltr',
                }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="flex-shrink-0 h-full flex justify-center w-full"
                  >
                    <div className="grid grid-cols-3 gap-4 h-full max-w-[960px] mx-auto place-items-center">
                      {deals
                        .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                        .map((deal) => (
                          <FlashCard
                            key={deal.id}
                            {...deal}
                            className="w-full max-w-[300px]"
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>

            )}

            {/* Bottom Section */}
            <div className="flex-shrink-0 pt-1 sm:pt-2">
              {/* Slide Indicators */}
              {canSlide && (
                <div className="flex justify-center gap-2 mb-6 sm:mb-8">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        index === currentSlide
                          ? "bg-primary w-6"
                          : "bg-grey-4 hover:bg-grey-3"
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* View All Button */}
              <div className="flex justify-center">
                {isRTL ? (
                  <Link href="/flashdeals">
                    <Button
                      variant="outline"
                      leadingIcon={<ChevronRight className="w-4 h-4 rotate-180" />}
                      className="px-4 sm:px-6 text-sm sm:text-base"
                    >
                      {t("viewAll")}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/flashdeals">
                    <Button
                      variant="outline"
                      trailingIcon={<ChevronRight className="w-4 h-4" />}
                      className="px-4 sm:px-6 text-sm sm:text-base"
                    >
                      {t("viewAll")}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}