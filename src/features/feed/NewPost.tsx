import React, { useState } from 'react'

export default function NewPost() {
  const [text, setText] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setText('')
  }

  return (
    <form method="text" action="" noValidate onSubmit={handleSubmit}>
      <textarea
        rows={3}
        value={text}
        onChange={e => setText(e.target.value)}
        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        placeholder="What's happening?"
      >
      </textarea>
      <div className="mt-2 flex items-center">
        <div className="flex-1">
        </div>
        <button
          className="px-5 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold"
        >
          Post
        </button>
      </div>
    </form>
  )
}
