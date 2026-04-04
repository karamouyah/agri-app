import { useEffect, useState } from 'react'
import { FiClock, FiMapPin, FiPackage } from 'react-icons/fi'
import { getBuyerOrders } from '../../controllers/buyerController'
import { formatDzd } from '../../../utils/currency'
import Reveal from '../../../components/Reveal'

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
    <section className="agri-page space-y-5">
      <Reveal>
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Orders</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Track deliveries</h2>
          </div>
          <div className="surface-muted p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Orders</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{orders.length}</p>
          </div>
          <div className="surface-muted p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Active</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {orders.filter((order) => order.status !== 'delivered').length}
            </p>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Reveal delay={50}>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">ETA</th>
                  <th className="px-3 py-2">View</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-semibold text-slate-900">{order.id}</td>
                    <td className="px-3 py-2">{order.date}</td>
                    <td className="px-3 py-2">{formatDzd(order.total)}</td>
                    <td className="px-3 py-2 capitalize">{order.status}</td>
                    <td className="px-3 py-2">{order.status === 'delivered' ? '-' : order.estimatedDelivery}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="btn-secondary px-3 py-1.5 text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {selectedOrder ? (
          <Reveal delay={100}>
            <aside className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-bold text-slate-900">Order {selectedOrder.id}</h3>
              <div className="mt-4 grid gap-3">
                <div className="surface-muted p-3 text-sm">
                  <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                    <FiMapPin />
                    Address
                  </p>
                  <p className="mt-1 text-slate-600">{selectedOrder.address}</p>
                </div>
                <div className="surface-muted p-3 text-sm">
                  <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                    <FiPackage />
                    Payment
                  </p>
                  <p className="mt-1 text-slate-600">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="surface-muted p-3 text-sm">
                  <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                    <FiClock />
                    Status
                  </p>
                  <p className="mt-1 capitalize text-slate-600">{selectedOrder.status}</p>
                </div>
              </div>

              <div className="mt-5">
                <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Timeline</h4>
                <ol className="mt-3 space-y-2 text-sm">
                  {selectedOrder.timeline.map((step) => (
                    <li key={step.label} className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full ${step.done ? 'bg-emerald-600' : 'bg-slate-300'}`}
                      />
                      <span className={step.done ? 'text-slate-800' : 'text-slate-500'}>{step.label}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
