"use client"

import { Phone, MapPin, MessageCircle, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/common/shadecn-card"
import { Button } from "@/components/common/button"
import { useTranslations } from "next-intl"

interface UserSidebarProps {
  user: {
    name: string
    memberSince: string
    activeAds: number
    phone: string
    address: string
  }
}

export default function UserSidebar({ user }: UserSidebarProps) {
  const t = useTranslations('profile')

  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="w-16 h-16 bg-muted rounded-full mx-auto"></div>
        <h3 className="text-center font-bold text-lg">{user.name}</h3>
        <p className="text-center text-sm text-muted-foreground">{t("memberSince")} {user.memberSince}</p>
        <p className="text-center text-sm text-muted-foreground">{t("activeAds")}: {user.activeAds}</p>
        <div className="space-y-2 text-primary text-sm">
          <div className="flex items-center justify-start">
            <Phone className="w-4 h-4 mr-2" />
            {user.phone}
          </div>
          <div className="flex items-center justify-start">
            <MapPin className="w-4 h-4 mr-2" />
            {user.address}
          </div>
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