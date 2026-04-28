// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { FiBarChart2, FiClipboard, FiShield, FiShoppingBag, FiUsers } from 'react-icons/fi'
import PageHero from '../../../components/PageHero'
import { useAuth } from '../../../context/AuthContext'
import { ActionCard, Card } from '../../../components/ui'

const quickActions = [
  {
    to: '/admin/users',
    icon: FiUsers,
    title: 'Pending user approvals',
    description: 'Review new farmer, buyer, and transporter accounts before they access the platform.',
    meta: 'Onboarding and verification',
  },
  {
    to: '/admin/products',
    icon: FiShoppingBag,
    title: 'Product moderation',
    description: 'Manage categories and product records that appear in the marketplace catalog.',
    meta: 'Products and categories',
  },
  {
    to: '/admin/reports',
    icon: FiBarChart2,
    title: 'Platform reports',
    description: 'Generate regional trade summaries to support supervision and reporting.',
    meta: 'Volume and revenue data',
  },
]

export default function MinistryDashboard() {
  const { user } = useAuth()
  return (
    <section className="app-page">
      <PageHero
        eyebrow="Ministry Workspace"
        title={`Welcome, ${user?.name || 'Administrator'}`}
        description="Use the ministry dashboard to review pending access, monitor product activity, and move into reports or moderation tasks without leaving the admin workspace."
        variant="admin"
        stats={[
          { label: 'Approvals', value: 'Pending', help: 'Open the user module to review onboarding requests' },
          { label: 'Moderation', value: 'Products', help: 'Manage categories and product records' },
          { label: 'Reporting', value: 'Regional', help: 'Follow revenue and volume by region and category' },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((action) => (
          <ActionCard
            key={action.to}
            to={action.to}
            icon={action.icon}
            title={action.title}
            description={action.description}
            meta={action.meta}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5 md:p-6">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
            <FiShield />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-700">Approval Workflow</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>1. Review pending accounts and confirm role-specific profile information.</p>
            <p>2. Approve, reject, or request more information before granting access.</p>
            <p>3. Monitor live platform activity after onboarding is complete.</p>
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
            <FiClipboard />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-700">Oversight Priorities</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Check for pending approvals before reviewing product or report data.</p>
            <p>Use product management to keep marketplace categories and listings structured.</p>
            <p>Open reports when you need regional movement, volume, and revenue summaries.</p>
          </div>
        </Card>
      </div>
    </section>
  )
}

