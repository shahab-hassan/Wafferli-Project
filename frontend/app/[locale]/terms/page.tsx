"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import type { Metadata } from "next"

export default function TermsPage(): JSX.Element {
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}admin/settings/terms-privacy`
        )
        if (data.success) {
          setContent(data.terms || "<p>No terms available at this time.</p>")
        }
      } catch (error) {
        console.error("Failed to fetch terms:", error)
        setContent("<p>Failed to load terms. Please try again later.</p>")
      } finally {
        setLoading(false)
      }
    }

    fetchTerms()
  }, [])

  return (
    <main className="min-h-screen bg-white/90 py-16 px-6 sm:px-10 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-purple-600">Wafferli — Terms &amp; Conditions</h1>
          <p className="mt-2 text-sm text-gray-600">Terms and conditions for using Wafferli platform.</p>
          <nav className="mt-4 flex gap-4">
            <Link href="/privacy-policy" className="text-pink-500 hover:underline text-sm">
              Privacy Policy
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