import { apiClient } from './api-client.js'
import { API_PATHS } from '../config/api-paths.js'

const buildProfilePath = (userId) =>
  userId
    ? API_PATHS.profile.root(userId)
    : API_PATHS.auth.profile ?? '/auth/perfil'

// Auth API agrupada
export const authApi = {
  // POST /auth/login
  login: async (payload) => {
    const res = await apiClient.public.post(API_PATHS.auth.login, payload)
    return res?.data ?? res
  },

  // POST /auth/register
  register: async (payload) => {
    const res = await apiClient.public.post(API_PATHS.auth.register, payload)
    return res?.data ?? res
  },

  // GET /auth/profile (requiere token)
  profile: async (userId) => {
    const endpoint = buildProfilePath(userId)
    const res = await apiClient.private.get(endpoint)
    return res?.data ?? res
  },

  // POST /auth/forgot-password (envía email)
  requestPasswordReset: async (email) => {
    const res = await apiClient.public.post(
      API_PATHS.auth.forgot ?? '/auth/forgot-password',
      { email },
    )
    return res?.data ?? res
  },

  // POST /auth/reset-password (token + nueva password)
  resetPassword: async ({ token, password }) => {
    const res = await apiClient.public.post(
      API_PATHS.auth.reset ?? '/auth/reset-password',
      { token, password },
    )
    return res?.data ?? res
  },
}

// (Opcional) Exponer funciones con nombre si te gusta ese estilo:
export const requestPasswordReset = authApi.requestPasswordReset
export const resetPassword = authApi.resetPassword
