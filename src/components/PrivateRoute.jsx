// File responsibility: Defines a reusable React UI component shared across pages.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath, PENDING_DOCUMENT_PATHS, isPendingUser } from '../utils/roleRoutes'

export default function PrivateRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  if (isPendingUser(user)) {
    const allowedPendingPath = PENDING_DOCUMENT_PATHS[user.role]
    if (!allowedPendingPath) {
      return <Navigate to="/login" replace />
    }
    if (location.pathname !== allowedPendingPath) {
      return <Navigate to={allowedPendingPath} replace />
    }
  }

  return <Outlet />
}
