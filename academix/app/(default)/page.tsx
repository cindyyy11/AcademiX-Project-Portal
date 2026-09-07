export const metadata = {
  title: 'AcademiX',
  description: 'AcademiX: Empowering Education through Seamless Project Collaboration',
}

import Hero from '@/components/landing/hero'
import Features from '@/components/landing/features'
import Newsletter from '@/components/landing/newsletter'
import Zigzag from '@/components/landing/zigzag'
import Testimonials from '@/components/landing/testimonials'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Zigzag />
      <Testimonials />
      <Newsletter />
    </>
  )
}
