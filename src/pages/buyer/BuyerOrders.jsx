import { useEffect, useState } from 'react'
import { getBuyerOrders } from '../../mvc/controllers/buyerController'

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
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">Order Tracking</h2>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-3 py-2">Order ID</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">ETA</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-slate-100">
                <td className="px-3 py-2">{order.id}</td>
                <td className="px-3 py-2">{order.date}</td>
                <td className="px-3 py-2">{order.total} MAD</td>
                <td className="px-3 py-2 capitalize">{order.status}</td>
                <td className="px-3 py-2">
                  {order.status === 'delivered' ? '-' : order.estimatedDelivery}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-800">Order Details - {selectedOrder.id}</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
            <p>
              <span className="font-medium">Delivery Address:</span> {selectedOrder.address}
            </p>
            <p>
              <span className="font-medium">Payment:</span> {selectedOrder.paymentMethod}
            </p>
            <p>
              <span className="font-medium">Total:</span> {selectedOrder.total} MAD
            </p>
            <p>
              <span className="font-medium">Current Status:</span>{' '}
              <span className="capitalize">{selectedOrder.status}</span>
            </p>
            {selectedOrder.status !== 'delivered' && (
              <p className="md:col-span-2">
                <span className="font-medium">Estimated Delivery:</span> {selectedOrder.estimatedDelivery}
              </p>
            )}
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-slate-800">Delivery Timeline</h4>
            <ol className="mt-2 space-y-2 text-sm">
              {selectedOrder.timeline.map((step) => (
                <li key={step.label} className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                      step.done ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  />
                  <span className={step.done ? 'text-slate-800' : 'text-slate-500'}>{step.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </section>
  )
}
