import React, { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { selectAuth } from './authSlice'
import UserService from '../../services/UserService'

interface FormState {
  values: {
    name: string
    website: string
    bio: string
  }
  errors: {
    name: string[],
    website: string[]
    bio: string[]
  }
}

interface FormAction {
  type: string
  value?: string | boolean
}

const initialState: FormState = {
  values: {
    name: '',
    website: '',
    bio: '',
  },
  errors: {
    name: [],
    website: [],
    bio: [],
  }
}

function reducer(state: FormState, action: FormAction) {
  let newstate = JSON.parse(JSON.stringify(state))
  if (action.type === 'setErrors') {
    newstate.errors = action.value
  } else if (action.type === 'setInitialState') {
    return initialState
  } else if (action.type in state.values) {
    newstate.values[action.type] = action.value
  } else {
    throw new Error()
  }
  return newstate
}

export default function EditProfile() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, dispatch] = useReducer(reducer, initialState)
  const { user } = useAppSelector(selectAuth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user.username) {
      navigate('/signin')
    }
    getUserProfile()
    document.title = 'Edit Profile'
  }, [user])

  async function getUserProfile() {
    const userService = new UserService()
    try {
      const { data } = await userService.getUserProfile()
      for (let key in data) {
        dispatch({type: key, value: data[key]})
      }
    } catch(error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) {
    dispatch({
      type: e.target.name,
      value: e.target.value
    })
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    const userService = new UserService()
    try {
      setIsSubmitting(true)
      const { data } = await userService.updateUserProfile(form.values)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          dispatch({type: 'setErrors', value: error.response.data})
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function borderClass(field: string): string {
    if (field in form.errors) {
      return form.errors[field].length ? ' border-red-500 ' : ' border-gray-300 '
    } else {
      return ''
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 border-b border-gray-200">
        <h2 className="py-4 font-bold text-2xl leading-7">
          Edit Your Profile
        </h2>
      </div>
      <form method="post" noValidate autoComplete="off" className="space-y-5" onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="mt-1">
            <input
              id="name"
              name="name"
              type="text"
              value={form.values.name}
              onChange={handleInputChange}
              className={"block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" + borderClass('name')}
            />
          </div>
          <FieldErrors errors={form.errors.name} />
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Website
          </label>
          <div className="mt-1">
            <input
              id="website"
              name="website"
              type="text"
              value={form.values.website}
              onChange={handleInputChange}
              className={"block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm " + borderClass('website')}
            />
          </div>
          <FieldErrors errors={form.errors.website} />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <div className="mt-1">
            <textarea
              id="bio"
              name="bio"
              rows={2}
              value={form.values.bio}
              onChange={handleInputChange}
              className={"block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm " + borderClass('bio')}
            ></textarea>
          </div>
          <FieldErrors errors={form.errors.bio} />
        </div>
        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className="flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isSubmitting ? 'Saving Profile...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}

function FieldErrors({ errors }: { errors: string[] }) {
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
