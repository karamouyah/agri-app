export const ROLE_DASHBOARD = {
  farmer: '/farmer/dashboard',
  buyer: '/buyer/dashboard',
  transporter: '/transporter/dashboard',
  ministry: '/admin/dashboard',
}

export const getDashboardPath = (role) => ROLE_DASHBOARD[role] || '/login'
