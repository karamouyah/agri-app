import { Link } from 'react-router-dom'

export default function BuyerDashboard() {
  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-800">Buyer Dashboard</h2>
      <p className="mt-2 text-sm text-slate-600">
        Search products, place orders, track deliveries, and view invoices from this interface.
      </p>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/buyer/search"
          className="rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          Browse Products
        </Link>
        <Link
          to="/buyer/cart"
          className="rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          Open Cart
        </Link>
        <Link
          to="/buyer/checkout"
          className="rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          Checkout
        </Link>
        <Link
          to="/buyer/orders"
          className="rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          Track Orders
        </Link>
        <Link
          to="/buyer/invoices"
          className="rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          View Invoices
        </Link>
      </div>
    </section>
  )
}
