export type PostType = "explore" | "offer" | "product" | "service" | "event"

export type PostAdFormValues = {
  type: PostType | null
  images: File[]
  title: string
  description: string
  locationSameAsProfile: boolean
  showPhoneInAd: boolean
  phone: string
  sellerKind: "store" | "individual"
  city?: string
  neighborhood?: string
}
