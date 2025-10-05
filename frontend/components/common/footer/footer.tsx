import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import WhatsappButton from './WhatsappButton'
import CallButton from './CallButton'

const Footer: React.FC = () => {
  const locale = useLocale()
  const t = useTranslations('footer')
  const isRTL = locale === 'ar'

  const footerLinks = {
    customers: [
      { key: 'browseDeals', href: '/offers' },
      { key: 'flashDeals', href: '/flashdeals' },
      { key: 'mobileApps', href: '/apps' },
      { key: 'helpCenter', href: '/contact' }
    ],
    businesses: [
      { key: 'partnerWithUs', href: '/contact' },
      { key: 'pricingPlans', href: '/for-businesses' }
    ],
    company: [
      { key: 'aboutWafferli', href: '/about' },
      { key: 'blogNews', href: '/blog' },
      { key: 'contactUs', href: '/contact' },
      { key: 'faqs', href: '/faq' },
    ]
  }

  return (
    <footer className="bg-white max-w-[1440px] w-full border-t border-grey-5 mx-auto">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            
            {/* Logo and Description Section */}
            <div className="md:col-span-2 lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="relative w-24 h-12 sm:w-30 sm:h-15">
                  <Image
                    src="/Logo.png"
                    alt={t('logo.alt')}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <p className="text-normal-regular text-grey-2 leading-relaxed text-center md:text-left max-w-sm mx-auto md:mx-0">
                {t('description')}
              </p>

              <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                <WhatsappButton />
                <CallButton />
              </div>
            </div>

            {/* Mobile: Stack all link sections vertically */}
            {/* For Customers Section */}
            <div className="md:col-span-1 lg:col-span-2 text-center md:text-left">
              <h3 className="text-normal-bold text-grey-1 mb-3 sm:mb-4 pb-2 border-b border-grey-5 md:border-b-0">
                {t('sections.customers')}
              </h3>
              <nav className="space-y-2 sm:space-y-3">
                {footerLinks.customers.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    className="block text-small-regular sm:text-normal-regular text-grey-2 hover:text-primary transition-colors duration-200 py-1"
                  >
                    {t(`links.${link.key}`)}
                  </Link>
                ))}
              </nav>
            </div>

            {/* For Businesses Section */}
            <div className="md:col-span-1 lg:col-span-2 text-center md:text-left">
              <h3 className="text-normal-bold text-grey-1 mb-3 sm:mb-4 pb-2 border-b border-grey-5 md:border-b-0">
                {t('sections.businesses')}
              </h3>
              <nav className="space-y-2 sm:space-y-3">
                {footerLinks.businesses.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    className="block text-small-regular sm:text-normal-regular text-grey-2 hover:text-primary transition-colors duration-200 py-1"
                  >
                    {t(`links.${link.key}`)}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Company Section */}
            <div className="md:col-span-2 lg:col-span-2 text-center md:text-left">
              <h3 className="text-normal-bold text-grey-1 mb-3 sm:mb-4 pb-2 border-b border-grey-5 md:border-b-0">
                {t('sections.company')}
              </h3>
              <nav className="space-y-2 sm:space-y-3">
                {footerLinks.company.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    className="block text-small-regular sm:text-normal-regular text-grey-2 hover:text-primary transition-colors duration-200 py-1"
                  >
                    {t(`links.${link.key}`)}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

          {/* Bottom Section */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 mb-4 max-w-[1440px] w-full border-t border-grey-5">
            <div className={`flex max-w-[1020px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex-col sm:flex-row justify-between items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <p className="text-small-regular text-grey-3 text-center sm:text-left order-2 sm:order-1">
                {t('copyright', { year: new Date().getFullYear() })}
              </p>
              
              <div className={`flex gap-4 sm:gap-6 order-1 sm:order-2 flex-wrap justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link
                  href="/privacy"
                  className="text-small-regular text-grey-3 hover:text-primary transition-colors duration-200 whitespace-nowrap"
                >
                  {t('legal.privacy')}
                </Link>
                <span className="text-grey-5 hidden sm:inline">|</span>
                <Link
                  href="/terms"
                  className="text-small-regular text-grey-3 hover:text-primary transition-colors duration-200 whitespace-nowrap"
                >
                  {t('legal.terms')}
                </Link>
                <span className="text-grey-5 hidden sm:inline">|</span>
                <Link
                  href="/cookies"
                  className="text-small-regular text-grey-3 hover:text-primary transition-colors duration-200 whitespace-nowrap"
                >
                  {t('legal.cookies')}
                </Link>
              </div>
            </div>
          </div>

          
    </footer>
  )
}

export default Footer