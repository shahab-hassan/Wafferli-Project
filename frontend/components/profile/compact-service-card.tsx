"use client"

import { Star } from "lucide-react"
import { useTranslations } from "next-intl"

interface CompactServiceCardProps {
  id: string
  rating: number
  badges: string[]
  title: string
  desc: string
}

export default function MarketplaceCompactServiceCard(props: CompactServiceCardProps) {
  const t = useTranslations('profile')

  return (
    <div className="bg-background rounded-lg overflow-hidden border border-border">
      <div className="h-32 bg-muted relative flex items-center justify-center">
        <div className="w-20 h-20 bg-white rounded-full opacity-50"></div>
      </div>
      <div className="p-3 space-y-1">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span className="font-bold text-sm">{props.rating}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {props.badges.map((badge, i) => (
            <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? 'bg-green-100 text-green-800' : 'bg-primary/10 text-primary'}`}>
              {badge}
            </span>
          ))}
        </div>
        <h4 className="font-semibold text-sm">{props.title}</h4>
        <p className="text-xs text-muted-foreground">{props.desc}</p>
      </div>
    </div>
  )
}