import React, { useEffect, useState, useReducer } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectAuth } from './authSlice'
import FieldErrors from '../../components/FieldErrors'
import UserService from '../../services/UserService'

interface FormState {
  values: {
    oldPassword: string
    newPassword: string
    confirmNewPassword: string
  }
  errors: {
    oldPassword: string[],
    newPassword: string[]
    confirmNewPassword: string[]
  }
}

interface FormAction {
  type: string
  value?: string | boolean
}

const initialState: FormState = {
  values: {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  },
  errors: {
    oldPassword: [],
    newPassword: [],
    confirmNewPassword: [],
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

export default function ChangePassword() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, dispatch] = useReducer(reducer, initialState)
  const { user } = useAppSelector(selectAuth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user.username) {
      navigate('/signin')
    }
    document.title = 'Change Password'
  }, [user])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: e.target.name,
      value: e.target.value
    })
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    const userService = new UserService()
    try {
      console.log(form.values)
      const { data } = await userService.updatePassword(form.values)
      dispatch({type: 'setInitialState'})
    } catch(error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          dispatch({type: 'setErrors', value: error.response.data})
        }
      }
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
    <div className="max-w-xl mx-auto">
      <div className="mb-4 border-b border-gray-200">
        <h2 className="py-4 font-bold text-2xl leading-7">
          Change Password
        </h2>
      </div>
      <form method="post" noValidate autoComplete="off" className="space-y-5" onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
            Old password
          </label>
          <div className="mt-1">
            <input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={form.values.oldPassword}
              onChange={handleInputChange}
              className={"block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" + borderClass('oldPassword')}
            />
          </div>
          <FieldErrors errors={form.errors.oldPassword} />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New password
          </label>
          <div className="mt-1">
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={form.values.newPassword}
              onChange={handleInputChange}
              className={"block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm " + borderClass('newPassword')}
            />
          </div>
          <FieldErrors errors={form.errors.newPassword} />
        </div>
        <div>
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
            Confirm new password
          </label>
          <div className="mt-1">
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              value={form.values.confirmNewPassword}
              onChange={handleInputChange}
              className={"block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm " + borderClass('confirmNewPassword')}
            />
          </div>
          <FieldErrors errors={form.errors.confirmNewPassword} />
        </div>
        <div className="flex flex-row-reverse">
          <button
            type="submit"
            className="flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isSubmitting ? 'Saving...' : 'Save new password'}
          </button>
        </div>
      </form>
    </div>
  )
}
