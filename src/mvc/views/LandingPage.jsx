import { Link, Navigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiCheckCircle,
  FiFeather,
  FiShield,
  FiShoppingBag,
  FiTruck,
  FiUsers,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { getDashboardPath } from '../../utils/roleRoutes'
import AgriIllustration from '../../components/AgriIllustration'
import BrandLogo from '../../components/BrandLogo'
import PageHero from '../../components/PageHero'
import Reveal from '../../components/Reveal'
import ThemeToggle from '../../components/ThemeToggle'
import { ActionCard, Card, SectionHeader, StatCard, buttonStyles, cn } from '../../components/ui'

const features = [
  {
    icon: FiShoppingBag,
    title: 'Verified marketplace',
    description: 'Approved listings, visible pricing, and a cleaner product discovery flow for serious buyers.',
  },
  {
    icon: FiTruck,
    title: 'Live logistics',
    description: 'Coordinate missions, handoffs, and delivery status without losing operational clarity.',
  },
  {
    icon: FiShield,
    title: 'Ministry oversight',
    description: 'Control onboarding, product governance, and market reporting from a unified workspace.',
  },
]

const roleCards = [
  {
    title: 'Farmer tools',
    description: 'Publish controlled listings, manage stock, and stay on top of incoming demand.',
    meta: 'Inventory, pricing, orders',
    icon: FiFeather,
  },
  {
    title: 'Buyer tools',
    description: 'Search by region, quality, and category, then move from cart to checkout with confidence.',
    meta: 'Search, cart, invoices',
    icon: FiShoppingBag,
  },
  {
    title: 'Transporter tools',
    description: 'Accept missions, track progress, and keep deliveries visible from pickup to arrival.',
    meta: 'Requests, transit, updates',
    icon: FiTruck,
  },
  {
    title: 'Ministry tools',
    description: 'Review approvals, govern categories, and analyze market-wide activity in real time.',
    meta: 'Users, products, reports',
    icon: FiUsers,
  },
]

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-5 md:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(134,239,172,0.35),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(236,253,245,0.85),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.7),_transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl">
        <Card className="px-4 py-3 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BrandLogo size="sm" />
            <nav className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/login" className={buttonStyles.secondary}>
                Sign In
              </Link>
              <Link to="/register" className={buttonStyles.primary}>
                Create Account
                <FiArrowRight />
              </Link>
            </nav>
          </div>
        </Card>

        <main className="mt-6 space-y-6">
          <PageHero
            brand
            badge={
              <>
                <FiCheckCircle />
                Trusted role-based platform
              </>
            }
            eyebrow="Modern Agricultural Network"
            title="Professional agricultural trade with a living, modern interface."
            description="AgriGov Market brings together farmers, buyers, transporters, and ministry teams in one bright, responsive product and operations experience."
            actions={[
              { to: '/register', label: 'Start Free', icon: FiArrowRight },
              { to: '/login', label: 'Open Workspace', kind: 'secondary' },
            ]}
            stats={[
              { label: 'Roles', value: '4', help: 'Connected workflows across the full supply chain' },
              { label: 'Visibility', value: 'End to End', help: 'From listing approval to last-mile delivery' },
              { label: 'Design', value: 'Responsive', help: 'Polished on desktop, tablet, and mobile' },
            ]}
            variant="hero"
          />

          <Reveal>
            <section className="grid gap-4 lg:grid-cols-3">
              {features.map((feature) => (
                <ActionCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  meta="Built for fast decision-making"
                />
              ))}
            </section>
          </Reveal>

          <Reveal delay={60}>
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <Card className="overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-500 p-6 text-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-50/90">Platform Benefits</p>
                <h2 className="mt-2 text-3xl font-bold text-white">Less clutter. Better trust. Faster agricultural workflows.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/90 md:text-base">
                  Use one consistent interface for approvals, listings, delivery status, and procurement. The result feels lighter while doing more.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <StatCard label="Search" value="Focused" help="Filters that surface the right products quickly" tone="slate" />
                  <StatCard label="Tracking" value="Live" help="Clear status changes across every role" tone="slate" />
                  <StatCard label="Control" value="Verified" help="Ministry-managed governance and approval flows" tone="slate" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="media-frame h-full">
                  <AgriIllustration variant="buyer" className="min-h-[320px]" />
                </div>
              </Card>
            </section>
          </Reveal>

          <Reveal delay={120}>
            <section className="space-y-4">
              <SectionHeader
                eyebrow="Role Experiences"
                title="Reusable components, one clean visual system"
                description="Each role gets its own tools without losing the shared structure, spacing, motion, and visual quality of the platform."
              />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {roleCards.map((role) => (
                  <ActionCard
                    key={role.title}
                    icon={role.icon}
                    title={role.title}
                    description={role.description}
                    meta={role.meta}
                  />
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delay={180}>
            <Card className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Ready to launch</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">A cleaner marketplace for real agricultural work</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  Move from approvals to product discovery and delivery tracking without the usual visual noise.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/register" className={cn(buttonStyles.primary, 'px-5 py-3')}>
                  Create Account
                </Link>
                <Link to="/login" className={cn(buttonStyles.secondary, 'px-5 py-3')}>
                  Sign In
                </Link>
              </div>
            </Card>
          </Reveal>
        </main>
      </div>
    </div>
  )
}
