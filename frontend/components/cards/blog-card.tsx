import { Calendar, Clock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/common/button"
import { useLocale, useTranslations } from "next-intl"

export interface BlogCardProps {
  id: string
  title: string
  description: string
  image: string
  date: string
  readTime: string
  className?: string
}

export function BlogCard({
  id,
  title,
  description,
  image,
  date,
  readTime,
  className,
}: BlogCardProps) {
  const locale = useLocale()
  const t = useTranslations("Blog") // reuse Blog translations
  const isRTL = locale === "ar"

  return (
    <div
      className={cn(
        "group relative w-[340px] h-[440px] bg-white rounded-[12px] overflow-hidden border border-grey-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        className,
      )}
    >
      {/* Image Section */}
      <div className="relative h-[145px] overflow-hidden bg-grey-5">
        <img
          src={image || "/placeholder.svg?height=145&width=340&query=blog post"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4 h-[295px] flex flex-col">
        {/* Date and Read Time */}
        <div className="flex items-center gap-4 text-grey-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span className="text-smaller-regular">{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="text-smaller-regular">{readTime}</span>
          </div>
        </div>

        {/* Title */}
        <p className="text-large-semibold text-black-1 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
          {title}
        </p>

        {/* Description */}
        <p className="text-normal-regular text-grey-2 line-clamp-4 leading-relaxed flex-1">
          {description}
        </p>

        {/* Read More Button */}
        <div className="pt-2">
          {isRTL ? (
            <Button
              variant="outline"
              leadingIcon={<ChevronRight className="w-4 h-4 rotate-180" />}
              className="w-full justify-center"
            >
              {t("readMore")}
            </Button>
          ) : (
            <Button
              variant="outline"
              trailingIcon={<ChevronRight className="w-4 h-4" />}
              className="w-full justify-center"
            >
              {t("readMore")}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
