"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

import Link from 'next/link'
import { ProductCard } from "@/components/cards/product-card"
import type { ProductCardProps } from "@/components/cards/product-card"

export interface CardSliderProps {
  items: ProductCardProps[]
  type?: 'products' | 'services' | 'explore'
  className?: string
  cardWidth?: number
  gap?: number
  showDots?: boolean
  showViewAll?: boolean
}

export function CardSlider({
  items = [],
  type = 'products',
  className,
  cardWidth = 260,
  gap = 16,
  showDots = true,
  showViewAll = false,
}: CardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState<number>(1)
  const [isRTL, setIsRTL] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const transitionTimeoutRef = useRef<number | null>(null)

  const totalItems = items.length
  const maxIndex = Math.max(0, totalItems - visibleCards)

  const getItemLink = useCallback((itemId: string) => {
    switch (type) {
      case 'services':
        return `/marketplace/service/${itemId}`
      case 'explore':
        return `/explore/${itemId}`
      case 'products':
      default:
        return `/marketplace/product/${itemId}`
    }
  }, [type])

  const getViewAllLink = useCallback(() => {
    switch (type) {
      case 'services':
        return '/maketplace'
      case 'explore':
        return '/explore'
      case 'products':
      default:
        return '/marketplace'
    }
  }, [type])

  // Detect RTL
  useEffect(() => {
    const detectRTL = () => {
      const dir = document.documentElement.dir ||
                  getComputedStyle(document.documentElement).direction ||
                  'ltr'
      setIsRTL(dir === 'rtl')
    }
    detectRTL()
    const observer = new MutationObserver(detectRTL)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] })
    return () => observer.disconnect()
  }, [])

  // Update visible cards based on screen size
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth
      let cards = 1

      if (width >= 1536) cards = 5
      else if (width >= 1280) cards = 4
      else if (width >= 1024) cards = 3
      else if (width >= 768) cards = 2
      else cards = 1

      setVisibleCards(Math.min(cards, totalItems))
    }

    updateVisibleCards()
    window.addEventListener("resize", updateVisibleCards)
    return () => window.removeEventListener("resize", updateVisibleCards)
  }, [cardWidth, gap, totalItems])

  // Helper: update currentIndex and arrow states based on visible children
  const updatePositionFromScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const children = Array.from(container.children) as HTMLElement[]
    if (children.length === 0) return

    const alignmentEdge = isRTL ? 'right' : 'left'

    // Find the child whose alignment edge is nearest to the container's alignment edge
    let nearestIndex = 0
    let nearestDistance = Infinity
    for (let i = 0; i < children.length; i++) {
      const childRect = children[i].getBoundingClientRect()
      const distance = Math.abs(childRect[alignmentEdge] - containerRect[alignmentEdge])
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = i
      }
    }

    const clampedIndex = Math.max(0, Math.min(nearestIndex, maxIndex))
    setCurrentIndex(clampedIndex)
    setCanScrollLeft(isRTL ? clampedIndex < maxIndex : clampedIndex > 0)
    setCanScrollRight(isRTL ? clampedIndex > 0 : clampedIndex < maxIndex)
  }, [isRTL, maxIndex])

  // Scroll handler (throttled via rAF)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updatePositionFromScroll()
          ticking = false
        })
        ticking = true
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    // initialize states
    updatePositionFromScroll()

    return () => container.removeEventListener("scroll", handleScroll)
  }, [updatePositionFromScroll])

  // Scroll to given index (no wrap-around). Uses scrollIntoView for accuracy across padding/RTL.
  const scrollToIndex = useCallback((index: number) => {
    const container = scrollContainerRef.current
    if (!container || isTransitioning) return

    const clampedIndex = Math.max(0, Math.min(index, maxIndex))
    const child = container.children[clampedIndex] as HTMLElement | undefined
    if (!child) return

    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
      transitionTimeoutRef.current = null
    }

    setIsTransitioning(true)

    child.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest'
    })

    setCurrentIndex(clampedIndex)
    setCanScrollLeft(isRTL ? clampedIndex < maxIndex : clampedIndex > 0)
    setCanScrollRight(isRTL ? clampedIndex > 0 : clampedIndex < maxIndex)

    // Allow interactions again after animation (adjust if your CSS transition is longer)
    transitionTimeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false)
      transitionTimeoutRef.current = null
    }, 450)
  }, [isRTL, isTransitioning, maxIndex])

  const moveToNext = useCallback(() => {
    const nextIndex = Math.min(currentIndex + 1, maxIndex)
    if (nextIndex !== currentIndex) scrollToIndex(nextIndex)
    return nextIndex
  }, [currentIndex, maxIndex, scrollToIndex])

  const moveToPrev = useCallback(() => {
    const prevIndex = Math.max(currentIndex - 1, 0)
    if (prevIndex !== currentIndex) scrollToIndex(prevIndex)
    return prevIndex
  }, [currentIndex, scrollToIndex])

  const scrollLeft = useCallback(() => {
    if (isTransitioning) return
    return isRTL ? moveToNext() : moveToPrev()
  }, [isRTL, moveToNext, moveToPrev, isTransitioning])

  const scrollRight = useCallback(() => {
    if (isTransitioning) return
    return isRTL ? moveToPrev() : moveToNext()
  }, [isRTL, moveToNext, moveToPrev, isTransitioning])

  // Touch handling for mobile swipe
  const minSwipeDistance = 50

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (touchStart == null || touchEnd == null || isTransitioning) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      isRTL ? scrollLeft() : scrollRight()
    } else if (isRightSwipe) {
      isRTL ? scrollRight() : scrollLeft()
    }
  }, [touchStart, touchEnd, isRTL, scrollLeft, scrollRight, isTransitioning])

  useEffect(() => {
    // Cleanup any pending timeout when component unmounts
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  if (items.length === 0) return null

  return (
    <div className={cn("w-full", className)}>
      {showViewAll && (
        <div className="flex justify-end mb-4">
          <Link
            href={getViewAllLink()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            View All {type.charAt(0).toUpperCase() + type.slice(1)}
          </Link>
        </div>
      )}

      <div className="relative group">
        {totalItems > visibleCards && (
          <>
            <button
              onClick={() => scrollLeft()}
              disabled={!canScrollLeft || isTransitioning}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200",
                "opacity-90 hover:opacity-100",
                canScrollLeft && !isTransitioning
                  ? "text-primary hover:bg-primary hover:text-white hover:scale-110"
                  : "text-grey-4 cursor-not-allowed opacity-50"
              )}
              aria-label={isRTL ? "Next" : "Previous"}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scrollRight()}
              disabled={!canScrollRight || isTransitioning}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200",
                "opacity-90 hover:opacity-100",
                canScrollRight && !isTransitioning
                  ? "text-primary hover:bg-primary hover:text-white hover:scale-110"
                  : "text-grey-4 cursor-not-allowed opacity-50"
              )}
              aria-label={isRTL ? "Previous" : "Next"}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        <div
          ref={scrollContainerRef}
          className={cn(
            "flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide items-center justify-start",
            "h-[280px] sm:h-[320px]",
            totalItems > visibleCards ? "px-6 sm:px-0" : "px-0",
            "scroll-smooth"
          )}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            direction: isRTL ? 'rtl' : 'ltr',
            willChange: 'scroll-position',
            transform: 'translateZ(0)'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex-shrink-0 transform transition-all duration-300 ease-out",
                "w-[240px] sm:w-[260px]",
                "will-change-transform backface-hidden"
              )}
              style={{
                minWidth: `${cardWidth}px`,
                transform: 'translateZ(0)'
              }}
            >
              <Link
                href={getItemLink(item.id)}
                className="block transition-opacity duration-200 hover:opacity-95"
              >
                <ProductCard {...item} />
              </Link>
            </div>
          ))}
        </div>

        {showDots && totalItems > visibleCards && (
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                disabled={isTransitioning}
                className={cn(
                  "rounded-full transition-all duration-200 hover:scale-125",
                  "w-1.5 h-1.5 sm:w-2 sm:h-2",
                  index === currentIndex
                    ? "bg-primary w-6 sm:w-8 shadow-lg"
                    : "bg-grey-4 hover:bg-grey-3",
                  isTransitioning && "cursor-not-allowed"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}