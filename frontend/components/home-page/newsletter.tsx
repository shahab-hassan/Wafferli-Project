"use client" // Added for state management

import { useState } from "react"
import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import { Label } from "@/components/common/label"
import { useLocale, useTranslations } from "next-intl"
import axios from "axios" // Added axios

const Newsletter: React.FC = () => {
  const t = useTranslations("newsletter")
  const locale = useLocale()
  const isRTL = locale === "ar"

  // Added state and loading handler
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}admin/settings/subscribe`, {
        email: email,
      })
      if (data.success) {
        alert("Subscribed successfully!")
        setEmail("")
      }
    } catch (error: any) {
      alert(error?.response?.data?.error || "Failed to subscribe")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full overflow-hidden min-h-[468px] bg-gradient-to-b from-[#F9FAFB] to-[#FAF5FF]">
      {/* Background SVGs remain unchanged... */}
      <svg className="absolute left-0 top-0 h-full w-1/2 sm:w-2/3 md:w-auto pointer-events-none z-0" viewBox="0 0 806 401" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M251.5 104.5C185.1 258.9 -55.8333 366.167 -168 400.5L-175 -84L805.563 -91.9883C647.493 -90.5843 317.699 -49.4321 251.5 104.5Z" fill="#E71E86" />
      </svg>
      <svg className="absolute right-0 top-0 h-full w-1/2 sm:w-2/3 md:w-auto pointer-events-none z-0" viewBox="0 0 765 456" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M554.5 296C620.9 141.6 861.833 34.3333 974 0L981 484.5L0.436547 492.488C158.507 491.084 488.301 449.932 554.5 296Z" fill="#762C85" />
      </svg>

      <div className="relative z-10 max-w-[1120px] mx-auto px-4 py-12 flex flex-col items-center text-center" dir={isRTL ? "rtl" : "ltr"}>
        {/* Icon and Text remain unchanged... */}
        <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[75px] md:h-[75px] bg-tertiary rounded-full flex justify-center items-center mb-4">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.536 42C20.8871 42.608 21.392 43.1129 22.0001 43.464C22.6082 43.815 23.2979 43.9998 24 43.9998C24.7021 43.9998 25.3919 43.815 25.9999 43.464C26.608 43.1129 27.1129 42.608 27.464 42" stroke="#762C85" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            <path d="M6.524 30.652C6.26273 30.9384 6.09031 31.2945 6.02771 31.677C5.96512 32.0596 6.01504 32.4521 6.17142 32.8068C6.32779 33.1615 6.58387 33.4631 6.90851 33.6749C7.23316 33.8868 7.61236 33.9997 8 34H40C40.3876 34.0001 40.7669 33.8876 41.0917 33.6762C41.4166 33.4648 41.673 33.1635 41.8298 32.809C41.9866 32.4546 42.037 32.0622 41.9749 31.6796C41.9128 31.297 41.7409 30.9407 41.48 30.654C38.82 27.912 36 24.998 36 16C36 12.8174 34.7357 9.76516 32.4853 7.51472C30.2349 5.26428 27.1826 4 24 4C20.8174 4 17.7652 5.26428 15.5147 7.51472C13.2643 9.76516 12 12.8174 12 16C12 24.998 9.178 27.912 6.524 30.652Z" stroke="#762C85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="text-lg sm:text-xl md:text-h3 text-foreground mb-2">{t("title")}</h2>
        <p className="text-xs sm:text-sm md:text-base text-grey-3 max-w-[600px] mb-6 px-2">{t("subtitle")}</p>

        {/* Updated Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center w-full max-w-[500px] gap-3 sm:gap-2">
          <Label htmlFor="newsletter-email" className="sr-only">{t("emailLabel")}</Label>
          <Input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("placeholder")}
            className="w-full sm:flex-1 h-11 px-4 sm:px-6 bg-white border border-grey-5 text-foreground placeholder:text-grey-3 focus:border-primary rounded-full"
          />
          <Button
            type="submit"
            disabled={loading}
            variant="secondary"
            className="h-11 px-6 w-full sm:w-auto flex justify-center border border-tertiary sm:border-0"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            {loading ? "..." : t("subscribe")}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Newsletter