// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { FiClipboard, FiCreditCard, FiMapPin, FiSearch, FiShoppingCart } from 'react-icons/fi'
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
        eyebrow="Buyer Workspace"
        title={`Welcome, ${user?.name || 'Buyer'}`}
        description="Use the buyer workspace to search the approved catalog, place orders, and follow billing and delivery status."
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
            description={action.description}
            meta={action.meta}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Order Flow</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>1. Browse approved products by category, price, quality, wilaya, and commune.</p>
            <p>2. Add products to your cart and confirm quantities before checkout.</p>
            <p>3. Submit delivery details, track order progress, and review invoices after purchase.</p>
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Before Checkout</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Keep your address and location details updated in your profile.</p>
            <p>Review supplier region and unit pricing before adding products to the cart.</p>
            <p>Use orders and invoices pages to follow fulfilled purchases and reorder when needed.</p>
          </div>
        </Card>
      </div>
    </section>
  )
}

