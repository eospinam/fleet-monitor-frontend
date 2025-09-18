import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin } from '../services/auth'
import { createConnection } from '../services/signalr'

const AuthContext = createContext(null)

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  try { return atob(str) } catch { return null }
}

function parseJwt(token) {
  if(!token) return null
  const parts = token.split('.')
  if(parts.length !== 3) return null
  const payload = parts[1]
  const json = base64UrlDecode(payload)
  if(!json) return null
  try { return JSON.parse(decodeURIComponent(escape(json))) } catch { 
    try { return JSON.parse(json) } catch { return null }
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(token ? parseJwt(token) : null)
  const [hub, setHub] = useState(null)

  useEffect(() => {
    if(token){
      localStorage.setItem('token', token)
      setUser(parseJwt(token))
      
      const conn = createConnection(token)
      conn.start().then(() => {
        console.log('SignalR connected')
      }).catch(e => console.warn('SignalR failed to connect', e))
      setHub(conn)
      return () => {
        conn.stop().catch(()=>{})
      }
    } else {
      localStorage.removeItem('token')
      setUser(null)
      if(hub) {
        hub.stop().catch(()=>{})
        setHub(null)
      }
    }
    
  }, [token])

  const login = async (username, password) => {
    const res = await apiLogin(username, password)
    const t = res.data.token
    const u = parseJwt(t) 
    setToken(t)
    setUser(u)
    return u
  }

  const logout = () => setToken(null)

  const isAdmin = () => user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ token, setToken, user, login, logout, isAdmin, hub }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
