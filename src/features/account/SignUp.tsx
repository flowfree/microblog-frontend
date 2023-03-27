import axios from 'axios'
import React, { useEffect, useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { setToken, selectAuth } from './authSlice'

interface FormState {
  values: {
    username: string
    email: string
    password: string
    password2: string
    agreement: boolean
  }
  errors: {
    username: string[],
    email: string[]
    password: string[]
    password2: string[],
    agreement: string[]
  }
}

interface FormAction {
  type: string
  value?: string | boolean
}

const initialState: FormState = {
  values: {
    username: '',
    email: '',
    password: '',
    password2: '',
    agreement: false
  },
  errors: {
    username: [],
    email: [],
    password: [],
    password2: [],
    agreement: []
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

export default function SignUp() {
  const [form, dispatch] = useReducer(reducer, initialState)
  const { user } = useAppSelector(selectAuth)
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (user.username) {
      navigate('/reverse')
    }
  }, [user])

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const baseURL = process.env.REACT_APP_API_BASE_URL
    axios 
      .post(`${baseURL}/account/signup`, form.values)
      .then(response => {
        dispatch({type: 'setInitialState'})
        appDispatch(setToken(response.data))
      })
      .catch(error => {
        if (error.response.status === 400) {
          dispatch({type: 'setErrors', value: error.response.data})
        }
      })
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: e.target.name,
      value: e.target.value
    })
  }

  function borderClass(field: string) {
    if (field in form.errors) {
      return form.errors[field].length ? ' border-red-500 ' : ' border-gray-300 '
    } else {
      return ''
    }
  }

  return (
    <div className="mt-14">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account? Please{' '}
          <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in
          </Link>
        </p>
      </div>
      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:rounded-lg sm:px-10">
          <form method="POST" noValidate autoComplete="off" className="space-y-5" onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.values.username}
                  onChange={handleInputChange}
                  className={"block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" + borderClass('username')}
                />
              </div>
              <FieldErrors errors={form.errors.username} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.values.email}
                  onChange={handleInputChange}
                  className={"block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" + borderClass('email')}
                />
              </div>
              <FieldErrors errors={form.errors.email} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.values.password}
                  onChange={handleInputChange}
                  className={"block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" + borderClass('password')}
                />
              </div>
              <FieldErrors errors={form.errors.password} />
            </div>
            <div>
              <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  value={form.values.password2}
                  onChange={handleInputChange}
                  className={"block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" + borderClass('password2')}
                />
              </div>
              <FieldErrors errors={form.errors.password2} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <input
                  id="agreement"
                  name="agreement"
                  type="checkbox"
                  onChange={e => dispatch({type: 'agreement', value: e.target.checked})} 
                  className="h-4 w-4 mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="agreement" className="ml-2 block text-sm text-gray-900 leading-6">
                  I have read and agree with the {' '}
                  <a href="#" className="text-indigo-500">Terms of Use</a> 
                  {' '} and {' '}
                  <a href="#" className="text-indigo-500">Privacy Policy</a>.
                </label>
              </div>
            </div>
            <FieldErrors errors={form.errors.agreement} />

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign Up
              </button>
            </div>

          </form>
        </div>
      </div>
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
