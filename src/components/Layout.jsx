import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  FiBarChart2,
  FiBox,
  FiClipboard,
  FiDollarSign,
  FiHome,
  FiLogOut,
  FiMapPin,
  FiShoppingBag,
  FiTruck,
  FiUsers,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import BrandLogo from './BrandLogo'
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
    subtitle: 'Manage products, stock, incoming orders, and farm revenue from one workspace.',
    badge: 'Producer',
  },
  buyer: {
    label: 'Buyer Workspace',
    subtitle: 'Browse approved produce, place orders, and follow delivery and billing status.',
    badge: 'Marketplace',
  },
  transporter: {
    label: 'Transporter Workspace',
    subtitle: 'Review missions, update delivery status, and manage transport coverage.',
    badge: 'Logistics',
  },
  ministry: {
    label: 'Ministry Workspace',
    subtitle: 'Approve users, moderate products, and monitor platform activity and reports.',
    badge: 'Oversight',
  },
}

const workspaceNotes = {
  farmer: 'Keep listings, stock, and order responses current.',
  buyer: 'Use approved listings and tracked orders to manage procurement.',
  transporter: 'Mission updates keep delivery status visible across the platform.',
  ministry: 'Approvals and reporting support platform oversight.',
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
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1520px] gap-5 px-4 py-4 lg:px-5">
        <aside className="hidden w-[278px] shrink-0 xl:block">
          <Card className="sticky top-4 flex min-h-[calc(100vh-2rem)] flex-col p-4">
            <BrandLogo size="sm" />

            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">{meta.badge}</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{meta.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{workspaceNotes[role] || workspaceNotes.farmer}</p>
            </div>

            <nav className="mt-5 space-y-1.5">
              {links.map((link) => {
                const Icon = link.icon

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition duration-200',
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/40'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50',
                      )
                    }
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-base shadow-sm ring-1 ring-slate-200 transition duration-200 dark:bg-slate-800 dark:ring-slate-700">
                      <Icon />
                    </span>
                    {link.label}
                  </NavLink>
                )
              })}
            </nav>

            <div className="mt-auto space-y-3 pt-6">
              <Card className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Session</p>
                <p className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">{userDisplayName(user)}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email || 'Signed in'}</p>
              </Card>
            </div>
          </Card>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <Card className="sticky top-4 z-30 px-4 py-3 md:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <BrandLogo size="sm" className="xl:hidden" textClassName="hidden sm:block" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">{meta.badge}</p>
                  <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100 md:text-2xl">{activeLink?.label || meta.label}</h1>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{meta.subtitle}</p>
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

          <div className="flex-1 px-0 py-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
