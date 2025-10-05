import { getTranslations } from "next-intl/server"
import { FAQPageContent } from "@/components/faq/faq-page-content"

export default async function FAQPage({ params }: { params: { locale: string } }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "FAQ" })
  const isRTL = locale === "ar"

  return (
    <div className="min-h-screen bg-grey-6" dir={isRTL ? "rtl" : "ltr"}>
      <FAQPageContent />
    </div>
  )
}
