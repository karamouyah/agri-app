import { Link } from 'react-router-dom'
import { FiArrowRight, FiClipboard, FiCreditCard, FiSearch, FiShoppingCart } from 'react-icons/fi'
import PageHero from '../../../components/PageHero'

const actions = [
  {
    to: '/buyer/search',
    label: 'Browse Products',
    description: 'Find fresh products by category, price, quality, and location.',
    icon: FiSearch,
  },
  {
    to: '/buyer/cart',
    label: 'Open Cart',
    description: 'Review selected items before checkout.',
    icon: FiShoppingCart,
  },
  {
    to: '/buyer/checkout',
    label: 'Checkout',
    description: 'Complete payment and shipping details quickly.',
    icon: FiCreditCard,
  },
  {
    to: '/buyer/orders',
    label: 'Track Orders',
    description: 'Follow timeline status from confirmation to delivery.',
    icon: FiClipboard,
  },
  {
    to: '/buyer/invoices',
    label: 'View Invoices',
    description: 'Access payment history and invoice details.',
    icon: FiCreditCard,
  },
]

export default function BuyerDashboard() {
  return (
    <section className="agri-page space-y-5">
      <PageHero
        eyebrow="Buyer Control Panel"
        title="Source fresh produce with confidence"
        description="Discover verified farmers, compare listings with more visual clarity, and move from cart to delivery with a smoother marketplace journey."
        variant="buyer"
        stats={[
          { label: 'Search', value: 'Fast', help: 'Filter by category, region, price, and quality' },
          { label: 'Checkout', value: 'Structured', help: 'One-farmer orders keep procurement clean' },
          { label: 'Tracking', value: 'Live', help: 'Order and logistics status in one place' },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.to}
              to={action.to}
              className="surface-card group lift-card p-5 transition hover:-translate-y-0.5 hover:border-emerald-300"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Icon className="text-lg" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">{action.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{action.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                Open
                <FiArrowRight className="transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
