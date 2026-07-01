import { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import router from './components/router/router'

function App() {
  // Online heartbeat: while logged in, ping an authenticated endpoint so the
  // admin's "online now" reflects website users too (not just the app). The
  // request passes through LastSeenJWTAuthentication, which refreshes last_seen.
  useEffect(() => {
    const base = import.meta.env.VITE_BACKEND_BASE
    const ping = () => {
      const token = localStorage.getItem('access_token')
      if (!token || !base) return
      fetch(`${base}/api/me/`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {})
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
