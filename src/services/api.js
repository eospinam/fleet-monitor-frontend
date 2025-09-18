import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5110'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})


api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if(token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
}, err => Promise.reject(err))


api.interceptors.response.use(r => r, err => {
  if(err.response?.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  return Promise.reject(err)
})

export default api
