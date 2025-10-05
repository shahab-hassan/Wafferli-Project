"use client"

import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/common/button'
import { cn } from '@/lib/utils'

// Icons remain the same...
const RestaurantIcon = () => (
  <svg className="size-4 sm:size-5" fill="white" viewBox="0 0 24 24">
    <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L14.89 11.53z"/>
  </svg>
)

const HotelIcon = () => (
  <svg className="size-4 sm:size-5" fill="white" viewBox="0 0 24 24">
    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
  </svg>
)

const SalonIcon = () => (
  <svg className="size-4 sm:size-5" fill="white" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
)

const ShoppingIcon = () => (
  <svg className="size-4 sm:size-5" fill="white" viewBox="0 0 24 24">
    <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
)

const EntertainmentIcon = () => (
  <svg className="size-4 sm:size-5" fill="white" viewBox="0 0 24 24">
    <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
  </svg>
)

const ServicesIcon = () => (
  <svg className="size-4 sm:size-5" fill="white" viewBox="0 0 24 24">
    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
  </svg>
)

const WeddingsIcon = () => (
  <svg className="size-4 sm:size-5" fill="white" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
)

const MarketplaceIcon = () => (
  <svg className="size-4 sm:size-5" fill="white" viewBox="0 0 24 24">
    <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v12z"/>
  </svg>
)

// Define types
export interface Category {
  id: string
  name: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
}

export interface CategoriesSectionProps {
  showViewAll?: boolean
  viewAllText?: string
  onViewAll?: () => void
  className?: string
  variant?: 'default' | 'primary' | 'secondary' | 'tertiary' | 'outline' | 'normal' | 'tab'
  size?: 'default' | 'sm' | 'lg'
  maxColumns?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

// Map category IDs to their icons
const categoryIcons: { [key: string]: React.ReactNode } = {
  'restaurants': <RestaurantIcon />,
  'hotels-stays': <HotelIcon />,
  'salons-spas': <SalonIcon />,
  'shopping': <ShoppingIcon />,
  'entertainment': <EntertainmentIcon />,
  'services': <ServicesIcon />,
  'weddings': <WeddingsIcon />,
  'marketplace': <MarketplaceIcon />,
}

const categoryKeys = [
  'restaurants', 'hotels-stays', 'salons-spas', 'shopping',
  'entertainment', 'services', 'weddings', 'marketplace'
]

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  showViewAll = true,
  onViewAll,
  className,
  size = 'default',
}) => {
  // Initialize the translation and locale hooks
  const t = useTranslations('CategoriesSection')
  const locale = useLocale()
  const router = useRouter()
  
  // Check if the current locale is RTL
  const isRTL = locale === 'ar' || locale === 'he' || locale === 'fa' || locale === 'ur'

  // Dynamically generate the categories array with translated names
  const categories: Category[] = categoryKeys.map(key => ({
    id: key,
    name: t(key),
    icon: categoryIcons[key],
  }))

  const handleCategoryClick = (category: Category) => {
    if (category.onClick) {
      category.onClick()
    } else if (category.href) {
      window.location.href = category.href
    } else {
      // Navigate to explore page with category filter
      const params = new URLSearchParams()
      params.set('category', category.id)
      router.push(`/explore?${params.toString()}`)
    }
  }

  const handleViewAllClick = () => {
    if (onViewAll) {
      onViewAll()
    } else {
      // Navigate to explore page without filters
      router.push('/explore')
    }
  }

  return (
    <section 
      className={cn(
        'w-full max-w-[1120px] mx-auto p-4',
        className
      )}
      role="navigation" 
      aria-label={t('aria.sectionLabel')}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 w-full">
        {categories.map((category) => (
          <div
            key={category.id}
            className="basis-[calc(50%-0.75rem)] sm:basis-auto flex-shrink-0 max-w-[250px] min-w-[100px]"
          >
            <Button
              size={size}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                'w-full h-[55px] flex items-center gap-2 px-4 text-black bg-background hover:bg-tertiary hover:text-black active:bg-tertiary/90 active:text-black transition-colors duration-300 rounded-[16px] sm:rounded-[24px] border border-grey-5',
                // RTL support: reverse flex direction in RTL
                isRTL ? 'flex-row-reverse' : 'flex-row'
              )}
              aria-label={t('aria.browseCategory', { categoryName: category.name })}
            >
              {/* Fixed size icon container */}
              <div className='h-10 w-10 bg-primary flex justify-center items-center rounded-full flex-shrink-0'>
                {category.icon}
              </div>
              
              {/* Text with ellipsis overflow */}
              <span className={cn(
                "text-small-regular sm:text-medium-regular truncate flex-1 text-center sm:text-left",
                isRTL && "sm:text-right"
              )}>
                {category.name}
              </span>
            </Button>
          </div>
        ))}
      </div>
      
      {showViewAll && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size={size}
            onClick={handleViewAllClick}
            className={cn(
              'flex items-center gap-2 px-4',
              // RTL support: reverse flex direction
              isRTL ? 'flex-row-reverse' : 'flex-row'
            )}
            aria-label={t('aria.viewAll')}
          >
              {t('viewAll')} {isRTL ? '←' : '→'}
            
          </Button>
        </div>
      )}
    </section>
  )
}

export default CategoriesSection;