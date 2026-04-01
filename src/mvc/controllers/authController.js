import { clearStoredTokens, loginUser, registerUser } from '../models/authModel'

export const login = (credentials) => loginUser(credentials)
export const register = (payload) => registerUser(payload)
export const logout = () => clearStoredTokens()
