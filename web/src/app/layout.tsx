import './globals.css'

import { ReactNode } from 'react'

import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from 'next/font/google'

import { Hero } from '@/components/Hero'
import { Profile } from '@/components/Profile'
import { SignIn } from '@/components/SignIn'
import { Copyright } from '@/components/Copyright'
import { isUserAuthenticated } from '@/lib/auth'

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' })
const baiJamjuree = BaiJamjuree({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bai-jamjuree',
})

export const metadata = {
  title: 'NLW - Spacetime',
  description:
    'Uma cápsula do tempo construída com NextJS, Prisma, SQLite e Fastify',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${baiJamjuree.variable} bg-gray-900 font-sans text-green-100`}
      >
        <main className="grid min-h-screen grid-cols-2">
          <div className="relative  flex flex-1 flex-col items-start justify-between overflow-hidden border-r border-white/10 bg-[url(../assets/starts.svg)] bg-cover px-28 py-6">
            <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-700 opacity-70 blur-full" />
            <div className="absolute bottom-0 right-2 top-0 w-2 bg-stripes" />

            {isUserAuthenticated() ? <Profile /> : <SignIn />}

            <Hero />

            <Copyright />
          </div>
          <div className="flex max-h-screen flex-col overflow-y-scroll bg-[url(../assets/starts.svg)] bg-cover scrollbar-thin scrollbar-track-gray-500 scrollbar-thumb-gray-100">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
