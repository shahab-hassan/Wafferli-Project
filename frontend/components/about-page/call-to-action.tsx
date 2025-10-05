"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import { Download, MessageCircle } from "lucide-react"
export default function CallToActionSection() {
  const t = useTranslations("callToAction")
  const [email, setEmail] = useState("")
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription logic here
    console.log("Newsletter subscription:", email)
    setEmail("")
  }
  return (
    <section className="flex relative h-[470px] justify-center items-center bg-white overflow-hidden">
      <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-yellow-400 rounded-full md:w-[500px] md:h-[500px]"></div>
      <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-yellow-400 rounded-full md:w-[500px] md:h-[500px]"></div>
      <div className="w-full  max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                  <h2 className="text-h3 md:text-h2 font-bold text-grey-1 mb-6">{t("title")}</h2>
          <p className="text-small-regular text-grey-3 md:text-medium-regular mb-8 max-w-2xl mx-auto">
            {t("description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 rtl:flex-row-reverse">
            <Button
            variant="secondary"
              size="lg"
              className="text-black font-semibold rounded-full px-8"
            >
              <Download className="ltr:mr-2 rtl:ml-2 h-5 w-5" />
              {t("downloadApp")}
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 font-semibold rounded-full px-8 border border-grey-5"
            >
              <MessageCircle className="ltr:mr-2 rtl:ml-2 h-5 w-5" />
              {t("partnerWithUs")}
            </Button>
          </div>
          {/* Newsletter Signup */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 rtl:flex-row-reverse">
              <Input
                type="email"
                placeholder={t("newsletter.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full px-6 py-3 bg-white text-gray-800 placeholder:text-gray-500 border-grey-5"
                required
              />
              <Button 
                type="submit"
                className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-full px-6 font-semibold"
              >
                {t("newsletter.subscribe")}
              </Button>
            </form>
          </div>
        </div>
    </section>
  )
}