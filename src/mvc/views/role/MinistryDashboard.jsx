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
    to: '/admin/orders',
    icon: FiClipboard,
    title: 'Orders and transactions',
    description: 'Review marketplace orders, payment records, delivery assignments, and shipment status.',
    meta: 'Order oversight',
  },
  {
    to: '/admin/signalements',
    icon: FiShield,
    title: 'User reports',
    description: 'Review submitted signalements, update review status, and add internal notes.',
    meta: 'Issue review',
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
        title={`Welcome, ${user?.name || 'Administrator'}`}
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

    </section>
  )
}
