import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — Wafferli",
  description: "Wafferli Privacy Policy. How we collect, use, and protect your data.",
}

export default function PrivacyPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-white/90 py-16 px-6 sm:px-10 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-purple-600">Wafferli — Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-600">Minimal privacy details — clear and focused.</p>
          <nav className="mt-4 flex gap-4">
            <Link href="/terms" className="text-pink-500 hover:underline text-sm">Terms &amp; Conditions</Link>
            <Link href="/" className="text-gray-500 hover:underline text-sm">Home</Link>
          </nav>
        </header>

        <section className="space-y-6 text-gray-800 leading-relaxed">
          <p>
            At <strong>Wafferli</strong> we value your privacy. This policy explains what we collect, why, and how you can manage your data.
          </p>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">1. Information We Collect</h2>
            <ul className="mt-2 list-disc pl-5">
              <li>Account details (name, email, profile).</li>
              <li>Transaction and order information.</li>
              <li>Usage data (pages visited, actions).</li>
            </ul>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">2. How We Use Data</h2>
            <p className="mt-2">To provide and improve services, process payments, communicate with users, and comply with legal obligations.</p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">3. Cookies &amp; Tracking</h2>
            <p className="mt-2">We use cookies and third-party analytics. You can manage cookie preferences in your browser and account settings.</p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">4. Third Parties</h2>
            <p className="mt-2">We may share data with service providers (payments, hosting, analytics). Third parties have their own privacy practices.</p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">5. Your Rights</h2>
            <p className="mt-2">You can access, update, export, or request deletion of your personal data. Contact us at <a href="mailto:privacy@wafferli.example" className="text-pink-500 hover:underline">privacy@wafferli.example</a>.</p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">6. Data Security &amp; Retention</h2>
            <p className="mt-2">We take reasonable measures to protect data. We retain information as needed for business and legal purposes.</p>
          </article>

          <article>
            <h2 className="text-lg font-semibold text-purple-600">7. Changes</h2>
            <p className="mt-2">We may update this policy. We’ll post the revised date here and, when required, notify users directly.</p>
          </article>

          <p className="text-sm text-gray-500">Last updated: <time dateTime="2025-09-24">September 24, 2025</time></p>
        </section>
      </div>
    </main>
  )
}
