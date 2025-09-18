import api from './api'

export const register = (username, password, role = 'user') =>
  api.post('/api/auth/register', { username, password, role })

export const login = (username, password) =>
  api.post('/api/auth/login', { username, password })
