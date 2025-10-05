"use client"

import * as React from "react"

type Data = {
  businessType?: "individual" | "business"
  name?: string
  description?: string
  logo?: File | null
  website?: string
  city?: string
  neighborhood?: string
  category?: string
  facebook?: string
  instagram?: string
  gallery?: File[]
}

type Ctx = {
  data: Data
  setData: (partial: Partial<Data>) => void
}

const OnboardingCtx = React.createContext<Ctx | null>(null)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setState] = React.useState<Data>({})
  const setData = (partial: Partial<Data>) => setState((prev) => ({ ...prev, ...partial }))
  return <OnboardingCtx.Provider value={{ data, setData }}>{children}</OnboardingCtx.Provider>
}

export function useOnboarding() {
  const ctx = React.useContext(OnboardingCtx)
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider")
  return ctx
}
