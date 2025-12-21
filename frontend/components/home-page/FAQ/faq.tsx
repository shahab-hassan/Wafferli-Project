"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useLocale, useTranslations } from "next-intl"
import FAQButtons from "./FAQButton"
import axios from "axios"

interface FAQItem {
  _id: string
  question: string
  answer: string
}

const FAQ = () => {
  const t = useTranslations("faq") // Ensure the namespace matches your JSON
  const locale = useLocale()
  const isRTL = locale === "ar"

  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}faq/all`)
        if (response.data.success) {
          // Taking only the first 4 or 5 for the home page to keep it clean
          setFaqs(response.data.faqs.slice(0, 5))
        }
      } catch (error) {
        console.error("Failed to fetch FAQs for home page:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [])

  return (
    <div className="w-full bg-gradient-to-b from-[#F9FAFB] to-[#FAF5FF] py-16">
      <div className="max-w-[1120px] mx-auto px-4 md:px-6">
        <div className="text-center mb-12" dir={isRTL ? "rtl" : "ltr"}>
          <h4 className="text-h4 mb-2 text-foreground">{t("title")}</h4>
          <p className="text-medium-regular text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div dir={isRTL ? "rtl" : "ltr"}>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            faqs.map((faq) => (
              <details
                key={faq._id}
                className="group mb-4 bg-card rounded-md overflow-hidden border border-border"
              >
                <summary className="flex justify-between items-center w-full p-4 text-start cursor-pointer bg-background transition-colors duration-200 hover:bg-muted/50 list-none">
                  <span className="text-medium-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  <span className="text-primary flex-shrink-0">
                    <svg
                      className="transform transition-transform duration-300 group-open:rotate-180"
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="p-4 pt-0 text-muted-foreground text-normal-regular bg-background">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              </details>
            ))
          )}
        </div>

        <FAQButtons />
      </div>
    </div>
  )
}

export default FAQ