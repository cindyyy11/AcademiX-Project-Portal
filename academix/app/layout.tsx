import './css/style.css'

import { Roboto_Flex } from 'next/font/google'
import Header from '@/components/landing/ui/header'

const roboto = Roboto_Flex({
  weight: ['400', '500', '700', '800'],
  subsets: ['latin'],
  display: 'block',
  variable: '--font-roboto',
})

export const metadata = {
  title: 'AcademiX',
  description: 'AcademiX: Empowering Education through Seamless Project Collaboration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="font-sans antialiased bg-background text-n-1">
        <div className="flex flex-col min-h-screen overflow-hidden">
          <Header />
          {children}
        </div>
      </body>
    </html>
  )
}
 