import { api } from '@/lib/api'
import { getToken } from '@/lib/auth'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import Image from 'next/image'

dayjs.locale(ptBR)

interface Memory {
  id: string
  createdAt: string
  content: string
  coverUrl: string
}

export default async function Page({ params }: { params: { slug: string } }) {
  const response = await api.get(`/memories/${params.slug}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })

  const memory: Memory = response.data

  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timelime
      </Link>

      {memory && (
        <>
          <hr />
          <div className="space-y-4">
            <time className="flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
              {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
            </time>
            <Image
              src={memory.coverUrl}
              alt=""
              width={592}
              height={280}
              className="aspect-video w-full rounded-lg object-cover"
            />
            <div className="text-lg leading-relaxed text-gray-100">
              {memory.content}
            </div>

            <Link
              href={`/memories/${memory.id}`}
              className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-300"
            >
              Ler mais <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
