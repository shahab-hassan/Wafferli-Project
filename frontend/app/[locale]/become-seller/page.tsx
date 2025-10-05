"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { BusinessTypeToggle } from "@/components/seller/segmented-conteol"
import { UploadDropzone } from "@/components/seller/upload-dropzone"
import { StepFooter } from "@/components/seller/step-input"
import { useOnboarding } from "@/contexts/onboarding-context"
import { TextCounter } from "@/components/seller/text-counter"
import { IconLink } from "@/components/seller/social-input"
import { Input } from "@/components/common/input"
import { SellerHero } from "@/components/seller/hero-panel"
import { ComboSelect } from "@/components/seller/combo-select"

const CITIES = ["Kuwait City", "Hawally", "Salmiya", "Farwaniya", "Jahra"]
const NEIGHBORHOODS = {
  "Kuwait City": ["Sharq", "Dasman", "Qibla", "Mirqab"],
  Hawally: ["Bayan", "Jabriya", "Rumaithiya"],
  Salmiya: ["Block 10", "Marina", "Salmiya Center"],
  Farwaniya: ["Khaitan", "Al-Dajeej"],
  Jahra: ["Naeem", "Al-Qaser"],
} as const

const CATEGORIES = ["Food & Beverage", "Clothing", "Beauty", "Electronics", "Services"]

export default function Step1() {
  const router = useRouter()
  const { data, setData } = useOnboarding()
  const [name, setName] = useState(data.name || "")
  const [desc, setDesc] = useState(data.description || "")
  const [type, setType] = useState<"individual" | "business">(data.businessType || "business")
  const [website, setWebsite] = useState(data.website || "")
  const [logo, setLogo] = useState<File | null>(null)
  const [city, setCity] = useState<string>(data.city || "")
   const [neighborhood, setNeighborhood] = useState<string>(data.neighborhood || "")
  const [category, setCategory] = useState<string>(data.category || "")
  const [facebook, setFacebook] = useState<string>(data.facebook || "")
  const [instagram, setInstagram] = useState<string>(data.instagram || "")


  const neighborhoods = useMemo(() => (NEIGHBORHOODS as any)[city] ?? [], [city])
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1220px] w-full mx-auto mt-10 mb-10 px-4">
      <div>
        <SellerHero />
      </div>
      <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--brand-ink)] mb-2">Business Type</h2>
        <div className="sr-only" aria-live="polite">
          {type}
        </div>
      </div>

      <BusinessTypeToggle value={type} onChange={(v) => setType(v)} leftLabel="Individual" rightLabel="Business" />

      {type =='business' && (
        <>
        <div className="space-y-4 mt-2">
                      <label className="block text-sm font-medium text-[var(--brand-ink)]">
                          Name*
                          <Input placeholder="Enter your Store Name" value={name} onChange={(e) => setName(e.target.value)} />
                      </label>

                      <label className="block text-sm font-medium text-[var(--brand-ink)]">
                          Description*
                          <TextCounter value={desc} max={512} className="mt-2">
                              <textarea
                                  className="h-28 w-full resize-none rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3 text-[var(--brand-ink)] placeholder:text-[color-mix(in oklab, var(--brand-ink) 35%, white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in oklab, var(--brand-primary) 40%, white)]"
                                  placeholder="Enter the description of your business"
                                  value={desc}
                                  onChange={(e) => setDesc(e.target.value)}
                                  maxLength={512} />
                          </TextCounter>
                      </label>

                      <div className="space-y-2">
                          <span className="text-sm font-medium text-[var(--brand-ink)]">Logo</span>
                          <UploadDropzone onFiles={(files) => setLogo(files[0] || null)} multiple={false} />
                      </div>

                      <label className="block text-sm font-medium text-[var(--brand-ink)]">
                          Website URL
                          <IconLink icon="external-link" placeholder="Enter Website URL" value={website} onChange={setWebsite} />
                      </label>
                  </div><StepFooter
                          onNext={() => {
                              setData({ businessType: type, name, description: desc, website, logo })
                              router.push("/become-seller/business-details")
                          } }
                          nextLabel="Continue" /></>)}
        {type =='individual' && (
            <>
                  <div className="space-y-4">
        <div>
          <span className="text-base font-semibold text-[var(--brand-ink)]">Location*</span>
          <div className="mt-3 flex flex-col gap-3 md:flex-row">
            <ComboSelect
              label="City"
              items={CITIES}
              value={city}
              onChange={(v) => {
                setCity(v)
                setNeighborhood("")
              }}
            />
            <ComboSelect label="Neighbourhood" items={neighborhoods} value={neighborhood} onChange={setNeighborhood} />
          </div>
        </div>

        <ComboSelect label="Category" items={CATEGORIES} value={category} onChange={setCategory} />

        <div className="space-y-3">
          <span className="text-base font-semibold text-[var(--brand-ink)]">Socials</span>
          <IconLink platform="facebook" placeholder="Enter Facebook URL" value={facebook} onChange={setFacebook} />
          <IconLink platform="instagram" placeholder="Enter Instagram URL" value={instagram} onChange={setInstagram} />
        </div>
      </div>

      <StepFooter
        onNext={() => {
          setData({ businessType: type, city, neighborhood, category, facebook, instagram })
          router.push("/become-seller/payment-details")
        }}
        nextLabel="Continue"
        onBack={() => router.back()}
      />
      </>
    )
}
</div>
    </div>
  )
}

