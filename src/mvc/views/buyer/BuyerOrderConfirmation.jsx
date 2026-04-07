import { Link, useParams } from 'react-router-dom'
import { FiCheckCircle, FiClipboard, FiFileText } from 'react-icons/fi'
import AgriIllustration from '../../../components/AgriIllustration'
import { Card, buttonStyles } from '../../../components/ui'

export default function BuyerOrderConfirmation() {
  const { id } = useParams()

  return (
    <section className="app-page">
      <Card className="grid gap-6 overflow-hidden p-6 md:grid-cols-[1.02fr_0.98fr] md:p-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
            <FiCheckCircle />
            Order confirmed
          </p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">Your purchase is now in motion.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Your order has been placed successfully. Order ID: <span className="font-semibold text-slate-900">{id}</span>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/buyer/orders" className={buttonStyles.primary}>
              <FiClipboard />
              Track Order
            </Link>
            <Link to="/buyer/invoices" className={buttonStyles.secondary}>
              <FiFileText />
              View Invoices
            </Link>
          </div>
        </div>

        <div className="media-frame">
          <AgriIllustration variant="buyer" className="h-72" />
        </div>
      </Card>
    </section>
  )
}
