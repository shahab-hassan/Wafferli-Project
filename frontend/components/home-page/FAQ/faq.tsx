// components/FAQ.tsx
import { cn } from "@/lib/utils"
import { useLocale, useTranslations } from "next-intl"
import FAQButtons from "./FAQButton"

const FAQ = () => {
  const t = useTranslations("faq")
  const locale = useLocale()
  const isRTL = locale === "ar"

  const faqs = [
    {
      question: t("questions.redeemDeals"),
      answer: t("answers.redeemDeals"),
    },
    {
      question: t("questions.validity"),
      answer: t("answers.validity"),
    },
    {
      question: t("questions.giftCards"),
      answer: t("answers.giftCards"),
    },
    {
      question: t("questions.joinBusiness"),
      answer: t("answers.joinBusiness"),
    },
  ]

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
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="mb-4 bg-card rounded-md overflow-hidden border border-border"
            >
              <summary className="flex justify-between items-center w-full p-4 text-start cursor-pointer bg-background transition-colors duration-200 hover:bg-muted/50">
                <span className="text-medium-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <span
                  className={cn(
                    "text-primary transition-transform duration-300 flex-shrink-0"
                  )}
                >
                  <svg
                    className="transform transition-transform duration-300 details-open:rotate-180"
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
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <FAQButtons />
      </div>
    </div>
  )
}

export default FAQ
