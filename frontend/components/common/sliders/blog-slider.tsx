"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import Link from 'next/link'
import { BlogCard } from "@/components/cards/blog-card"
import type { BlogCardProps } from "@/components/cards/blog-card"

export interface BlogSliderProps {
  items: BlogCardProps[]
  className?: string
  cardWidth?: number
  gap?: number
  showDots?: boolean
  pauseOnHover?: boolean
}

export function BlogSlider({
  items = [],
  className,
  cardWidth = 340,
  gap = 16,
  showDots = true,
  pauseOnHover = true,
}: BlogSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visibleCards, setVisibleCards] = useState<number>(1)
  const [isHovered, setIsHovered] = useState(false)
  const [isRTL, setIsRTL] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  const totalItems = items.length
  const slidesCount = Math.ceil(totalItems / visibleCards)
  const maxSlide = slidesCount - 1

  // Detect RTL direction
  useEffect(() => {
    const detectRTL = () => {
      const dir = document.documentElement.dir || 
                  getComputedStyle(document.documentElement).direction ||
                  'ltr'
      setIsRTL(dir === 'rtl')
    }
    
    detectRTL()
    
    const observer = new MutationObserver(detectRTL)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir']
    })
    
    return () => observer.disconnect()
  }, [])

  // Update visible cards based on screen size - always show 3 cards
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth
      let cards = 1
      let size: 'mobile' | 'tablet' | 'desktop' = 'mobile'
      
      if (width >= 1024) {
        cards = 3
        size = 'desktop'
      } else if (width >= 768) {
        cards = 2
        size = 'tablet'
      } else {
        cards = 1
        size = 'mobile'
      }
      
      setVisibleCards(Math.min(cards, totalItems))
      setScreenSize(size)
    }
    
    updateVisibleCards()
    window.addEventListener("resize", updateVisibleCards)
    return () => window.removeEventListener("resize", updateVisibleCards)
  }, [cardWidth, gap, totalItems])

  const scrollToSlide = useCallback((slide: number) => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentSlide(slide)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }
  }, [isTransitioning])

  const moveToNext = useCallback(() => {
    const nextSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1
    scrollToSlide(nextSlide)
    return nextSlide
  }, [currentSlide, maxSlide, scrollToSlide])

  const moveToPrev = useCallback(() => {
    const prevSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1
    scrollToSlide(prevSlide)
    return prevSlide
  }, [currentSlide, maxSlide, scrollToSlide])

  const scrollLeft = useCallback(() => {
    if (isTransitioning) return
    return isRTL ? moveToNext() : moveToPrev()
  }, [isRTL, moveToNext, moveToPrev, isTransitioning])

  const scrollRight = useCallback(() => {
    if (isTransitioning) return
    return isRTL ? moveToPrev() : moveToNext()
  }, [isRTL, moveToNext, moveToPrev, isTransitioning])

  // Touch handling
  const minSwipeDistance = 50

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || isTransitioning) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      isRTL ? scrollLeft() : scrollRight()
    } else if (isRightSwipe) {
      isRTL ? scrollRight() : scrollLeft()
    }
  }, [touchStart, touchEnd, isRTL, scrollLeft, scrollRight, isTransitioning])

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn("w-full", className)}>
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="overflow-hidden"
          style={{ height: screenSize === 'mobile' ? 'auto' : '480px' }}
        >
          <div
            className={cn("flex items-center justify-start", "h-full")}
            style={{ 
              direction: isRTL ? 'rtl' : 'ltr',
              transform: `translateX(${isRTL ? '' : '-'} ${currentSlide * 100}%)`,
              transition: 'transform 0.3s ease-out',
              willChange: 'transform',
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {Array.from({ length: slidesCount }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="min-w-full h-full flex-shrink-0 flex items-center justify-center"
              >
                <div className="flex items-center" style={{ gap: `${gap}px` }}>
                  {items.slice(slideIndex * visibleCards, (slideIndex + 1) * visibleCards).map((item) => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "flex-shrink-0 transform transition-all duration-300 ease-out",
                        "w-[320px] sm:w-[340px]",
                        "will-change-transform backface-hidden"
                      )}
                      style={{ minWidth: `${cardWidth}px`, transform: 'translateZ(0)' }}
                    >
                      <Link 
                        href={`/blog/${item.id}`}
                        className="block transition-opacity duration-200 hover:opacity-95"
                      >
                        <BlogCard {...item} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDots && totalItems > visibleCards && (
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {Array.from({ length: slidesCount }).map((_, slide) => (
              <button
                key={slide}
                onClick={() => scrollToSlide(slide)}
                disabled={isTransitioning}
                className={cn(
                  "rounded-full transition-all duration-200 hover:scale-125",
                  "w-1.5 h-1.5 sm:w-2 sm:h-2",
                  slide === currentSlide 
                    ? "bg-primary w-6 sm:w-8 shadow-lg" 
                    : "bg-grey-4 hover:bg-grey-3",
                  isTransitioning && "cursor-not-allowed"
                )}
                aria-label={`Go to slide ${slide + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
