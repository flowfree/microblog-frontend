import { createSlice } from '@reduxjs/toolkit'
import { RootState, AppThunk } from '../../app/store'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

const baseURL = process.env.REACT_APP_API_BASE_URL

interface JWTClaim {
  userId: string
  username: string
}

interface AuthState {
  user: JWTClaim
  accessToken: string
  refreshToken: string
}

interface AuthState {
  user: JWTClaim
  accessToken: string
  refreshToken: string
}

const initialState: AuthState = {
  user: {
    userId: '',
    username: ''
  },
  accessToken: '',
  refreshToken: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      const { access, refresh } = action.payload
      const { userId, username } = jwt_decode<JWTClaim>(access)
      state.user = { userId, username }
      state.accessToken = access
      state.refreshToken = refresh
      if (refresh) {
        window.localStorage.setItem('refresh', refresh)
      }
    },
    clearToken: () => {
      window.localStorage.removeItem('refresh')
      return initialState
    }
  }
})

export const { setToken, clearToken } = authSlice.actions

export const refreshToken = 
  (next: () => void): AppThunk => 
  (dispatch) => {
    const refresh = localStorage.getItem('refresh')
    next = next || function(){}
    if (refresh) {
      axios
        .post(`${baseURL}/auth/token/refresh`, { refresh })
        .then(response => {
          dispatch(setToken(response.data))
        })
        .catch(error => {
          dispatch(clearToken())
        })
        .then(next)
    } else {
      dispatch(clearToken())
      next()
    }
  }

export const selectAuth = (state: RootState) => state.auth

export default authSlice.reducer
