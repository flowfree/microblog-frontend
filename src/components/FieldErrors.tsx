import React from 'react'

export default function FieldErrors({ errors }: { errors: string[] }) {
  if (errors && errors.length == 1) {
    return (
      <div className="mt-1 text-sm text-red-500">
        <p>{errors[0]}</p>
      </div>
    )
  } else if (errors && errors.length) {
    return (
      <ul className="mt-1 ml-5 text-sm text-red-500 list-disc">
        {errors.map(error => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    )
  } else {
    return null
  }
}
