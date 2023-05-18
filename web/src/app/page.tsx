import { User, CalendarPlus } from 'lucide-react'
import Image from 'next/image'

import nlwLogo from '../assets/logo.svg'

export default function Home() {
  return (
    <main className="grid min-h-screen grid-cols-2">
      <div className="relative flex flex-col items-start justify-between overflow-hidden border-r border-white/10 bg-[url(../assets/starts.svg)] bg-cover px-28 py-64">
        <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-700 opacity-70 blur-full" />
        <div className="absolute bottom-0 right-2 top-0 w-2 bg-stripes" />

        <a
          href=""
          className="flex items-center gap-3 text-left transition-all hover:text-gray-50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <p className="max-w-[140px] text-sm leading-snug">
            <span className="underline">Crie sua conta</span> e salve suas
            memórias!
          </p>
        </a>

        <div className="space-y-5">
          <Image src={nlwLogo} alt="Spacetime Logo" />

          <div className="max-w-[420px] space-y-1">
            <h1 className="text-[2.5rem] font-bold leading-tight text-gray-50">
              Sua cápsula do tempo
            </h1>
            <p className="text-lg leading-relaxed text-gray-100">
              Colecione momentos marcantes da sua jornada e compartilhe (se
              quiser) com o mundo!
            </p>
          </div>

          <a
            href=""
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black duration-1000 ease-out hover:rounded-2xl hover:bg-black hover:text-green-500 hover:duration-500"
          >
            <CalendarPlus size={15} /> CADASTRAR LEMBRANÇA
          </a>
        </div>

        <div className="text-sm leading-relaxed text-gray-200">
          Feito com 💜 no NLW da{' '}
          <a
            className="underline hover:text-gray-100"
            href="https://rocketseat.com.br"
            target="_blank"
            rel="noreferrer"
          >
            Rocketseat
          </a>
        </div>
      </div>
      <div className="flex flex-col bg-[url(../assets/starts.svg)] bg-cover p-16 ">
        <div className="flex flex-1 items-center justify-center">
          <p className="w-[360px] text-center leading-relaxed">
            Você ainda não registrou nenhuma lembrança comece a{' '}
            <a href="" className="underline transition-all hover:text-gray-50">
              criar agora!
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
