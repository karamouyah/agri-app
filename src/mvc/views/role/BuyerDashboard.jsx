// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { FiClipboard, FiCreditCard, FiFileText, FiMapPin, FiSearch, FiShoppingCart } from 'react-icons/fi'
import { useAuth } from '../../../context/AuthContext'
import { ActionCard, Card, PageHeader } from '../../../components/ui'

const actions = [
  {
    to: '/buyer/profile',
    label: 'Buyer Profile',
    description: 'Update your structured wilaya, commune, and buyer contact details.',
    icon: FiMapPin,
    meta: 'Keep delivery data valid',
  },
  {
    to: '/buyer/search',
    label: 'Browse Products',
    description: 'Find fresh products by category, price, quality, and location.',
    icon: FiSearch,
    meta: 'Explore approved produce',
  },
  {
    to: '/buyer/cart',
    label: 'Open Cart',
    description: 'Review selected items and adjust quantities before checkout.',
    icon: FiShoppingCart,
    meta: 'Manage selected items',
  },
  {
    to: '/buyer/checkout',
    label: 'Checkout',
    description: 'Confirm delivery details and place your order with billing information.',
    icon: FiCreditCard,
    meta: 'Finish procurement',
  },
  {
    to: '/buyer/orders',
    label: 'Track Orders',
    description: 'Follow delivery progress from confirmation through arrival.',
    icon: FiClipboard,
    meta: 'Monitor active orders',
  },
  {
    to: '/buyer/invoices',
    label: 'View Invoices',
    description: 'Access payment records, invoice details, and downloads.',
    icon: FiCreditCard,
    meta: 'Review billing history',
  },
]

export default function BuyerDashboard() {
  const { user } = useAuth()
  return (
    <section className="app-page">
      <PageHeader
        title={`Welcome, ${user?.name || 'Buyer'}`}
        meta={[
          { label: 'Catalog', value: 'Approved' },
          { label: 'Orders', value: 'Tracked' },
          { label: 'Billing', value: 'Invoices available' },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => (
          <ActionCard
            key={action.to}
            to={action.to}
            icon={action.icon}
            title={action.label}
          />
        ))}
      </div>
    </section>
  )
}
