"use client"

import { useRouter } from "next/navigation"
import { UploadDropzone } from "@/components/seller/upload-dropzone"
import { StepFooter } from "@/components/seller/step-input"
import { useOnboarding } from "@/contexts/onboarding-context"
import { SellerHero } from "@/components/seller/hero-panel"
import { useRole } from "@/contexts/roleContext"
import { ComboSelect } from "@/components/seller/combo-select"
import { IconLink } from "@/components/seller/social-input"
import { useState } from "react"

const CITIES = ["Kuwait City", "Hawally", "Salmiya", "Farwaniya", "Jahra"]
const NEIGHBORHOODS = {
  "Kuwait City": ["Sharq", "Dasman", "Qibla", "Mirqab"],
  Hawally: ["Bayan", "Jabriya", "Rumaithiya"],
  Salmiya: ["Block 10", "Marina", "Salmiya Center"],
  Farwaniya: ["Khaitan", "Al-Dajeej"],
  Jahra: ["Naeem", "Al-Qaser"],
} as const

const CATEGORIES = ["Food & Beverage", "Clothing", "Beauty", "Electronics", "Services"]


export default function Step3() {
  const router = useRouter()
  const { data, setData } = useOnboarding()
  const { role, toggleRole } = useRole(); // new: use role context
    const [logo, setLogo] = useState<File | null>(null)
    const [city, setCity] = useState<string>(data.city || "")
     const [neighborhood, setNeighborhood] = useState<string>(data.neighborhood || "")
    const [category, setCategory] = useState<string>(data.category || "")
    const [facebook, setFacebook] = useState<string>(data.facebook || "")
    const [instagram, setInstagram] = useState<string>(data.instagram || "")
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1220px] w-full mx-auto mt-10 mb-10 px-4">
      <div>
        <SellerHero stepIndex={0} />
      </div>
      <div>
     <div>
        <h2 className="text-xl font-semibold text-[var(--brand-ink)]">Images</h2>
        <p className="mt-1 text-sm text-[color-mix(in oklab, var(--brand-ink) 55%, white)]">
          For the cover picture we recommend using the landscape mode.
        </p>
      </div>

      <UploadDropzone onFiles={(files) => setData({ gallery: files })} multiple large />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <UploadDropzone onFiles={() => {}} className="h-16" />
        <UploadDropzone onFiles={() => {}} className="h-16" />
        <UploadDropzone onFiles={() => {}} className="h-16" />
      </div>

              <ComboSelect label="Category" items={CATEGORIES} value={category} onChange={setCategory} />
      
              <div className="space-y-3">
                <span className="text-base font-semibold text-[var(--brand-ink)]">Socials</span>
                <IconLink platform="facebook" placeholder="Enter Facebook URL" value={facebook} onChange={setFacebook} />
                <IconLink platform="instagram" placeholder="Enter Instagram URL" value={instagram} onChange={setInstagram} />
              </div>

      <StepFooter
        onNext={() => { toggleRole(); router.push("/");}}
        nextLabel="Continue"
      />
      </div>
    </div>
  )
}
