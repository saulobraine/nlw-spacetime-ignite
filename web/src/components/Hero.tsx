import Image from 'next/image'
import { CalendarPlus } from 'lucide-react'

import nlwLogo from '../assets/logo.svg'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="space-y-5">
      <Image src={nlwLogo} alt="Spacetime Logo" />

      <div className="max-w-[420px] space-y-1">
        <h1 className="text-[2.5rem] font-bold leading-tight text-gray-50">
          Sua cápsula do tempo
        </h1>
        <p className="text-lg leading-relaxed text-gray-100">
          Colecione momentos marcantes da sua jornada e compartilhe (se quiser)
          com o mundo!
        </p>
      </div>

      <Link
        href="/memories/new"
        className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black duration-1000 ease-out hover:rounded-2xl hover:bg-black hover:text-green-500 hover:duration-500"
      >
        <CalendarPlus size={15} /> CADASTRAR LEMBRANÇA
      </Link>
    </div>
  )
}
