import { Link } from 'react-router-dom'
import { FiArrowRight, FiClipboard, FiCreditCard, FiSearch, FiShoppingCart } from 'react-icons/fi'

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
      <div className="surface-card relative overflow-hidden p-6 md:p-7">
        <div className="absolute -right-12 -top-14 h-44 w-44 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Buyer Control Panel</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Source fresh produce with confidence</h2>
          <p className="mt-2 text-sm text-slate-600 md:text-base">
            Search verified suppliers, place orders, and track logistics in one marketplace workflow.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.to}
              to={action.to}
              className="surface-card group p-5 transition hover:-translate-y-0.5 hover:border-emerald-300"
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
