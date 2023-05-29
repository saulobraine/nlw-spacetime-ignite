/* eslint-disable jsx-a11y/alt-text */
'use client'

import { Image } from 'lucide-react'
import MediaPicker from './MediaPicker'
import TextArea from './TextArea'
import { FormEvent } from 'react'
import Cookie from 'js-cookie'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function NewMemoryForm() {
  const router = useRouter()

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const fileToUpload = formData.get('media')

    let coverUrl = ''

    if (fileToUpload) {
      const uploadFormData = new FormData()

      uploadFormData.set('file', fileToUpload)

      const uploadResponde = await api.post('/upload', uploadFormData)

      coverUrl = uploadResponde.data.fileUrl
    }

    await api.post(
      '/memories',
      {
        coverUrl,
        content: formData.get('content'),
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${Cookie.get('token')}`,
        },
      },
    )

    router.push('/')
  }

  return (
    <form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-gray-200 hover:text-gray-100"
        >
          <Image className="h-4 w-4" />
          Anexar mídia
        </label>

        <label
          htmlFor="isPublic"
          className="flex cursor-pointer items-center gap-1.5 text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            value="true"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500 outline-none focus:ring-0"
          />
          Tornar memória pública
        </label>
      </div>

      <MediaPicker />

      <div className="flex flex-1 flex-col gap-2">
        <TextArea />
      </div>

      <button
        type="submit"
        className="items-center gap-2 self-end rounded-xl bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black duration-1000 ease-out hover:rounded-2xl hover:bg-black hover:text-green-500 hover:duration-500"
      >
        Salvar
      </button>
    </form>
  )
}
