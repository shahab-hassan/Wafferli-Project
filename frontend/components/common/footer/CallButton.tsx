'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

const CallButton: React.FC = () => {
  const t = useTranslations('footer')
  
  const handleCallClick = () => {
    // Replace with your actual phone number
    const phoneNumber = '+96512345678'
    window.location.href = `tel:${phoneNumber}`
  }

  return (
    <button
      onClick={handleCallClick}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-grey-5 text-grey-1 bg-white rounded-[100px] hover:bg-grey-5/50 transition-colors duration-200 text-normal-regular"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
      {t('buttons.call')}
    </button>
  )
}

export default CallButton