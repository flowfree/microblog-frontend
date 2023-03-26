import { useState, useEffect } from 'react'
import { 
  Routes, 
  Route,
  Navigate
} from 'react-router-dom'
import { useAppDispatch } from './app/hooks'
import { refreshToken } from './features/auth/authSlice'
import SignIn from "./features/auth/SignIn"
import SignUp from "./features/auth/SignUp"
import Reverse from './features/reverse/Reverse'
import Feed from './features/feed/Feed'

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
      </Routes>
    </div>
  )
}

export default App
