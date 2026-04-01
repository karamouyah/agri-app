import { Link, useParams } from 'react-router-dom'

export default function BuyerOrderConfirmation() {
  const { id } = useParams()

  return (
    <section className="agri-page rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold text-emerald-700">Order Confirmed</h2>
      <p className="mt-2 text-sm text-slate-700">
        Your order has been placed successfully. Order ID: <span className="font-semibold">{id}</span>
      </p>
      <div className="mt-4 flex gap-2">
        <Link
          to="/buyer/orders"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Track Order
        </Link>
        <Link
          to="/buyer/invoices"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
        >
          View Invoices
        </Link>
      </div>
    </section>
  )
}


