import { useEffect, useState } from 'react'
import { FiClock, FiMapPin, FiPackage } from 'react-icons/fi'
import { getBuyerOrders } from '../../controllers/buyerController'
import { formatDzd } from '../../../utils/currency'
import { Card, PageHeader, StatusBadge, buttonStyles, cn } from '../../../components/ui'

export default function BuyerOrders() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    const load = async () => {
      const data = await getBuyerOrders()
      setOrders(data)
      setSelectedOrder(data[0] || null)
    }

    load()
  }, [])

  return (
    <section className="app-page">
      <PageHeader
        eyebrow="Orders"
        title="Track delivery and payment status"
        description="Review order history, open a specific order, and follow its progress from confirmation to arrival."
        meta={[
          { label: 'Orders', value: orders.length },
          { label: 'Active', value: orders.filter((order) => order.status !== 'delivered').length },
          { label: 'Selected total', value: selectedOrder ? formatDzd(selectedOrder.total) : '-' },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card className="overflow-hidden p-4">
          <div className="table-shell">
            <table className="table-base min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>ETA</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-semibold text-slate-900 dark:text-slate-100">{order.id}</td>
                    <td>{order.date}</td>
                    <td>{formatDzd(order.total)}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>{order.status === 'delivered' ? '-' : order.estimatedDelivery}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className={cn(buttonStyles.secondary, 'px-3 py-1.5 text-xs')}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No orders available yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedOrder ? (
          <Card className="p-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Order {selectedOrder.id}</h3>
            <div className="mt-4 grid gap-3">
              <div className="surface-muted p-3 text-sm">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <FiMapPin />
                  Address
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{selectedOrder.address}</p>
              </div>
              <div className="surface-muted p-3 text-sm">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <FiPackage />
                  Payment
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{selectedOrder.paymentMethod}</p>
              </div>
              <div className="surface-muted p-3 text-sm">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <FiClock />
                  Status
                </p>
                <p className="mt-1 text-slate-600 capitalize dark:text-slate-300">{selectedOrder.status}</p>
              </div>
            </div>

            <div className="mt-5">
              <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Timeline</h4>
              <ol className="mt-3 space-y-2 text-sm">
                {selectedOrder.timeline.map((step) => (
                  <li key={step.label} className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${step.done ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'}`}
                    />
                    <span className={step.done ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}>
                      {step.label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Card>
        ) : null}
      </div>
    </section>
  )
}
