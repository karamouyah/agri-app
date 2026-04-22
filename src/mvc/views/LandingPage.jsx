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
    title: 'Controlled product catalog',
    description: 'Approved listings stay tied to category, origin, stock, and pricing rules.',
    meta: 'Catalog and pricing',
  },
  {
    icon: FiTruck,
    title: 'Delivery coordination',
    description: 'Transport missions move from assignment to arrival with visible shipment status.',
    meta: 'Dispatch and transit',
  },
  {
    icon: FiShield,
    title: 'Approval and oversight',
    description: 'Ministry teams review accounts, products, and marketplace activity before action goes live.',
    meta: 'Approvals and reports',
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

const workflowSteps = ['Accounts are reviewed before access is approved.', 'Farmers publish from the approved product catalog.', 'Buyers place orders and follow delivery status.', 'Transporters and ministry teams track fulfillment and oversight.']

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
    <div className="min-h-screen px-4 py-5 md:px-6">
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
                Ministry-reviewed access
              </>
            }
            eyebrow="Agriculture Marketplace Platform"
            title="A working marketplace for approved agricultural trade and delivery operations."
            description="AgriGov Market connects farmers, buyers, transporters, and ministry teams in one platform for onboarding, product control, ordering, delivery follow-up, and oversight."
            actions={[
              { to: '/register', label: 'Create Account', icon: FiArrowRight },
              { to: '/login', label: 'Sign In', kind: 'secondary' },
            ]}
            stats={[
              { label: 'Roles', value: '4', help: 'Farmer, buyer, transporter, ministry' },
              { label: 'Workflow', value: 'End-to-end', help: 'From approval to delivery' },
              { label: 'Oversight', value: 'Built in', help: 'Review, moderation, reporting' },
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
              <Card className="p-6 md:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">Platform Workflow</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Built around operational steps, not marketing sections.</h2>
                <div className="mt-5 grid gap-3">
                  {workflowSteps.map((step) => (
                    <div key={step} className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                      {step}
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 md:p-8">
                <SectionHeader
                  eyebrow="Coverage"
                  title="What the platform makes visible"
                  description="Each role can verify approvals, product scope, and location coverage before taking action."
                />
                <div className="mt-6 space-y-4">
                  <div className="grid gap-3">
                    {trustBlocks.map((item) => (
                      <div key={item} className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Card className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Supported Categories</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <span key={category} className="badge-soft px-3 py-1.5 text-xs">
                            {category}
                          </span>
                        ))}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Location Coverage</p>
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
                title="Each role opens directly into the tasks they manage"
                description="Workspaces are separated by role so daily actions stay clear and traceable."
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
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Create an account and continue in the right workspace</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Farmers manage listings, buyers place orders, transporters handle missions, and ministry teams review approvals and reports.
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


