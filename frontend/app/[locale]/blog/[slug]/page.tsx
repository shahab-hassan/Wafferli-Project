// app/blog/[slug]/page.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import { Badge } from "@/components/common/badge"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { useLocale } from "next-intl"
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  ThumbsUp,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
  BookOpen,
  Star,
} from "lucide-react"
import { useTranslations } from "next-intl"

// New Component: RelatedArticleCard (kept internal style but responsive)
function RelatedArticleCard({ post }: { post: any }) {
  return (
    <Card className="rounded-xl sm:rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden border-0 bg-white">
      <div className="relative">
        {/* Responsive image container */}
        <div className="w-full aspect-[4/3] sm:aspect-video md:aspect-[16/9]">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={1200}
            height={675}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Top badges row */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex items-start justify-between gap-1 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <Badge className="bg-purple-600 text-white rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">
              Featured
            </Badge>
            {post.trending && (
              <Badge className="bg-red-500 text-white rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs">
                Trending
              </Badge>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/20 backdrop-blur-sm rounded-full p-1 sm:p-2"
          >
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </Button>
        </div>

        {/* Bottom overlay info */}
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 text-white">
          <Badge className="bg-white/20 backdrop-blur-sm text-white rounded-full px-2 sm:px-3 py-0.5 sm:py-1 mb-1.5 sm:mb-3 text-[10px] sm:text-xs">
            {post.category}
          </Badge>
          <h3 className="text-sm sm:text-lg md:text-xl font-semibold mb-0.5 sm:mb-1 line-clamp-2">
            {post.title}
          </h3>
        </div>
      </div>

      <CardContent className="p-3 sm:p-4 md:p-6">
        <p className="text-gray-600 mb-2 sm:mb-3 text-xs sm:text-sm md:text-base line-clamp-3">
          {post.excerpt}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Image
            src={post.authorImage || "/placeholder.svg"}
            alt={post.author}
            width={32}
            height={32}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
          />
          <div className="text-xs sm:text-sm">
            <p className="font-medium">{post.author}</p>
            <div className="flex items-center gap-1 sm:gap-2 text-gray-500 text-[10px] sm:text-xs">
              <Calendar className="w-3 h-3" />
              <span>{post.publishDate}</span>
              <Clock className="w-3 h-3" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm">
            <div className="flex items-center gap-0.5">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{post.likes}</span>
            </div>
          </div>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-white text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2">
            Read More
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const t = useTranslations()
  const [isLiked, setIsLiked] = useState(false)
  const [comment, setComment] = useState("")
  const [showComments, setShowComments] = useState(true)

  const locale = useLocale()
  const dir = locale === "ar" ? "rtl" : "ltr"

  // Mock blog post data (kept your structure)
  const blogPost = {
    id: 1,
    title: t("poster.foodGuide.title"),
    slug: "ultimate-guide-kuwait-hidden-food-gems",
    excerpt: t("poster.foodGuide.excerpt"),
    content: `
      <p>${t("poster.foodGuide.content.p1")}</p>
      <h2>${t("poster.foodGuide.content.h2_1")}</h2>
      <p>${t("poster.foodGuide.content.p2")}</p>
      <h3>${t("poster.foodGuide.content.h3_1")}</h3>
      <p>${t("poster.foodGuide.content.p3")}</p>
      <h2>${t("poster.foodGuide.content.h2_2")}</h2>
      <p>${t("poster.foodGuide.content.p4")}</p>
      <h3>${t("poster.foodGuide.content.h3_2")}</h3>
      <p>${t("poster.foodGuide.content.p5")}</p>
      <h2>${t("poster.foodGuide.content.h2_3")}</h2>
      <p>${t("poster.foodGuide.content.p6")}</p>
      <p>${t("poster.foodGuide.content.p7")}</p>
    `,
    image: "/placeholder.svg?height=600&width=1200&text=Kuwait+Food+Guide",
    category: t("categories.food"),
    tags: [t("tags.kuwait"), t("tags.food"), t("tags.restaurants"), t("tags.localGuide"), t("tags.streetFood")],
    author: {
      name: t("authors.sarah"),
      image: "/placeholder.svg?height=80&width=80&text=Sarah",
      bio: t("authors.sarahBio"),
      followers: "2.3K",
      posts: 45,
      social: {
        twitter: "@sarah_alrashid",
        instagram: "@sarahfoodkw",
      },
    },
    publishDate: "December 15, 2024",
    readTime: t("posts.foodGuide.readTime"),
    views: "2.3K",
    likes: 156,
    comments: 23,
    shares: 45,
    featured: true,
    trending: true,
  }

  const relatedPosts = [
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

  const comments = [
    {
      id: 1,
      author: t("authors.ahmed"),
      avatar: "/placeholder.svg?height=40&width=40&text=Ahmed",
      content: t("comments.comment1"),
      date: t("comments.date1"),
      likes: 12,
      replies: 2,
    },
    {
      id: 2,
      author: t("authors.fatima"),
      avatar: "/placeholder.svg?height=40&width=40&text=Fatima",
      content: t("comments.comment2"),
      date: t("comments.date2"),
      likes: 8,
      replies: 1,
    },
    {
      id: 3,
      author: t("authors.omar"),
      avatar: "/placeholder.svg?height=40&width=40&text=Omar",
      content: t("comments.comment3"),
      date: t("comments.date3"),
      likes: 15,
      replies: 0,
    },
  ]

  return (
    <div className="bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen" dir={dir}>
      <div className="max-w-[1120px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-[1440px] mx-auto">
          {/* Article Header */}
          <div className="mb-6 sm:mb-10">
            {/* Tags and Category */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm">{blogPost.category}</Badge>
              {blogPost.featured && (
                <Badge className="bg-yellow-100 text-yellow-700 rounded-full px-3 py-1 text-sm">{t("featured")}</Badge>
              )}
              {blogPost.trending && (
                <Badge className="bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm">{t("trending")}</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight break-words">
              {blogPost.title}
            </h1>

            {/* Excerpt */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 leading-relaxed max-w-none">{blogPost.excerpt}</p>

            {/* Author and Meta Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Image
                  src={blogPost.author.image || "/placeholder.svg"}
                  alt={blogPost.author.name}
                  width={50}
                  height={50}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">{blogPost.author.name}</p>
                  <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{blogPost.publishDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{blogPost.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{blogPost.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{blogPost.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{blogPost.comments}</span>
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
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
          <div className="mb-8">
            <div className="w-full aspect-video sm:aspect-[16/9] md:aspect-[3/1] rounded-3xl overflow-hidden">
              <Image
                src={blogPost.image || "/placeholder.svg"}
                alt={blogPost.title}
                width={1200}
                height={600}
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none mb-12">
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t("tags.title")}</h3>
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map((tag, index) => (
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

          {/* Like and Share Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 p-4 sm:p-6 bg-white rounded-2xl gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                variant={isLiked ? "default" : "outline"}
                className={`rounded-full w-full sm:w-auto ${isLiked ? "bg-red-500 hover:bg-red-600 text-white" : "bg-transparent"}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? t("liked") : t("like")} ({blogPost.likes + (isLiked ? 1 : 0)})
              </Button>
              <Button variant="outline" className="rounded-full bg-transparent w-full sm:w-auto">
                <Share2 className="w-4 h-4 mr-2" />
                {t("share")} ({blogPost.shares})
              </Button>
            </div>
            <p className="text-sm text-gray-600">{t("helpful")}</p>
          </div>

          {/* Author Bio */}
          <Card className="rounded-2xl border-0 bg-white mb-12">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Image
                  src={blogPost.author.image || "/placeholder.svg"}
                  alt={blogPost.author.name}
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{blogPost.author.name}</h3>
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-white">
                      {t("follow")}
                    </Button>
                  </div>
                  <p className="text-gray-600 mb-3">{blogPost.author.bio}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{blogPost.author.posts} {t("articles")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{blogPost.author.followers} {t("followers")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{t("follow")}:</span>
                      <Button size="sm" variant="ghost" className="p-1 rounded-full">
                        <Twitter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
{/* Comments Section */}
<Card className="rounded-2xl border-0 bg-white mb-12">
  <CardContent className="p-6 sm:p-8">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex-1 min-w-0">
        {t("comments.title")} ({comments.length})
      </h3>
      <Button
        variant="outline"
        onClick={() => setShowComments(!showComments)}
        className="rounded-full bg-transparent text-sm sm:text-base px-4 py-2 min-w-0 flex-shrink"
      >
        <span className="truncate max-w-[180px] sm:max-w-none">
          {showComments ? t("comments.hide") : t("comments.show")} {t("comments.title")}
        </span>
      </Button>
    </div>

    {/* Comment Form */}
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Image
          src="/placeholder.svg?height=40&width=40&text=You"
          alt={t("yourAvatar")}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
        <div className="flex-1 w-full min-w-0">
          <Input
            placeholder={t("comments.placeholder")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="rounded-2xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 mb-3 w-full"
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              {t("comments.note")}
            </p>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full w-full sm:w-auto"
              disabled={!comment.trim()}
            >
              {t("comments.post")}
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Comments List */}
    {showComments && (
      <div className="space-y-5">
        {comments.map((c) => (
          <div key={c.id} className="flex items-start gap-3 sm:gap-4">
            <Image
              src={c.avatar || "/placeholder.svg"}
              alt={c.author}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="bg-gray-50 rounded-2xl p-3 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{c.author}</h4>
                  <span className="text-xs sm:text-sm text-gray-500">{c.date}</span>
                </div>
                <p className="text-gray-700 break-words">{c.content}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                <Button size="sm" variant="ghost" className="p-0 h-auto">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {c.likes}
                </Button>
                <Button size="sm" variant="ghost" className="p-0 h-auto">
                  {t("reply")} ({c.replies})
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>


          {/* Related posts */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t("relatedArticles")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                  <RelatedArticleCard post={post} />
                </Link>
              ))}
            </div>
          </div>

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
                  />
                  <Button className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-6 w-full sm:w-auto">
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
