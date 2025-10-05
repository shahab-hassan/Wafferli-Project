// app/blog/page.tsx or components/BlogPage.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/common/button"
import { TextField } from "@/components/common/text-field"
import { Badge } from "@/components/common/badge"
import { Card, CardContent } from "@/components/common/shadecn-card"
  import { useLocale } from "next-intl"

import {
  Search,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  BookOpen,
  Filter,
  ChevronRight,
  ArrowRight,
  MessageCircle,
  TrendingUp,
} from "lucide-react"
import { useTranslations } from "next-intl"

// New Component: HorizontalBlogCard
function HorizontalBlogCard({ post }: { post: any }) {
  return (
    <Card
      className="rounded-md hover:shadow-md transition-all duration-300 overflow-hidden border-0 bg-white max-w-[800px] max-h-[250px] w-full h-full"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={400}
            height={300}
            className="w-full h-48 md:h-full object-cover"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <CardContent className="md:w-2/3 p-6 pt-3">
          <div className="flex items-center justify-between mb-1">
            <Badge className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm">
              {post.category}
            </Badge>
            <Button size="sm" variant="ghost" className="rounded-full p-2">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{post.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Image
                src={post.authorImage || "/placeholder.svg"}
                alt={post.author}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium text-sm">{post.author}</p>
                <div className="flex items-center text-gray-500 text-xs space-x-2">
                  <Calendar className="w-3 h-3" />
                  <span>{post.publishDate}</span>
                  <Clock className="w-3 h-3 ml-2" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-gray-500 text-sm">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </div>
            </div>
            <Button variant='primary' className="rounded-full">
              Read More
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

// New Component: FeaturedArticleCard
function FeaturedArticleCard({ post }: { post: any }) {
  return (
    <Card
      className="rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border-0 bg-white"
    >
      <div className="relative">
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          width={600}
          height={400}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex space-x-2">
            <Badge className="bg-purple-600 text-white rounded-full px-3 py-1">Featured</Badge>
            {post.trending && (
              <Badge className="bg-red-500 text-white rounded-full px-3 py-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>
          <Button size="sm" variant="ghost" className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <Heart className="w-4 h-4 text-white" />
          </Button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <Badge className="bg-white/20 backdrop-blur-sm text-white rounded-full px-3 py-1 mb-3">
            {post.category}
          </Badge>
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
        </div>
      </div>

      <CardContent className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Image
              src={post.authorImage || "/placeholder.svg"}
              alt={post.author}
              width={40}
              height={40}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-medium text-sm">{post.author}</p>
              <div className="flex items-center text-gray-500 text-xs space-x-2">
                <Calendar className="w-3 h-3" />
                <span>{post.publishDate}</span>
                <Clock className="w-3 h-3 ml-2" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{post.likes}</span>
            </div>
          </div>
          <Button variant='primary'className="rounded-full">
            Read More
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function BlogPage() {
  const  t = useTranslations()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")


  const locale = useLocale()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  const categories = [
    { id: "all", name: t("categories.all"), count: 45, color: "bg-purple-100 text-purple-700" },
    { id: "food", name: t("categories.food"), count: 12, color: "bg-orange-100 text-orange-700" },
    { id: "lifestyle", name: t("categories.lifestyle"), count: 8, color: "bg-pink-100 text-pink-700" },
    { id: "business", name: t("categories.business"), count: 10, color: "bg-blue-100 text-blue-700" },
    { id: "events", name: t("categories.events"), count: 7, color: "bg-green-100 text-green-700" },
    { id: "culture", name: t("categories.culture"), count: 8, color: "bg-amber-100 text-amber-700" },
  ]

  const featuredPosts = [
    {
      id: 1,
      title: t("poster.foodGuide.title"),
      excerpt: t("poster.foodGuide.excerpt"),
      image: "/placeholder.svg?height=400&width=600&text=Kuwait+Food+Guide",
      category: t("categories.food"),
      author: t("authors.sarah"),
      authorImage: "/placeholder.svg?height=40&width=40&text=Sarah",
      publishDate: "Dec 15, 2024",
      readTime: t("poster.foodGuide.readTime"),
      views: "2.3K",
      likes: 156,
      featured: true,
      trending: true,
      slug: "ultimate-guide-kuwait-hidden-food-gems",
    },
    {
      id: 2,
      title: t("poster.digitalMarketing.title"),
      excerpt: t("poster.digitalMarketing.excerpt"),
      image: "/placeholder.svg?height=400&width=600&text=Digital+Marketing",
      category: t("categories.business"),
      author: t("authors.ahmed"),
      authorImage: "/placeholder.svg?height=40&width=40&text=Ahmed",
      publishDate: "Dec 12, 2024",
      readTime: t("poster.digitalMarketing.readTime"),
      views: "1.8K",
      likes: 89,
      featured: true,
      trending: false,
      slug: "how-local-businesses-thriving-digital-marketing",
    },
    // Added third featured post
    {
      id: 3,
      title: t("poster.familyActivities.title"),
      excerpt: t("poster.familyActivities.excerpt"),
      image: "/placeholder.svg?height=400&width=600&text=Family+Activities",
      category: t("categories.lifestyle"),
      author: t("authors.fatima"),
      authorImage: "/placeholder.svg?height=40&width=40&text=Fatima",
      publishDate: "Dec 10, 2024",
      readTime: t("poster.familyActivities.readTime"),
      views: "1.2K",
      likes: 67,
      featured: true,
      trending: true,
      slug: "top-10-weekend-activities-families-kuwait",
    },
  ]

  const regularPosts = [
    {
      id: 4,
      title: t("poster.architecture.title"),
      excerpt: t("poster.architecture.excerpt"),
      image: "/placeholder.svg?height=300&width=400&text=Kuwait+Architecture",
      category: t("categories.culture"),
      author: t("authors.omar"),
      authorImage: "/placeholder.svg?height=40&width=40&text=Omar",
      publishDate: "Dec 8, 2024",
      readTime: t("poster.architecture.readTime"),
      views: "950",
      likes: 45,
      comments: 12,
      slug: "traditional-kuwaiti-architecture-past-meets-present",
    },
    {
      id: 5,
      title: t("poster.businessGuide.title"),
      excerpt: t("poster.businessGuide.excerpt"),
      image: "/placeholder.svg?height=300&width=400&text=Business+Guide",
      category: t("categories.business"),
      author: t("authors.nadia"),
      authorImage: "/placeholder.svg?height=40&width=40&text=Nadia",
      publishDate: "Dec 5, 2024",
      readTime: t("poster.businessGuide.readTime"),
      views: "2.1K",
      likes: 134,
      comments: 45,
      slug: "starting-small-business-kuwait-complete-guide",
    },
    {
      id: 6,
      title: t("poster.coffeeShops.title"),
      excerpt: t("poster.coffeeShops.excerpt"),
      image: "/placeholder.svg?height=300&width=400&text=Coffee+Shops",
      category: t("categories.lifestyle"),
      author: t("authors.layla"),
      authorImage: "/placeholder.svg?height=40&width=40&text=Layla",
      publishDate: "Dec 3, 2024",
      readTime: t("poster.coffeeShops.readTime"),
      views: "1.5K",
      likes: 78,
      comments: 19,
      slug: "kuwait-best-coffee-shops-remote-work",
    },
    {
      id: 7,
      title: t("poster.culturalEvents.title"),
      excerpt: t("poster.culturalEvents.excerpt"),
      image: "/placeholder.svg?height=300&width=400&text=Cultural+Events",
      category: t("categories.events"),
      author: t("authors.khalid"),
      authorImage: "/placeholder.svg?height=40&width=40&text=Khalid",
      publishDate: "Dec 1, 2024",
      readTime: t("poster.culturalEvents.readTime"),
      views: "890",
      likes: 52,
      comments: 8,
      slug: "upcoming-cultural-events-winter-kuwait",
    },
    {
      id: 8,
      title: t("poster.sustainableLiving.title"),
      excerpt: t("poster.sustainableLiving.excerpt"),
      image: "/placeholder.svg?height=300&width=400&text=Sustainable+Living",
      category: t("categories.lifestyle"),
      author: t("authors.maryam"),
      authorImage: "/placeholder.svg?height=40&width=40&text=Maryam",
      publishDate: "Nov 28, 2024",
      readTime: t("poster.sustainableLiving.readTime"),
      views: "1.3K",
      likes: 95,
      comments: 31,
      slug: "rise-sustainable-living-kuwait",
    },
  ]

  const filteredPosts = selectedCategory === 'all' 
    ? regularPosts 
    : regularPosts.filter(post => post.category === categories.find(cat => cat.id === selectedCategory)?.name)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50" dir={dir}>
      {/* Hero Section - Removed gradient background */}
      <section className="text-white">
        <div className="relative max-w-[1440px] mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="inline-block text-h4 md:text-h2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary pb-3">{t('blog.title')}</h1>
            <p className="text-large-regular text-grey-3 opacity-90 max-w-2xl mx-auto">
              {t('blog.description')}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex items-center space-x-4">
                <div className="flex-1 relative">
                  <TextField
                    placeholder={t('search.placeholder')}
                    icon={<Search className="w-5 h-5 text-gray-400" />}
                    className="pl-10 py-3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
          </div>

        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 py-12">
        {/* Category Navigation */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('browseByCategory')}</h2>
            <Button variant="outline" className="rounded-full bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              {t('allFilters')}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all duration-300 rounded-xl border-1 border-grey-5 ${
                  selectedCategory === category.id
                    ? "shadow-lg scale-105 bg-purple-50 border-2 border-purple-200"
                    : "hover:shadow-lg hover:scale-103 bg-black/1"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <Badge className={`${category.color} rounded-full px-2 py-1 text-xs`}>{category.count} {t('comments.post')}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured poster - Changed to lg:grid-cols-3 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('featuredArticles')}</h2>
            <Button variant="outline" className="rounded-full bg-transparent">
              {t('viewAll')}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Link key={post.id} href="/blog/ultimate-guide">
                <FeaturedArticleCard post={post} />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
          {/* Main Content */}
          <div className="lg:col-span-2 max-w-[810px] w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('latestArticles')}</h2>
              <div className="flex items-center space-x-2">
                <select className="bg-white border border-gray-300 rounded-full px-5 py-2 focus:border-purple-500 focus:ring-purple-500">
                  <option value="newest">{t('sort.newest')}</option>
                  <option value="popular">{t('sort.popular')}</option>
                  <option value="trending">{t('sort.trending')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <div key={post.id} className="mt-2">
                <Link href="/blog/ultimate-guide">
                  <HorizontalBlogCard post={post} />
                </Link>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full"
              >
                {t('loadMore')}
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Sidebar - Removed Trending Topics and Popular Authors, made Stay Updated sticky */}
          <div className="space-y-1 sticky top-30 self-start w-full max-width-[800px] ">
            {/* Newsletter Signup */}
            <Card className="rounded-xl w-full border-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{t('stayUpdated.title')}</h3>
                <p className="text-purple-100 mb-4">{t('stayUpdated.description')}</p>
                <div className="space-y-3">
                  <TextField
                    placeholder={t('stayUpdated.placeholder')}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-full"
                  />
                  <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 rounded-full font-semibold">
                    {t('stayUpdated.subscribe')}
                  </Button>
                </div>
                <p className="text-xs text-purple-100 mt-3">{t('stayUpdated.note')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}