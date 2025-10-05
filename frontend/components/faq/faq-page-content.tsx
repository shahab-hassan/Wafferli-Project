"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Search, ChevronDown, MessageCircle, Phone, Mail, Home, ChevronRight } from "lucide-react"
import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const categories = [
  { id: "all", label: "All" },
  { id: "account", label: "Account & Profile" },
  { id: "using", label: "Using Wafferli" },
  { id: "business", label: "For Businesses" },
  { id: "technical", label: "Technical Support" },
  { id: "general", label: "General" },
]

export function FAQPageContent() {
  const locale = useLocale()
  const t = useTranslations("FAQ")
  const isRTL = locale === "ar"

  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const faqItems: FAQItem[] = [
    {
      id: "1",
      question: t("questions.createAccount"),
      answer: t("answers.createAccount"),
      category: "account",
    },
    {
      id: "2",
      question: t("questions.findDeals"),
      answer: t("answers.findDeals"),
      category: "using",
    },
    {
      id: "3",
      question: t("questions.redeemDeals"),
      answer: t("answers.redeemDeals"),
      category: "using",
    },
    {
      id: "4",
      question: t("questions.marketplace"),
      answer: t("answers.marketplace"),
      category: "using",
    },
    {
      id: "5",
      question: t("questions.joinBusiness"),
      answer: t("answers.joinBusiness"),
      category: "business",
    },
  ]

  const filteredFAQs = faqItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const getCategoryColor = (categoryId: string) => {
    const colors = {
      account: "bg-purple-100 text-purple-700",
      using: "bg-blue-100 text-blue-700",
      business: "bg-green-100 text-green-700",
      technical: "bg-orange-100 text-orange-700",
      general: "bg-gray-100 text-gray-700",
    }
    return colors[categoryId as keyof typeof colors] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="w-full">

      <section className="w-full bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="max-w-[1120px] mx-auto py-6 text-center">
            <div className="mb-4 flex justify-center">
              <Image
                src="/faq-illustration.svg"
                alt="FAQ Illustration"
                width={200}
                height={120}
                className="max-w-full h-auto"
              />
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl mb-2">{t("title")}</h1>

            <div className="bg-grey-6 py-3 px-4 rounded-lg mb-4 max-w-3xl mx-auto">
              <p className="text-sm sm:text-base text-grey-2 max-w-xl mx-auto">
                {t("subtitle")} <button className="text-primary underline">{t("contactUs")}</button>
              </p>
            </div>

            <div className="max-w-3xl mx-auto mb-4">
              <div className="relative">
                <Search
                  className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 text-grey-3 w-4 h-4 sm:w-5 sm:h-5",
                    isRTL ? "right-4" : "left-4",
                  )}
                />
                <Input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full h-10 sm:h-12 bg-white border border-grey-4 rounded-full text-sm sm:text-base",
                    isRTL ? "pr-12 text-right" : "pl-12",
                  )}
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "rounded-full px-3 py-1 h-8 text-xs sm:text-sm min-w-[100px] sm:min-w-[110px]",
                    activeCategory === category.id
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-white text-grey-2 border-grey-4 hover:bg-grey-5",
                  )}
                >
                  {t(`categories.${category.id}`)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-grey-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="max-w-[1120px] mx-auto pb-6">
            <div className="space-y-3">
              {filteredFAQs.map((item) => (
                <div key={item.id} className="bg-white border border-grey-5 rounded-lg overflow-hidden">
                  <div className="px-4 pt-3">
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 rounded-full text-xs sm:text-sm",
                        getCategoryColor(item.category),
                      )}
                    >
                      {t(`categories.${item.category}`)}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className={cn(
                      "w-full px-4 py-3 text-left flex items-center justify-between hover:bg-grey-5/50 transition-colors",
                      isRTL ? "text-right flex-row-reverse" : "",
                    )}
                  >
                    <h3 className="text-sm sm:text-base font-semibold text-grey-1 flex-1">{item.question}</h3>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5 text-grey-3 transition-transform",
                        expandedItems.includes(item.id) ? "rotate-180" : "",
                        isRTL ? "mr-3" : "ml-3",
                      )}
                    />
                  </button>

                  {expandedItems.includes(item.id) && (
                    <div className="px-4 pb-4">
                      <p
                        className={cn(
                          "text-sm sm:text-base text-grey-2 leading-relaxed",
                          isRTL ? "text-right" : "text-left",
                        )}
                      >
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-grey-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pb-6">
          <div className="max-w-[1120px] mx-auto">
            <div className="bg-gradient-to-r from-primary to-secondary text-white py-8 px-4 sm:px-6 rounded-xl">
              <div className="text-center">
                <h2 className="text-lg sm:text-xl mb-3">{t("stillNeedHelp")}</h2>
                <p className="text-sm sm:text-base mb-6 opacity-90">{t("supportDescription")}</p>

                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <Button
                    variant="secondary"
                    className="bg-white text-primary hover:bg-grey-5 px-6 py-3 h-10 rounded-full flex items-center gap-1.5 font-semibold text-sm sm:text-base"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t("liveChat")}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary px-6 py-3 h-10 rounded-full flex items-center gap-1.5 bg-transparent font-semibold text-sm sm:text-base"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t("contactUs")}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary px-6 py-3 h-10 rounded-full flex items-center gap-1.5 bg-transparent font-semibold text-sm sm:text-base"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t("callUs")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}