// File responsibility: Acts as the controller layer between React views and API/model service functions.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { clearStoredTokens, loginUser, registerUser } from '../models/authModel'

// login handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const login = (credentials) => loginUser(credentials)
// register handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const register = (payload) => registerUser(payload)
// logout handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const logout = () => clearStoredTokens()
