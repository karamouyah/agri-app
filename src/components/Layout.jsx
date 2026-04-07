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
import ThemeToggle from './ThemeToggle'
import { Card, StatusBadge, buttonStyles, cn } from './ui'

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
    { to: '/buyer/profile', label: 'Profile', icon: FiMapPin },
    { to: '/buyer/search', label: 'Browse', icon: FiShoppingBag },
    { to: '/buyer/cart', label: 'Cart', icon: FiBox },
    { to: '/buyer/orders', label: 'Orders', icon: FiClipboard },
    { to: '/buyer/invoices', label: 'Invoices', icon: FiDollarSign },
  ],
  transporter: [
    { to: '/transporter/dashboard', label: 'Dashboard', icon: FiTruck },
    { to: '/transporter/profile', label: 'Profile', icon: FiMapPin },
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
    subtitle: 'Manage listings, orders, and revenue with a cleaner operating view.',
    badge: 'Producer',
    variant: 'farmer',
  },
  buyer: {
    label: 'Buyer Workspace',
    subtitle: 'Source verified produce, place orders, and track every step.',
    badge: 'Marketplace',
    variant: 'buyer',
  },
  transporter: {
    label: 'Transporter Workspace',
    subtitle: 'Accept missions, update deliveries, and keep logistics moving.',
    badge: 'Logistics',
    variant: 'transporter',
  },
  ministry: {
    label: 'Ministry Workspace',
    subtitle: 'Review users, govern products, and monitor market performance.',
    badge: 'Oversight',
    variant: 'admin',
  },
}

function userDisplayName(user) {
  if (!user) return 'Workspace User'
  return user.name || user.email || 'Workspace User'
}

export default function Layout({ role }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const links = navByRole[role] || []
  const meta = roleMeta[role] || roleMeta.farmer
  const activeLink = links.find((link) => location.pathname.startsWith(link.to))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,_rgba(167,243,208,0.45),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(240,253,244,0.85),_transparent_32%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.55),_transparent_28%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-[290px] shrink-0 xl:block">
          <Card className="sticky top-4 flex min-h-[calc(100vh-2rem)] flex-col p-5">
            <BrandLogo size="sm" />

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-5 text-white shadow-[0_20px_45px_rgba(22,101,52,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-50/90">{meta.badge}</p>
              <h2 className="mt-3 text-2xl font-bold">{meta.label}</h2>
              <p className="mt-3 text-sm leading-6 text-emerald-50/90">{meta.subtitle}</p>
            </div>

            <nav className="mt-6 space-y-2">
              {links.map((link) => {
                const Icon = link.icon

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200',
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/40'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50',
                      )
                    }
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-base shadow-sm ring-1 ring-emerald-100 transition duration-200 group-hover:scale-105 dark:bg-slate-800 dark:ring-slate-700">
                      <Icon />
                    </span>
                    {link.label}
                  </NavLink>
                )
              })}
            </nav>

            <div className="mt-6 media-frame">
              <AgriIllustration variant={meta.variant} className="h-56" />
            </div>

            <div className="mt-auto space-y-3 pt-6">
              <Card className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Session</p>
                <p className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">{userDisplayName(user)}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email || 'Signed in'}</p>
              </Card>
              <button type="button" className={cn(buttonStyles.secondary, 'w-full justify-center')}>
                <FiSettings />
                Preferences
              </button>
            </div>
          </Card>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <Card className="sticky top-4 z-30 px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <BrandLogo size="sm" className="xl:hidden" textClassName="hidden sm:block" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">{meta.badge}</p>
                  <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">{meta.label}</h1>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{activeLink?.label || meta.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={role === 'ministry' ? 'verified' : 'active'} />
                <ThemeToggle />
                <Card className="hidden px-4 py-2 md:block">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{userDisplayName(user)}</p>
                </Card>
                <button type="button" onClick={handleLogout} className={buttonStyles.secondary}>
                  <FiLogOut />
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 xl:hidden">
              {links.map((link) => {
                const Icon = link.icon

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition duration-200',
                        isActive
                          ? 'bg-emerald-600 text-white shadow-[0_12px_24px_rgba(22,101,52,0.16)] dark:bg-emerald-500 dark:text-slate-950'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/60 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-500/40 dark:hover:bg-slate-700 dark:hover:text-slate-50',
                      )
                    }
                  >
                    <Icon />
                    {link.label}
                  </NavLink>
                )
              })}
            </div>
          </Card>

          <div className="flex-1 px-0 py-6">
            <Outlet />
          </div>

          <footer className="px-1 pb-4">
            <Card className="flex flex-col gap-3 px-5 py-4 text-sm text-slate-500 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
              <BrandLogo size="sm" />
              <p>Fresh sourcing, logistics visibility, and operational oversight in one professional agri workspace.</p>
            </Card>
          </footer>
        </main>
      </div>
    </div>
  )
}
