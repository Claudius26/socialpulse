import { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { useDispatch } from 'react-redux'
import router from './components/router/router'
import { refreshAccessToken } from './features/auth/authSlice'
import { getUserAccess } from './features/auth/token'

function App() {
  const dispatch = useDispatch()

  // On boot, restore the session from the HttpOnly refresh cookie so a reload
  // keeps a signed-in user signed in (the in-memory access token starts empty).
  // Only attempt it when a profile from a previous session is present, so guests
  // don't generate needless 401s.
  useEffect(() => {
    if (localStorage.getItem('user')) dispatch(refreshAccessToken())
  }, [dispatch])

  // Online heartbeat: while logged in, ping an authenticated endpoint so the
  // admin's "online now" reflects website users too. Auth rides the HttpOnly
  // access cookie (credentials: include) plus the in-memory token when present.
  useEffect(() => {
    const base = import.meta.env.VITE_BACKEND_BASE
    const ping = () => {
      if (!base || !localStorage.getItem('user')) return
      const token = getUserAccess()
      fetch(`${base}/api/me/`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).catch(() => {})
    }
    ping()
    const id = setInterval(ping, 120000) // every 2 minutes
    return () => clearInterval(id)
  }, [])

  return (
    <RouterProvider router={router} />
  )
}

export default App
