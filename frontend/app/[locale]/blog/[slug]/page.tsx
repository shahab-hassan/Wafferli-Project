"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import { Badge } from "@/components/common/badge"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { useLocale, useTranslations } from "next-intl"
import axios from "axios"
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  ThumbsUp,
  Facebook,
  Twitter,
  Linkedin,
  BookOpen,
  Star,
} from "lucide-react"

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
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
  likedBy: string[]
  comments: Comment[]
  featured: boolean
  trending: boolean
}

interface Comment {
  _id: string
  author: {
    _id: string
    fullName: string
    email: string
  }
  content: string
  likes: number
  likedBy: string[]
  createdAt: string
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }>; }) {
  const t = useTranslations()
  const locale = useLocale()
  const dir = locale === "ar" ? "rtl" : "ltr"

  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([])
  const [newsletterEmail, setNewsletterEmail] = useState("")

  const resolvedParams = use(params)
  const slug = resolvedParams.slug

  useEffect(() => {
    fetchBlog()
  }, [slug])

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}blog/${slug}`)
      if (data.success) {
        setBlog(data.blog)
        // Fetch related blogs
        const relatedRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}blog/published?category=${data.blog.category}&limit=3`
        )
        if (relatedRes.data.success) {
          setRelatedBlogs(relatedRes.data.blogs.filter((b: BlogPost) => b.slug !== slug).slice(0, 3))
        }
      }
    } catch (error) {
      console.error("Failed to fetch blog:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    setIsLiked(!isLiked)
  }

  const handleCommentSubmit = async () => {
    alert("Coming Soon...")
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
    return new Intl.DateTimeFormat(locale, { month: "long", day: "numeric", year: "numeric" }).format(date)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
        <Link href="/blog">
          <Button>Back to Blogs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen" dir={dir}>
      <div className="max-w-[1120px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-[1440px] mx-auto">
          {/* Article Header */}
          <div className="mb-6 sm:mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm">{blog.category}</Badge>
              {blog.featured && (
                <Badge className="bg-yellow-100 text-yellow-700 rounded-full px-3 py-1 text-sm">
                  {t("featured")}
                </Badge>
              )}
              {blog.trending && (
                <Badge className="bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm">{t("trending")}</Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight break-words">
              {blog.title}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 leading-relaxed max-w-none">
              {blog.excerpt}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Image
                  src={blog.author.image || "/placeholder.svg"}
                  alt={blog.author.name}
                  width={50}
                  height={50}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">{blog.author.name}</p>
                  <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(blog.publishDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{blog.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{blog.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{blog.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{blog.comments.length}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <span className="text-sm text-gray-600">{t("share")}:</span>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="rounded-full bg-transparent w-full sm:w-auto">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button size="sm" variant="outline" className="rounded-full bg-transparent w-full sm:w-auto">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button size="sm" variant="outline" className="rounded-full bg-transparent w-full sm:w-auto">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {blog.image && (
            <div className="mb-8">
              <div className="w-full aspect-video sm:aspect-[16/9] md:aspect-[3/1] rounded-3xl overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={1200}
                  height={600}
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none mb-12">
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t("tags.title")}</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="rounded-full px-3 py-1 hover:bg-purple-50 hover:border-purple-200 cursor-pointer bg-transparent text-sm"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Like and Share Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 p-4 sm:p-6 bg-white rounded-2xl gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                variant={isLiked ? "default" : "outline"}
                className={`rounded-full w-full sm:w-auto ${isLiked ? "bg-red-500 hover:bg-red-600 text-white" : "bg-transparent"
                  }`}
                onClick={handleLike}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? t("liked") : t("like")} ({blog.likes + (isLiked ? 1 : 0)})
              </Button>
              <Button variant="outline" className="rounded-full bg-transparent w-full sm:w-auto">
                <Share2 className="w-4 h-4 mr-2" />
                {t("share")}
              </Button>
            </div>
          </div>

          {/* Author Bio */}
          {blog.author.bio && (
            <Card className="rounded-2xl border-0 bg-white mb-12">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Image
                    src={blog.author.image || "/placeholder.svg"}
                    alt={blog.author.name}
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{blog.author.name}</h3>
                    <p className="text-gray-600">{blog.author.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments Section */}
          <Card className="rounded-2xl border-0 bg-white mb-12">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                {t("comments.title")} ({blog.comments.length})
              </h3>

              {/* Comment Form */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1 w-full min-w-0">
                    <Input
                      placeholder={t("comments.placeholder")}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="rounded-2xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 mb-3 w-full"
                    />
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full w-full sm:w-auto"
                      disabled={!comment.trim()}
                      onClick={handleCommentSubmit}
                    >
                      {t("comments.post")}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-5">
                {blog.comments.map((c) => (
                  <div key={c._id} className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                      {c.author.fullName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-2xl p-3 sm:p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{c.author.fullName}</h4>
                          <span className="text-xs sm:text-sm text-gray-500">
                            {formatDate(c.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 break-words">{c.content}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                        <Button size="sm" variant="ghost" className="p-0 h-auto">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {c.likes}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related posts */}
          {relatedBlogs.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t("relatedArticles")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedBlogs.map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug}`} className="block">
                    <Card className="rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-4">
                        <Badge className="mb-2">{post.category}</Badge>
                        <h4 className="font-bold mb-2 line-clamp-2">{post.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Signup */}
          <Card className="rounded-2xl border-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
            <CardContent className="p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">{t("newsletteres.title")}</h3>
              <p className="text-purple-100 mb-4 sm:mb-6">{t("newsletteres.description")}</p>
              <div className="max-w-md mx-auto w-full">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder={t("newsletteres.placeholder")}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-full flex-1 w-full"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <Button
                    onClick={handleNewsletterSubscribe}
                    className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-6 w-full sm:w-auto"
                  >
                    {t("newsletteres.subscribe")}
                  </Button>
                </div>
                <p className="text-xs text-purple-100 mt-3">{t("newsletteres.note")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}