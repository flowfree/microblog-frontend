import axios, { AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'
import { store } from '../app/store'
import { refreshToken } from '../features/account/authSlice'

const baseURL = process.env.REACT_APP_API_BASE_URL

class BaseService {
  client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL,
      headers: {'Content-Type': 'application/json'}
    })

    this.client.interceptors.request.use(
      config => {
        const { accessToken } = store.getState().auth
        if (accessToken && config.headers) {
          config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
      },
      error => (Promise.reject(error))
    )

    axiosRetry(this.client, {
      retries: 7,
      retryDelay: () => 1000,
      retryCondition: (error) => {
        const { status } = error.response || {}
        if (status === 401) {
          const { user } = store.getState().auth
          if (!user.username) {
            return false
          }
          store.dispatch(refreshToken(() => true))
        } else if (status && (status >= 400 && status <= 499)) {
          // Bad request etc
          return false
        } else if (status && (status >= 500)) {
          // Internal server errors
          return false
        }
        return true
      }
    })
  }
}

export default BaseService
