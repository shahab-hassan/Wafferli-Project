import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions — Wafferli",
  description: "Terms and Conditions for Wafferli — an all-in-one platform for products, services and businesses.",
}

export default function TermsPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-white/90 py-16 px-6 sm:px-10 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-purple-600">Wafferli — Terms &amp; Conditions</h1>
          <p className="mt-2 text-sm text-gray-600">Minimal, clear terms for using Wafferli.</p>
          <nav className="mt-4 flex gap-4">
            <Link href="/privacy-policy" className="text-pink-500 hover:underline text-sm">Privacy Policy</Link>
            <Link href="/" className="text-gray-500 hover:underline text-sm">Home</Link>
          </nav>
        </header>

        <section className="space-y-6 text-gray-800 leading-relaxed">
          <p>
            Welcome to <strong>Wafferli</strong>. These Terms &amp; Conditions ("Terms") govern your access to and use of our platform, which
            connects users with products, services, and businesses.
          </p>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">1. Acceptance</h2>
            <p className="mt-2">By using Wafferli you agree to these Terms. If you disagree, do not use the service.</p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">2. Using Wafferli</h2>
            <p className="mt-2">You may browse, purchase, list, and manage products or services subject to platform rules. You are responsible for information you provide.</p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">3. Accounts &amp; Payments</h2>
            <p className="mt-2">Accounts must be accurate. Payments are processed by third-party payment providers — their terms apply in addition to these Terms.</p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">4. Intellectual Property</h2>
            <p className="mt-2">All Wafferli content is owned by or licensed to Wafferli. You may not reproduce our brand or content without permission.</p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">5. Disclaimers &amp; Liability</h2>
            <p className="mt-2">We provide the platform "as is". To the extent permitted by law, Wafferli is not liable for indirect or consequential damages.</p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">6. Termination</h2>
            <p className="mt-2">We may suspend or terminate accounts for breach of these Terms or suspected abuse.</p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">7. Governing Law</h2>
            <p className="mt-2">These Terms are governed by the laws applicable to Wafferli’s jurisdiction. Disputes will be resolved in applicable courts.</p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">8. Contact</h2>
            <p className="mt-2">Questions? Reach out to <a href="mailto:legal@wafferli.example" className="text-pink-500 hover:underline">legal@wafferli.example</a>.</p>
          </article>

          <p className="text-sm text-gray-500">Last updated: <time dateTime="2025-09-24">September 24, 2025</time></p>
        </section>
      </div>
    </main>
  )
}
