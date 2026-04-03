import { useCallback, useEffect, useMemo, useState } from 'react'
import { acceptOrder, declineOrder, getOrders } from '../../controllers/farmerController'
import { formatDzd } from '../../../utils/currency'

export default function FarmerOrders() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedIds, setSelectedIds] = useState([])

  const loadOrders = useCallback(async () => {
    const data = await getOrders()
    setOrders(data)

    if (selectedOrder) {
      const refreshedSelected = data.find((order) => order.id === selectedOrder.id) || null
      setSelectedOrder(refreshedSelected)
    }
  }, [selectedOrder])

  useEffect(() => {
    let active = true

    const run = async () => {
      const data = await getOrders()
      if (!active) return
      setOrders(data)
      if (selectedOrder) {
        const refreshedSelected = data.find((order) => order.id === selectedOrder.id) || null
        setSelectedOrder(refreshedSelected)
      }
    }

    run()
    return () => {
      active = false
    }
  }, [selectedOrder])

  const handleAccept = async (id) => {
    await acceptOrder(id)
    await loadOrders()
  }

  const handleDecline = async (id) => {
    await declineOrder(id)
    await loadOrders()
  }

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders
    return orders.filter((order) => order.status === activeTab)
  }, [activeTab, orders])

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([])
      return
    }
    setSelectedIds(filteredOrders.map((order) => order.id))
  }

  const handleBulkConfirm = async () => {
    const pendingIds = selectedIds.filter((id) =>
      orders.some((order) => order.id === id && order.status === 'pending'),
    )
    await Promise.all(pendingIds.map((id) => acceptOrder(id)))
    setSelectedIds([])
    await loadOrders()
  }

  const totals = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0)

    return {
      newOrders: orders.filter((order) => order.status === 'pending').length,
      processing: orders.filter((order) => ['accepted', 'shipped', 'in transit'].includes(order.status)).length,
      completed: orders.filter((order) => order.status === 'delivered').length,
      totalRevenue,
    }
  }, [orders])

  const tabs = [
    { id: 'pending', label: 'New Orders' },
    { id: 'accepted', label: 'Processing' },
    { id: 'shipped', label: 'Ready for Delivery' },
    { id: 'delivered', label: 'Completed' },
    { id: 'declined', label: 'Cancelled/Refunded' },
    { id: 'all', label: 'All' },
  ]

  return (
    <section className="agri-page space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="surface-card p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">New Orders Today</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{totals.newOrders}</h3>
        </article>
        <article className="surface-card p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending Processing</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{totals.processing}</h3>
        </article>
        <article className="surface-card p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Completed</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{totals.completed}</h3>
        </article>
        <article className="surface-card p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Revenue</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {formatDzd(totals.totalRevenue)}
          </h3>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="surface-card overflow-hidden">
          <nav className="-mb-px flex overflow-x-auto border-b border-slate-100 px-5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSelectedIds([])
                  }}
                  className={`whitespace-nowrap border-b-2 px-5 py-4 text-sm font-bold transition-colors ${
                    isActive
                      ? 'border-emerald-700 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </nav>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-slate-50/90 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-bold">
                    <input
                      type="checkbox"
                      checked={filteredOrders.length > 0 && selectedIds.length === filteredOrders.length}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
                    />
                  </th>
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Product & Qty</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Delivery</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-emerald-50/30">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{order.id}</td>
                    <td className="px-6 py-4">{order.buyerName}</td>
                    <td className="px-6 py-4 text-slate-500">{order.orderDate}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{order.product}</div>
                      <div className="text-xs text-slate-500">{order.quantity} units</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{formatDzd(order.amount)}</td>
                    <td className="px-6 py-4 text-slate-600">{order.deliveryAddress}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap justify-center gap-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAccept(order.id)}
                              className="rounded-lg border border-emerald-300 px-2 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDecline(order.id)}
                              className="rounded-lg border border-red-300 px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-sm text-slate-500">
                      No orders found for this tab.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
            <p>
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <p>{selectedIds.length} selected</p>
          </div>
        </div>

        <aside className="surface-card h-fit p-5 xl:sticky xl:top-24">
          <h3 className="text-base font-bold text-slate-900">Bulk Actions</h3>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={handleBulkConfirm}
              disabled={selectedIds.length === 0}
              className="btn-primary w-full px-4 py-3 text-sm shadow-lg shadow-emerald-700/20 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Bulk Confirm ({selectedIds.length})
            </button>
            <button
              type="button"
              className="btn-secondary w-full px-4 py-3 text-sm transition hover:bg-slate-50"
            >
              Print Picking List
            </button>
            <button
              type="button"
              className="btn-secondary w-full px-4 py-3 text-sm transition hover:bg-slate-50"
            >
              Notify Transporters
            </button>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
            Tip: Use bulk confirm to accept multiple pending orders at once and speed up daily dispatch.
          </div>
        </aside>
      </div>

      {selectedOrder && (
        <div className="surface-card p-5">
          <h3 className="text-lg font-semibold text-slate-800">Order Details</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
            <p>
              <span className="font-medium">Order ID:</span> {selectedOrder.id}
            </p>
            <p>
              <span className="font-medium">Buyer:</span> {selectedOrder.buyerName}
            </p>
            <p>
              <span className="font-medium">Product:</span> {selectedOrder.product}
            </p>
            <p>
              <span className="font-medium">Quantity:</span> {selectedOrder.quantity}
            </p>
            <p>
              <span className="font-medium">Amount:</span> {formatDzd(selectedOrder.amount)}
            </p>
            <p>
              <span className="font-medium">Status:</span>{' '}
              <span className="capitalize">{selectedOrder.status}</span>
            </p>
            <p className="md:col-span-2">
              <span className="font-medium">Delivery Address:</span> {selectedOrder.deliveryAddress}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}


