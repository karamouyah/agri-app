// File responsibility: Defines a reusable React UI component shared across pages.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  FiBarChart2,
  FiBox,
  FiClipboard,
  FiDollarSign,
  FiFileText,
  FiFlag,
  FiHome,
  FiLogOut,
  FiMapPin,
  FiShoppingBag,
  FiTruck,
  FiUsers,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { isPendingUser } from '../utils/roleRoutes'
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
    { to: '/farmer/reports', label: 'Reports', icon: FiFlag },
  ],
  buyer: [
    { to: '/buyer/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/buyer/profile', label: 'Profile', icon: FiMapPin },
    { to: '/buyer/search', label: 'Browse', icon: FiShoppingBag },
    { to: '/buyer/cart', label: 'Cart', icon: FiBox },
    { to: '/buyer/orders', label: 'Orders', icon: FiClipboard },
    { to: '/buyer/invoices', label: 'Invoices', icon: FiDollarSign },
    { to: '/buyer/documents', label: 'Documents', icon: FiFileText },
    { to: '/buyer/reports', label: 'Reports', icon: FiFlag },
  ],
  transporter: [
    { to: '/transporter/dashboard', label: 'Dashboard', icon: FiTruck },
    { to: '/transporter/profile', label: 'Profile', icon: FiMapPin },
    { to: '/transporter/documents', label: 'Documents', icon: FiFileText },
    { to: '/transporter/reports', label: 'Reports', icon: FiFlag },
  ],
  ministry: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/admin/users', label: 'Users', icon: FiUsers },
    { to: '/admin/orders', label: 'Orders', icon: FiClipboard },
    { to: '/admin/products', label: 'Products', icon: FiShoppingBag },
    { to: '/admin/documents', label: 'Documents', icon: FiFileText },
    { to: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
    { to: '/admin/signalements', label: 'Signalements', icon: FiFlag },
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

// userDisplayName handles this module workflow, using its parameters and returning JSX, data, or a service result.
function userDisplayName(user) {
  if (!user) return 'Workspace User'
  return user.name || user.email || 'Workspace User'
}

export default function Layout({ role }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const links = navByRole[role] || []
  const pending = isPendingUser(user)
  const visibleLinks = pending ? links.filter((link) => link.to === `/${role}/documents`) : links
  const meta = roleMeta[role] || roleMeta.farmer
  const activeLink = visibleLinks.find((link) => location.pathname.startsWith(link.to))
  // handleLogout handles this module workflow, using its parameters and returning JSX, data, or a service result.
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

            <div className="mt-6 border-b border-slate-200 pb-5 mb-5 dark:border-slate-800">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{meta.badge}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{meta.label}</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{workspaceNotes[role] || workspaceNotes.farmer}</p>
            </div>

            <nav className="space-y-1">
              {pending ? (
                <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                  Your account is waiting for ministry approval. Please upload your verification documents.
                </div>
              ) : null}
              {visibleLinks.map((link) => {
                const Icon = link.icon

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200',
                      )
                    }
                  >
                    <Icon className="text-lg" />
                    {link.label}
                  </NavLink>
                )
              })}
            </nav>

            <div className="mt-auto space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="px-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Session</p>
                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{userDisplayName(user)}</p>
              </div>
            </div>
          </Card>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <Card className="sticky top-4 z-30 px-4 py-3 md:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <BrandLogo size="sm" className="xl:hidden" textClassName="hidden sm:block" />
                <div className="hidden lg:block">
                  <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{activeLink?.label || meta.label}</h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <ThemeToggle />
                <div className="hidden md:block border-r border-slate-200 pr-3 mr-1 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{userDisplayName(user)}</p>
                </div>
                <button type="button" onClick={handleLogout} className={buttonStyles.ghost}>
                  <FiLogOut />
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto border-t border-slate-100 pt-3 dark:border-slate-800 pb-1 xl:hidden">
              {pending ? (
                <span className="min-w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                  Your account is waiting for ministry approval. Please upload your verification documents.
                </span>
              ) : null}
              {visibleLinks.map((link) => {
                const Icon = link.icon

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50',
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
