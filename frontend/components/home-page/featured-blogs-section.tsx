"use client"

import { useEffect, useState } from "react"
import { BlogSlider } from "@/components/common/sliders/blog-slider"
import type { BlogCardProps } from "@/components/cards/blog-card"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/common/button"
import { useLocale, useTranslations } from "next-intl"
import axios from "axios"

interface FeaturedBlogsSectionProps {
  className?: string
}

export function FeaturedBlogsSection({ className = "" }: FeaturedBlogsSectionProps) {
  const locale = useLocale()
  const t = useTranslations("Blog")
  const isRTL = locale === "ar"

  const [blogs, setBlogs] = useState<BlogCardProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}blog/published?featured=true&limit=5`
      )
      if (data.success) {
        const mappedBlogs: BlogCardProps[] = data.blogs.map((blog: any) => ({
          id: blog._id,
          title: blog.title,
          slug: blog.slug,
          description: blog.excerpt,
          image: blog.image,
          date: new Date(blog.publishDate).toLocaleDateString(locale, {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          readTime: blog.readTime,
        }))
        setBlogs(mappedBlogs)
      }
    } catch (error) {
      console.error("Failed to fetch featured blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className={`w-full py-8 sm:py-12 lg:py-16 ${className}`}>
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (blogs.length === 0) {
    return null
  }

  return (
    <section className={`w-full py-8 sm:py-12 lg:py-16 ${className}`}>
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h4 className="text-h4 text-black-1 mb-4">{t("title")}</h4>
          <p className="text-medium-regular text-grey-2 max-w-2xl mx-auto">{t("subtitle")}</p>
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
            <Link href="/blog">
              <Button
                variant="outline"
                leadingIcon={<ChevronRight className="w-4 h-4 rotate-180" />}
                className="px-4 sm:px-6 text-sm sm:text-base"
              >
                {t("viewAll")}
              </Button>
            </Link>
          ) : (
            <Link href="/blog">
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