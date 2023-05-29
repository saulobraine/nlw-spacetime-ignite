'use client'

import { useState } from 'react'

export default function TextArea() {
  const [countCharacters, setCountCharacters] = useState(0)

  return (
    <>
      <textarea
        name="content"
        spellCheck={false}
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-4 text-lg leading-relaxed text-gray-100 transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-gray-100"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        onChange={(e) => setCountCharacters(e.target.value.length)}
      />
      <span className="min-h-[16px] text-xs text-gray-100">
        {countCharacters > 0 ? `${countCharacters} caracteres` : null}
      </span>
    </>
  )
}
