import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  FiBarChart2,
  FiBox,
  FiClipboard,
  FiDollarSign,
  FiHome,
  FiLogOut,
  FiMapPin,
  FiSettings,
  FiShoppingBag,
  FiTruck,
  FiUser,
  FiUsers,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const navByRole = {
  farmer: [
    { to: '/farmer/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/farmer/profile', label: 'Farm Profile', icon: FiMapPin },
    { to: '/farmer/products', label: 'Products', icon: FiShoppingBag },
    { to: '/farmer/orders', label: 'Orders', icon: FiClipboard },
    { to: '/farmer/revenues', label: 'Revenues', icon: FiDollarSign },
  ],
  buyer: [
    { to: '/buyer/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/buyer/search', label: 'Search', icon: FiShoppingBag },
    { to: '/buyer/cart', label: 'Cart', icon: FiBox },
    { to: '/buyer/orders', label: 'Orders', icon: FiClipboard },
    { to: '/buyer/invoices', label: 'Invoices', icon: FiDollarSign },
  ],
  transporter: [
    { to: '/transporter/dashboard', label: 'Dashboard', icon: FiTruck },
  ],
  ministry: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/admin/users', label: 'Users', icon: FiUsers },
    { to: '/admin/products', label: 'Products', icon: FiShoppingBag },
    { to: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
  ],
}

const roleMeta = {
  farmer: {
    label: 'Farmer Workspace',
    subtitle: 'Manage farm operations, products, and buyer orders',
    badge: 'Agri Producer',
  },
  buyer: {
    label: 'Buyer Workspace',
    subtitle: 'Discover products, place orders, and track invoices',
    badge: 'Marketplace Buyer',
  },
  transporter: {
    label: 'Transporter Workspace',
    subtitle: 'Handle missions and keep deliveries moving',
    badge: 'Logistics Operator',
  },
  ministry: {
    label: 'Ministry Workspace',
    subtitle: 'Supervise users, products, and market analytics',
    badge: 'Regulatory Oversight',
  },
}

function UserDisplayName(user) {
  if (!user) return 'User'
  if (user.name) return user.name
  return user.email || 'User'
}

export default function Layout({ role }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const links = navByRole[role] || []
  const meta = roleMeta[role] || {
    label: 'Workspace',
    subtitle: 'Role-based operations',
    badge: 'AgriGov',
  }

  const activeLink = links.find((link) => location.pathname.startsWith(link.to))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-800">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50/70 via-transparent to-transparent" />

      <div className="relative flex min-h-screen">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-emerald-200/70 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 text-white xl:flex">
          <div className="border-b border-white/10 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">AgriGov Platform</p>
            <h2 className="mt-2 text-2xl font-bold">{meta.badge}</h2>
            <p className="mt-2 text-sm text-emerald-100/90">{meta.subtitle}</p>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-5">
            {links.map((link) => {
              const IconComponent = link.icon

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-white/20 text-white shadow-[0_8px_20px_rgba(8,45,24,0.32)]'
                        : 'text-emerald-100/85 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/10 transition group-hover:bg-black/20">
                    <IconComponent className="text-base" />
                  </span>
                  {link.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="border-t border-white/10 px-4 py-4">
            <button
              type="button"
              className="btn-secondary flex w-full items-center justify-center gap-2 px-4 py-2 text-sm"
            >
              <FiSettings />
              Preferences
            </button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-emerald-100/80 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
            <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{meta.badge}</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">{meta.label}</h1>
                <p className="mt-1 text-sm text-slate-600">{activeLink?.label || meta.subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 md:inline-block">
                  {UserDisplayName(user)}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-secondary inline-flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            </div>

            <div className="mx-auto mt-4 flex w-full max-w-7xl gap-2 overflow-x-auto pb-1 xl:hidden">
              {links.map((link) => {
                const IconComponent = link.icon

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-700 to-emerald-500 text-white shadow-md'
                          : 'border border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50'
                      }`
                    }
                  >
                    <IconComponent />
                    {link.label}
                  </NavLink>
                )
              })}
            </div>
          </header>

          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8">
            <Outlet />
          </div>

          <footer className="border-t border-emerald-100 bg-white/90 px-6 py-3 text-xs text-slate-500">
            AgriGov Marketplace © 2026 · Ministry of Agriculture
          </footer>
        </main>
      </div>
    </div>
  )
}
