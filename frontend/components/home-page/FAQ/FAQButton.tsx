
"use client"

import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/common/button"
import WhatsappButton from "../../common/footer/WhatsappButton"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

const FAQButtons = () => {
  const t = useTranslations("faq")
  const locale = useLocale()
  const isRTL = locale === "ar"

  return (
    <div className="mt-12 text-center" dir={isRTL ? "rtl" : "ltr"}>
      <p className="text-small-semibold mb-4 text-foreground">
        {t("stillHaveQuestions")}
      </p>

      <div className="flex justify-center gap-4 flex-wrap">
        <WhatsappButton />

        {/* Force re-render when locale changes */}
        <div className="flex justify-center" key={locale}>
          {isRTL ? (
            <Link href="/faq" >
            <Button
              variant="outline"
              leadingIcon={<ChevronRight className="w-4 h-4 rotate-180" />}
              className="px-4 sm:px-6 text-sm sm:text-base"
            >
              {t("viewAll")}
            </Button>
            </Link >

          ) : (
             <Link href="/faq" >
            <Button
              variant="outline"
              trailingIcon={<ChevronRight className="w-4 h-4" />}
              className="px-4 sm:px-6 text-sm sm:text-base"
            >
              {t("viewAll")}
            </Button>
            </Link >

          )}
        </div>
      </div>
    </div>
  )
}

export default FAQButtons
