import { FiClipboard, FiCreditCard, FiMapPin, FiSearch, FiShoppingCart } from 'react-icons/fi'
import PageHero from '../../../components/PageHero'
import { ActionCard, Card } from '../../../components/ui'

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
  return (
    <section className="app-page">
      <PageHero
        eyebrow="Buyer Workspace"
        title="Buy approved agricultural products and track each order"
        description="Use the buyer workspace to browse approved listings, manage your cart, confirm delivery details, and follow orders through invoicing and arrival."
        variant="buyer"
        stats={[
          { label: 'Catalog', value: 'Approved', help: 'Browse only products that are available to order' },
          { label: 'Orders', value: 'Tracked', help: 'Follow confirmation, delivery, and completion status' },
          { label: 'Billing', value: 'Recorded', help: 'Review invoices and purchase history in one place' },
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Buyer Workflow</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>1. Browse approved products by category, price, quality, wilaya, and commune.</p>
            <p>2. Add products to your cart and confirm quantities before checkout.</p>
            <p>3. Submit delivery details, track order progress, and review invoices after purchase.</p>
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Before You Checkout</p>
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
