import { FiClipboard, FiCreditCard, FiMapPin, FiSearch, FiShoppingCart } from 'react-icons/fi'
import PageHero from '../../../components/PageHero'
import { ActionCard } from '../../../components/ui'

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
    description: 'Complete shipping and payment details in a cleaner flow.',
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
        title="Source fresh produce with clarity and confidence"
        description="Discover verified listings, compare suppliers, and move from cart to delivery through a faster procurement experience."
        variant="buyer"
        stats={[
          { label: 'Search', value: 'Fast', help: 'Filter by category, region, price, and quality' },
          { label: 'Checkout', value: 'Structured', help: 'Clean shipping and payment flow' },
          { label: 'Tracking', value: 'Live', help: 'Order and logistics visibility in one place' },
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
    </section>
  )
}
