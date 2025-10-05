"use client"

import { Phone, MapPin, Globe, Facebook, Instagram, MessageCircle, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Button } from "@/components/common/button"
import { useTranslations } from "next-intl"
import Link from "next/link"

interface BusinessSidebarProps {
  business: {
    id: string
    name: string
    memberSince: string
    activeAds: number
    description: string
    phone: string
    address: string
    website: string
    facebook: boolean
    instagram: string
  }
}

export default function BusinessSidebar({ business }: BusinessSidebarProps) {
  const t = useTranslations('profile')

  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="w-16 h-16 bg-muted rounded-full mx-auto"></div>
        <Link href={`/profile/business/${business.id}`}>
          <h3 className="text-center font-bold text-lg">{business.name}</h3>
        </Link>
        <p className="text-center text-sm text-muted-foreground">{t("memberSince")} {business.memberSince}</p>
        <p className="text-center text-sm text-muted-foreground">{t("activeAds")}: {business.activeAds}</p>
        <p className="text-sm text-muted-foreground text-center">{business.description}</p>
        <div className="space-y-2 text-primary text-sm">
          <div className="flex items-center justify-start">
            <Phone className="w-4 h-4 mr-2" />
            {business.phone}
          </div>
          <div className="flex items-center justify-start">
            <MapPin className="w-4 h-4 mr-2" />
            {business.address}
          </div>
          <div className="flex items-center justify-start">
            <Globe className="w-4 h-4 mr-2" />
            {business.website}
          </div>
        </div>
        <div className="flex justify-center space-x-3">
          <button className="p-2 bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center">
            <Facebook className="w-4 h-4" />
          </button>
          <button className="p-2 bg-pink-100 text-secondary rounded-full w-8 h-8 flex items-center justify-center">
            <Instagram className="w-4 h-4" />
          </button>
        </div>
        <Button variant="primary" className="w-full rounded-full">
          <MessageCircle className="w-4 h-4 mr-2" />
          {t("chat")}
        </Button>
        <button className="w-full text-primary flex items-center justify-center text-sm">
          <ChevronUp className="w-4 h-4 mr-2" />
          {t("directions")}
        </button>
      </CardContent>
    </Card>
  )
}