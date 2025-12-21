"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import type { Metadata } from "next"

export default function PrivacyPage(): JSX.Element {
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}admin/settings/terms-privacy`
        )
        if (data.success) {
          setContent(data.privacyPolicy || "<p>No privacy policy available at this time.</p>")
        }
      } catch (error) {
        console.error("Failed to fetch privacy policy:", error)
        setContent("<p>Failed to load privacy policy. Please try again later.</p>")
      } finally {
        setLoading(false)
      }
    }

    fetchPrivacyPolicy()
  }, [])

  return (
    <main className="min-h-screen bg-white/90 py-16 px-6 sm:px-10 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-purple-600">Wafferli — Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-600">How we collect, use, and protect your data.</p>
          <nav className="mt-4 flex gap-4">
            <Link href="/terms" className="text-pink-500 hover:underline text-sm">
              Terms &amp; Conditions
            </Link>
            <Link href="/" className="text-gray-500 hover:underline text-sm">
              Home
            </Link>
          </nav>
        </header>

        <section className="text-gray-800 leading-relaxed prose prose-lg max-w-none">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </section>
      </div>
    </main>
  )
}