import { Link, Navigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiFeather,
  FiShield,
  FiShoppingBag,
  FiTruck,
  FiUsers,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { getDashboardPath } from '../../utils/roleRoutes'

const highlights = [
  {
    icon: FiFeather,
    title: 'Fresh Farm Identity',
    text: 'Built around transparent farms, clean sourcing, and trusted product quality.',
  },
  {
    icon: FiTruck,
    title: 'Smart Logistics',
    text: 'Faster delivery coordination between farmers, transporters, and buyers.',
  },
  {
    icon: FiShoppingBag,
    title: 'Professional Marketplace',
    text: 'Modern procurement workflows with clear pricing and order visibility.',
  },
  {
    icon: FiShield,
    title: 'Ministry Oversight',
    text: 'Approval-based onboarding to maintain reliability and trust across the network.',
  },
]

const roleCards = [
  {
    role: 'Farmer',
    description: 'Publish products, manage stock, and track order performance.',
    accent: 'from-emerald-700 to-emerald-500',
  },
  {
    role: 'Buyer',
    description: 'Search fresh produce, compare suppliers, and place confident orders.',
    accent: 'from-lime-700 to-emerald-500',
  },
  {
    role: 'Transporter',
    description: 'Accept missions, update delivery status, and keep logistics on schedule.',
    accent: 'from-green-800 to-teal-600',
  },
  {
    role: 'Ministry',
    description: 'Supervise approvals, pricing visibility, and market-wide indicators.',
    accent: 'from-emerald-900 to-green-700',
  },
]

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 md:px-8">
      <div className="absolute left-[-6rem] top-[8rem] -z-10 h-72 w-72 rounded-full bg-lime-200/35 blur-3xl" />
      <div className="absolute right-[-4rem] top-[10rem] -z-10 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />
      <div className="mx-auto w-full max-w-6xl">
        <header className="surface-card section-shell flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-lime-400 text-white shadow-[0_12px_26px_rgba(73,163,90,0.28)]">
              <FiFeather className="text-lg" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">AgriGov</p>
              <h1 className="text-base font-bold text-slate-900 md:text-lg">Agri Marketplace Platform</h1>
            </div>
          </div>

          <nav className="flex items-center gap-2 text-sm">
            <Link to="/login" className="btn-secondary px-4 py-2">
              Login
            </Link>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-4 py-2">
              Get Started
              <FiArrowRight />
            </Link>
          </nav>
        </header>

        <main className="mt-6 space-y-6">
          <section className="surface-card section-shell relative overflow-hidden p-6 md:p-10">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-lime-200/30 blur-3xl" />
            <div className="absolute bottom-8 right-10 hidden h-28 w-28 rounded-full border border-white/50 bg-white/20 lg:block" />

            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="badge-soft px-3 py-1 text-xs">
                  <FiCheckCircle />
                  Trusted by farmers, buyers, transporters, and ministry teams
                </p>
                <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">
                  Fresh agriculture,
                  <span className="block text-emerald-700">modern marketplace experience.</span>
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                  AgriGov connects farm production, logistics operations, and purchasing workflows in one
                  professional platform designed for reliability, transparency, and growth.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm">
                    Create Account
                    <FiArrowRight />
                  </Link>
                  <Link to="/login" className="btn-secondary px-5 py-3 text-sm">
                    Sign In
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <article className="surface-muted p-4 shadow-[0_12px_28px_rgba(65,88,74,0.06)]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Network</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">3 Role Workflows</p>
                  <p className="mt-1 text-sm text-slate-600">Farmer, Buyer, and Transporter collaboration.</p>
                </article>
                <article className="surface-muted p-4 shadow-[0_12px_28px_rgba(65,88,74,0.06)]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Governance</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">Ministry Approval</p>
                  <p className="mt-1 text-sm text-slate-600">Controlled onboarding for trusted marketplace quality.</p>
                </article>
                <article className="surface-muted p-4 shadow-[0_12px_28px_rgba(65,88,74,0.06)] sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Operations</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">Orders + Logistics Visibility</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Live updates from product listing to delivery handoff and completion.
                  </p>
                </article>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="surface-card section-shell p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-50 text-emerald-700 shadow-[0_10px_20px_rgba(73,163,90,0.12)]">
                    <Icon className="text-lg" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </article>
              )
            })}
          </section>

          <section className="surface-card section-shell p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Role-based Access</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">Built for agricultural professionals</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Each role gets dedicated tools while sharing one consistent, modern marketplace system.
                </p>
              </div>
              <div className="badge-soft px-4 py-2 text-sm">
                <FiUsers />
                Verified role-based workflows
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {roleCards.map((card) => (
                <article
                  key={card.role}
                  className="overflow-hidden rounded-[1.35rem] border border-[var(--line)] bg-white/90 shadow-[0_16px_30px_rgba(65,88,74,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_34px_rgba(65,88,74,0.12)]"
                >
                  <div className={`h-2 bg-gradient-to-r ${card.accent}`} />
                  <div className="p-4">
                    <h4 className="text-base font-bold text-slate-900">{card.role}</h4>
                    <p className="mt-2 text-sm text-slate-600">{card.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 px-2 pb-2 text-xs text-slate-500">
          <p>AgriGov Marketplace © 2026</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <FiBarChart2 />
              Market analytics
            </span>
            <span className="inline-flex items-center gap-1">
              <FiTruck />
              Logistics coordination
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}
