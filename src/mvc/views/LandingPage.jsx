import { Link, Navigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiCheckCircle,
  FiClipboard,
  FiShield,
  FiShoppingBag,
  FiTruck,
  FiUsers,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { getDashboardPath } from '../../utils/roleRoutes'
import BrandLogo from '../../components/BrandLogo'
import PageHero from '../../components/PageHero'
import Reveal from '../../components/Reveal'
import ThemeToggle from '../../components/ThemeToggle'
import { ActionCard, Card, SectionHeader, StatCard, buttonStyles, cn } from '../../components/ui'

const features = [
  {
    icon: FiShoppingBag,
    title: 'Approved product catalog',
    description: 'Buyers browse listings with category, region, and price details after products pass review.',
    meta: 'Catalog, stock, pricing',
  },
  {
    icon: FiTruck,
    title: 'Delivery mission tracking',
    description: 'Transporters receive pickup and delivery missions with visible order status from dispatch to arrival.',
    meta: 'Requests, transit, proof of movement',
  },
  {
    icon: FiShield,
    title: 'Approval and moderation',
    description: 'Ministry teams review accounts, moderate products, and monitor platform activity before trade goes live.',
    meta: 'Users, products, reports',
  },
]

const roleCards = [
  {
    title: 'Farmer tools',
    description: 'Add products, manage stock, review orders, and follow revenue from one farm workspace.',
    meta: 'Products, stock, orders',
    icon: FiShoppingBag,
  },
  {
    title: 'Buyer tools',
    description: 'Browse approved products, place orders, track deliveries, and keep invoices organized.',
    meta: 'Search, checkout, invoices',
    icon: FiShoppingBag,
  },
  {
    title: 'Transporter tools',
    description: 'Accept delivery missions, update transport status, and maintain coverage across wilayas.',
    meta: 'Missions, transit, coverage',
    icon: FiTruck,
  },
  {
    title: 'Ministry tools',
    description: 'Approve users, moderate product activity, review reports, and supervise marketplace operations.',
    meta: 'Approvals, moderation, analytics',
    icon: FiUsers,
  },
]

const workflowSteps = [
  {
    title: '1. Create and approve accounts',
    description: 'Farmers, buyers, and transporters register with role-specific details. Ministry staff review profiles before access is activated.',
  },
  {
    title: '2. Publish and review products',
    description: 'Farmers add products with category, stock, and price information. Approved products become visible to buyers.',
  },
  {
    title: '3. Place orders and assign delivery',
    description: 'Buyers place orders from the approved catalog, then transporters accept available missions based on coverage and capacity.',
  },
  {
    title: '4. Track fulfillment and reporting',
    description: 'Each role sees order status, delivery progress, and platform activity through their own operational dashboard.',
  },
]

const trustBlocks = [
  'Verified user onboarding before role access is granted.',
  'Category-based product management to keep listings structured.',
  'Status tracking for orders and delivery missions.',
  'Reporting and moderation tools for ministry oversight.',
]

const categories = ['Vegetables', 'Fruits', 'Herbs', 'Dry products']
const coveragePoints = [
  'Farmer and buyer accounts register with wilaya and commune details.',
  'Transporters declare delivery wilayas during onboarding.',
  'Buyers can filter listings by farmer region before ordering.',
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
                Ministry-reviewed marketplace access
              </>
            }
            eyebrow="Agriculture Marketplace Platform"
            title="Manage approved products, orders, and deliveries across the full agriculture workflow."
            description="AgriGov Market connects farmers, buyers, transporters, and ministry teams in one operational platform for onboarding, product management, delivery tracking, and marketplace supervision."
            actions={[
              { to: '/register', label: 'Create Account', icon: FiArrowRight },
              { to: '/login', label: 'Sign In', kind: 'secondary' },
            ]}
            stats={[
              { label: 'Roles', value: '4', help: 'Farmer, buyer, transporter, and ministry access' },
              { label: 'Workflow', value: 'End to End', help: 'From account approval to delivery completion' },
              { label: 'Moderation', value: 'Tracked', help: 'User review, product control, and reporting tools' },
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
                  meta={feature.meta}
                />
              ))}
            </section>
          </Reveal>

          <Reveal delay={60}>
            <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <Card className="overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-500 p-6 text-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-50/90">How The Platform Works</p>
                <h2 className="mt-2 text-3xl font-bold text-white">A clear workflow from onboarding to delivery completion.</h2>
                <div className="mt-6 grid gap-3">
                  {workflowSteps.map((step) => (
                    <div key={step.title} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
                      <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-emerald-50/90">{step.description}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 md:p-8">
                <SectionHeader
                  eyebrow="Trust And Coverage"
                  title="What users can verify before they act"
                  description="The platform is structured to help each role understand who is approved, what is available, and where operations can happen."
                />
                <div className="mt-6 space-y-4">
                  <div className="grid gap-3">
                    {trustBlocks.map((item) => (
                      <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Card className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Supported Categories</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <span key={category} className="badge-soft px-3 py-1.5 text-xs">
                            {category}
                          </span>
                        ))}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Location Coverage</p>
                      <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        {coveragePoints.map((item) => (
                          <p key={item}>{item}</p>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            </section>
          </Reveal>

          <Reveal delay={120}>
            <section className="space-y-4">
              <SectionHeader
                eyebrow="Role Workspaces"
                title="Each role opens directly into the work that matters"
                description="Instead of generic dashboards, every workspace is built around the tasks users actually perform on the marketplace."
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
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Get Started</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Create an account and enter the agriculture workflow for your role</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  Farmers can publish products, buyers can order approved produce, transporters can manage missions, and ministry teams can supervise approvals and reports.
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
