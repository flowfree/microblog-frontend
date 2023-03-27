import React, { useState, useEffect } from 'react'
import { 
  Routes, 
  Route,
  Navigate
} from 'react-router-dom'
import { useAppDispatch } from './app/hooks'
import { refreshToken } from './features/account/authSlice'
import SignIn from "./features/account/SignIn"
import SignUp from "./features/account/SignUp"
import Reverse from './features/reverse/Reverse'
import Feed from './features/feed/Feed'
import EditProfile from './features/account/EditProfile'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(refreshToken(() => {
      setIsLoading(false)
    }))
  }, [])

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace={true} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reverse" element={<Reverse />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/edit_profile" element={<EditProfile />} />
      </Routes>
    </div>
  )
}

export default App
