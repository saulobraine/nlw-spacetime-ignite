import Link from 'next/link'

export function EmptyMemories() {
  return (
    <div className="flex flex-1 items-center justify-center p-16">
      <p className="w-[360px] text-center leading-relaxed text-gray-100">
        Você ainda não registrou nenhuma lembrança comece a{' '}
        <Link
          href="/memories/new"
          className="underline transition-all hover:text-gray-50"
        >
          criar agora!
        </Link>
      </p>
    </div>
  )
}
