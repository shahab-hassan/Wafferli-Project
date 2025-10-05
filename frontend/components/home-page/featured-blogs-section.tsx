import { BlogSlider } from "@/components/common/sliders/blog-slider"
import type { BlogCardProps } from "@/components/cards/blog-card"
import Link from 'next/link'
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/common/button"
import { useLocale, useTranslations } from "next-intl"

// Sample blog data - replace with your actual data
const sampleBlogs: BlogCardProps[] = [
  {
    id: "1",
    title: "Top 10 Must-Try Traditional Kuwaiti Dishes in 2024",
    description: "Discover authentic Kuwaiti cuisine from machboos to luqaimat. Our comprehensive guide to the best traditional restaurants and hidden gems.",
    image: "/placeholder.svg?height=145&width=340&query=kuwaiti food",
    date: "December 15, 2024",
    readTime: "5 min read"
  },
  {
    id: "2", 
    title: "Top 10 Must-Try Traditional Kuwaiti Dishes in 2024",
    description: "Discover authentic Kuwaiti cuisine from machboos to luqaimat. Our comprehensive guide to the best traditional restaurants and hidden gems.",
    image: "/placeholder.svg?height=145&width=340&query=kuwaiti culture",
    date: "December 15, 2024",
    readTime: "5 min read"
  },
  {
    id: "3",
    title: "Top 10 Must-Try Traditional Kuwaiti Dishes in 2024", 
    description: "Discover authentic Kuwaiti cuisine from machboos to luqaimat. Our comprehensive guide to the best traditional restaurants and hidden gems.",
    image: "/placeholder.svg?height=145&width=340&query=kuwait city",
    date: "December 15, 2024", 
    readTime: "5 min read"
  },
  {
    id: "4",
    title: "Best Shopping Malls and Markets in Kuwait",
    description: "From luxury shopping centers to traditional souks, discover the best places to shop in Kuwait City and beyond.",
    image: "/placeholder.svg?height=145&width=340&query=shopping mall",
    date: "December 14, 2024",
    readTime: "7 min read"
  },
  {
    id: "5",
    title: "Kuwait's Hidden Beach Gems You Need to Visit",
    description: "Explore pristine beaches and coastal attractions away from the crowds. Your guide to Kuwait's most beautiful seaside spots.",
    image: "/placeholder.svg?height=145&width=340&query=beach kuwait",
    date: "December 13, 2024",
    readTime: "6 min read"
  }
]

interface FeaturedBlogsSectionProps {
  blogs?: BlogCardProps[]
  className?: string
}

export function FeaturedBlogsSection({
  blogs = sampleBlogs,
  className = "",
}: FeaturedBlogsSectionProps) {
  const locale = useLocale()
  const t = useTranslations("Blog")
  const isRTL = locale === "ar"

  return (
    <section className={`w-full py-8 sm:py-12 lg:py-16 ${className}`}>
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h4 className="text-h4 text-black-1 mb-4">
            {t("title")}
          </h4>
          <p className="text-medium-regular text-grey-2 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Blog Slider */}
        <div className="relative">
          <BlogSlider 
            items={blogs}
            cardWidth={340}
            gap={16}
            showDots={true}
            autoPlay={true}
            autoPlayInterval={4000}
            autoScrollDelay={2000}
            pauseOnHover={true}
          />
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8 sm:mt-12">
          {isRTL ? (
            <Link href="/blog" >
            <Button
              variant="outline"
              leadingIcon={<ChevronRight className="w-4 h-4 rotate-180" />}
              className="px-4 sm:px-6 text-sm sm:text-base"
            >
              {t("viewAll")}
            </Button>
            </Link>
          ) : (
          <Link href="/blog" >

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
    </section>
  )
}