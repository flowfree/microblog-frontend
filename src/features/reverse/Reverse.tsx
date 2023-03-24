import axios, { AxiosInstance } from "axios"
import axiosRetry from "axios-retry"
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectAuth, refreshToken, clearToken } from '../auth/authSlice'
import { store } from "../../app/store"
import BaseService from "../../services/BaseService"

class ReverseAPI extends BaseService {
  reverse(message: string) {
    return this.client.post('/reverse', { message })
  }
}

export default function Reverse() {
  const { user } = useAppSelector(selectAuth)
  const [message, setMessage] = useState('hello, world!!!')
  const [reversed, setReversed] = useState('')
  const [error, setError] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user.username) {
      navigate('/')
    }
  }, [user, navigate])

  function handleLogout(e: React.MouseEvent) {
    e.preventDefault()
    dispatch(clearToken())
    navigate('/')
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setReversed('')
    setError('')
    const reverseAPI = new ReverseAPI()
    reverseAPI
      .reverse(message)
      .then(response => {
        setReversed(response.data.message)
      })
      .catch(error => {
        const message = error.response.data.detail || 'Something went wrong'
        setError(message)
      })
  }

  return (
    <div className="mt-14">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Reverse String
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hi, {user.username}! {' '}
          <a 
            href="#" 
            className="text-indigo-700"
            onClick={handleLogout}
          >
            Logout
          </a>
        </p>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-4 px-4 sm:rounded-lg sm:px-10">
          <form method="POST" autoComplete="off" className="space-y-5" onSubmit={handleFormSubmit}>
            <div>
              <div className="mt-1">
                <input
                  id="message"
                  name="message"
                  type="text"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            {reversed && <p className="text-sm"><code>{reversed}</code></p>}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Reverse
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
