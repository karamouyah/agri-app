// File responsibility: Holds small frontend helper functions used by routes, formatting, or display logic.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

export const ROLE_DASHBOARD = {
  farmer: '/farmer/dashboard',
  buyer: '/buyer/dashboard',
  transporter: '/transporter/dashboard',
  ministry: '/admin/dashboard',
}

export const PENDING_DOCUMENT_PATHS = {
  buyer: '/buyer/documents',
  transporter: '/transporter/documents',
}

export const isPendingUser = (user) => user?.approvalStatus === 'pending' || user?.status === 'pending'

export const getEntryPath = (user) => {
  if (isPendingUser(user) && PENDING_DOCUMENT_PATHS[user?.role]) {
    return PENDING_DOCUMENT_PATHS[user.role]
  }
  return getDashboardPath(user?.role)
}

// getDashboardPath handles this module workflow, using its parameters and returning JSX, data, or a service result.
export const getDashboardPath = (role) => ROLE_DASHBOARD[role] || '/login'
