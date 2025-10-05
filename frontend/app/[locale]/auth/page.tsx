import { getTranslations } from "next-intl/server"
import { AuthPageContent } from "@/components/auth/auth-page-content"

export default async function AuthPage({ params }: { params: { locale: string } }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Auth" })
  const isRTL = locale === "ar";

  return (
    <div className="overflow-hidden flex flex-col justify-center items-center min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <main className="max-w-[1440px] w-full flex flex-col justify-center items-center flex-1">
        <AuthPageContent />
      </main>
    </div>
  )
}