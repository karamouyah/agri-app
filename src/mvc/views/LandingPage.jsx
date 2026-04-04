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
import BrandLogo from '../../components/BrandLogo'
import PageHero from '../../components/PageHero'
import AgriIllustration from '../../components/AgriIllustration'
import Reveal from '../../components/Reveal'

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
    variant: 'farmer',
  },
  {
    role: 'Buyer',
    description: 'Search fresh produce, compare suppliers, and place confident orders.',
    accent: 'from-lime-700 to-emerald-500',
    variant: 'buyer',
  },
  {
    role: 'Transporter',
    description: 'Accept missions, update delivery status, and keep logistics on schedule.',
    accent: 'from-green-800 to-teal-600',
    variant: 'transporter',
  },
  {
    role: 'Ministry',
    description: 'Supervise approvals, pricing visibility, and market-wide indicators.',
    accent: 'from-emerald-900 to-green-700',
    variant: 'admin',
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
          <BrandLogo size="sm" />

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
          <PageHero
            brand
            badge={
              <>
                <FiCheckCircle />
                Trusted by farmers, buyers, transporters, and ministry teams
              </>
            }
            eyebrow="Digital Agriculture Platform"
            title="Fresh agriculture, alive with a modern marketplace experience."
            description="AgriGov connects farm production, ministry-approved catalog control, professional purchasing, and logistics coordination in one polished platform."
            actions={[
              { to: '/register', label: 'Create Account', icon: FiArrowRight },
              { to: '/login', label: 'Sign In', kind: 'secondary' },
            ]}
            stats={[
              { label: 'Role Workflows', value: '4', help: 'Farmer, buyer, transporter, ministry' },
              { label: 'Controlled Catalog', value: 'Approved', help: 'Structured pricing and product governance' },
              { label: 'Visibility', value: 'End to End', help: 'From listing to delivery tracking' },
            ]}
            variant="hero"
          />

          <Reveal>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item, index) => {
              const Icon = item.icon
              return (
                <article
                  key={item.title}
                  className={`surface-card section-shell lift-card p-5 motion-fade-up ${index > 0 ? `motion-delay-${Math.min(index, 3)}` : ''}`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-50 text-emerald-700 shadow-[0_10px_20px_rgba(73,163,90,0.12)]">
                    <Icon className="text-lg" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </article>
              )
            })}
            </section>
          </Reveal>

          <Reveal delay={70}>
            <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="promo-banner app-grid-lines p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/90">Featured Network</p>
              <h3 className="mt-3 max-w-xl text-3xl font-bold leading-tight text-white md:text-4xl">
                Premium agricultural sourcing with visual clarity and operational trust.
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-emerald-50/88 md:text-base">
                From bright produce listings to delivery mission updates, every screen is built to feel cleaner,
                faster, and more trustworthy for real marketplace work.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/14 bg-white/10 px-4 py-4">
                  <p className="text-2xl font-bold text-white">Secure</p>
                  <p className="mt-1 text-xs text-emerald-50/80">JWT access and role-based routing</p>
                </div>
                <div className="rounded-2xl border border-white/14 bg-white/10 px-4 py-4">
                  <p className="text-2xl font-bold text-white">Responsive</p>
                  <p className="mt-1 text-xs text-emerald-50/80">Built for desktop, tablet, and mobile</p>
                </div>
                <div className="rounded-2xl border border-white/14 bg-white/10 px-4 py-4">
                  <p className="text-2xl font-bold text-white">Professional</p>
                  <p className="mt-1 text-xs text-emerald-50/80">Modern layout, motion, imagery, and hierarchy</p>
                </div>
              </div>
            </div>

            <div className="media-shell p-4">
              <AgriIllustration variant="buyer" className="h-full min-h-[300px]" />
            </div>
            </section>
          </Reveal>

          <Reveal delay={120}>
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
                  <div className="border-b border-[var(--line)] bg-[linear-gradient(180deg,rgba(246,250,240,0.92),rgba(255,255,255,0.82))] px-3 pt-3">
                    <AgriIllustration variant={card.variant} className="h-36" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-base font-bold text-slate-900">{card.role}</h4>
                    <p className="mt-2 text-sm text-slate-600">{card.description}</p>
                  </div>
                </article>
              ))}
            </div>
            </section>
          </Reveal>
        </main>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 px-2 pb-2 text-xs text-slate-500">
          <BrandLogo size="sm" />
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
