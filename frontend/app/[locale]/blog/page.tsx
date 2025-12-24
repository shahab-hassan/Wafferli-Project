"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/common/button"
import { TextField } from "@/components/common/text-field"
import { Badge } from "@/components/common/badge"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { useLocale, useTranslations } from "next-intl"
import axios from "axios"
import {
  Search,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  BookOpen,
} from "lucide-react"

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  image: string
  category: string
  tags: string[]
  author: {
    name: string
    image: string
    bio: string
  }
  publishDate: string
  readTime: string
  views: number
  likes: number
  comments: any[]
  featured: boolean
  trending: boolean
  status: string
}

export default function BlogPage() {
  const t = useTranslations()
  const locale = useLocale()
  const dir = locale === "ar" ? "rtl" : "ltr"

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [newsletterEmail, setNewsletterEmail] = useState("")

  const categories = [
    { id: "all", name: t("categories.all") },
    { id: "Food & Dining", name: t("categories.food") },
    { id: "Lifestyle", name: t("categories.lifestyle") },
    { id: "Business", name: t("categories.business") },
    { id: "Events", name: t("categories.events") },
    { id: "Culture", name: t("categories.culture") },
  ]

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}blog/published`)
      if (data.success) {
        setBlogs(data.blogs.filter((b: BlogPost) => !b.featured))
        setFeaturedBlogs(data.blogs.filter((b: BlogPost) => b.featured))
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewsletterSubscribe = async () => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}admin/settings/subscribe`, {
        email: newsletterEmail,
      })
      if (data.success) {
        alert("Subscribed successfully!")
        setNewsletterEmail("")
      }
    } catch (error: any) {
      alert(error?.response?.data?.error || "Failed to subscribe")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(date)
  }

  const filteredBlogs =
    selectedCategory === "all" ? blogs : blogs.filter((post) => post.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50" dir={dir}>
      {/* Hero Section */}
      <section className="text-white">
        <div className="relative max-w-[1440px] mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="inline-block text-h4 md:text-h2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary pb-3">
              {t("blog.title")}
            </h1>
            <p className="text-large-regular text-grey-3 opacity-90 max-w-2xl mx-auto">{t("blog.description")}</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex items-center space-x-4">
            <div className="flex-1 relative">
              <TextField
                placeholder={t("search.placeholder")}
                icon={<Search className="w-5 h-5 text-gray-400" />}
                className="pl-10 py-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="max-w-[1440px] mx-auto px-4 py-12">
          {/* Category Navigation */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t("browseByCategory")}</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all duration-300 rounded-xl border-1 border-grey-5 ${selectedCategory === category.id
                    ? "shadow-lg scale-105 bg-purple-50 border-2 border-purple-200"
                    : "hover:shadow-lg hover:scale-103 bg-black/1"
                    }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {featuredBlogs.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("featuredArticles")}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {featuredBlogs.slice(0, 3).map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug}`}>
                    <Card className="rounded-3xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 bg-white">
                      <div className="relative">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          width={600}
                          height={400}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
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
                        </div>
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
                              src={post.author.image || "/placeholder.svg"}
                              alt={post.author.name}
                              width={40}
                              height={40}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-sm">{post.author.name}</p>
                              <div className="flex items-center text-gray-500 text-xs space-x-2">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(post.publishDate)}</span>
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
                          <Button variant="primary" className="rounded-full">
                            Read More
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Regular Blogs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
            <div className="lg:col-span-2 max-w-[810px] w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("latestArticles")}</h2>
              {filteredBlogs.length === 0 ? (
                <p className="text-center text-gray-500 py-12">No blogs found.</p>
              ) : (
                <div className="space-y-6">
                  {filteredBlogs.map((post) => (
                    <Link key={post._id} href={`/blog/${post.slug}`}>
                      <Card className="rounded-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 bg-white max-w-[800px] max-h-[250px] w-full h-full">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 relative">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              width={400}
                              height={300}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                          <CardContent className="md:w-2/3 p-6 pt-3">
                            <Badge className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm mb-3">
                              {post.category}
                            </Badge>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{post.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
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
                                <span>{post?.comments?.length || 0}</span>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Newsletter Sidebar */}
            <div className="space-y-1 sticky top-30 self-start w-full max-width-[800px]">
              <Card className="rounded-xl w-full border-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{t("stayUpdated.title")}</h3>
                  <p className="text-purple-100 mb-4">{t("stayUpdated.description")}</p>
                  <div className="space-y-3">
                    <TextField
                      placeholder={t("stayUpdated.placeholder")}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-full"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <Button
                      onClick={handleNewsletterSubscribe}
                      className="w-full bg-white text-purple-600 hover:bg-gray-100 rounded-full font-semibold"
                    >
                      {t("stayUpdated.subscribe")}
                    </Button>
                  </div>
                  <p className="text-xs text-purple-100 mt-3">{t("stayUpdated.note")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}