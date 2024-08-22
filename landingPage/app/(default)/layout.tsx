'use client'

import { useEffect } from 'react'

import AOS from 'aos'
import 'aos/dist/aos.css'

import PageIllustration from '@/components/page-illustration'
import Footer from '@/components/ui/footer'

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {  

  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone', // Remove phone specific settings
      duration: 600,
      easing: 'ease-out-sine',
    })
  })

  return (
    <div className="hidden md:block"> {/* Only render for desktop */}
      <main className="grow">

        <PageIllustration />

        {children}

      </main>

      <Footer />
    </div>
  )
}
