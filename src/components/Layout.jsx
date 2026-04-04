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
  FiUsers,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import BrandLogo from './BrandLogo'
import AgriIllustration from './AgriIllustration'

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
  transporter: [{ to: '/transporter/dashboard', label: 'Dashboard', icon: FiTruck }],
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

function userDisplayName(user) {
  if (!user) return 'User'
  if (user.name) return user.name
  return user.email || 'User'
}

function artVariant(role) {
  if (role === 'ministry') return 'admin'
  return role
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
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/40 via-transparent to-transparent" />
      <div className="absolute left-[-8rem] top-[-6rem] -z-10 h-72 w-72 rounded-full bg-lime-200/40 blur-3xl" />
      <div className="absolute bottom-[-8rem] right-[-6rem] -z-10 h-80 w-80 rounded-full bg-amber-100/45 blur-3xl" />

      <div className="relative flex min-h-screen">
        <aside className="glass-panel hidden w-72 shrink-0 flex-col border-r border-white/50 bg-gradient-to-b from-[#fffdfa]/90 via-[#f6f5ec]/88 to-[#eef5ea]/85 text-slate-800 xl:flex">
          <div className="border-b border-[var(--line)] px-6 py-6">
            <BrandLogo size="sm" />
            <div className="mt-5 rounded-[1.6rem] border border-white/60 bg-white/65 px-4 py-4 shadow-[0_16px_32px_rgba(41,76,54,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{meta.badge}</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{meta.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{meta.subtitle}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-5">
            {links.map((link) => {
              const IconComponent = link.icon

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `group lift-card flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_16px_32px_rgba(53,132,71,0.28)]'
                        : 'text-slate-700 hover:bg-white/80 hover:text-slate-900'
                    }`
                  }
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:scale-105 group-hover:bg-emerald-100">
                    <IconComponent className="text-base" />
                  </span>
                  {link.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="px-4 pb-4">
            <div className="media-shell p-3">
              <AgriIllustration variant={artVariant(role)} className="h-44" />
            </div>
          </div>

          <div className="border-t border-[var(--line)] px-4 py-4">
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
          <header className="glass-panel sticky top-0 z-30 border-b border-white/60 bg-white/70 px-4 py-4 md:px-8">
            <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-4">
              <div className="motion-fade-up">
                <BrandLogo size="sm" className="mb-3 xl:hidden" textClassName="hidden sm:block" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{meta.badge}</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">{meta.label}</h1>
                <p className="mt-1 text-sm text-slate-600">{activeLink?.label || meta.subtitle}</p>
              </div>

              <div className="motion-fade-up motion-delay-1 flex items-center gap-2">
                <span className="badge-soft hidden px-3 py-2 text-sm md:inline-flex">{userDisplayName(user)}</span>
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
                      `inline-flex items-center gap-1.5 whitespace-nowrap rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md'
                          : 'border border-[var(--line)] bg-white/80 text-slate-700 hover:bg-white'
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

          <footer className="border-t border-[var(--line)] bg-white/50 px-6 py-5 text-xs text-slate-500 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <BrandLogo size="sm" />
              <p>AgriGov Market © 2026 · Direct agricultural trade, logistics, and ministry oversight</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
