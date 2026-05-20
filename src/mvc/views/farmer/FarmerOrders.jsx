// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FiFlag, FiPhone, FiMail, FiUser } from 'react-icons/fi'
import { acceptOrder, declineOrder, getOrders, notifyTransporters } from '../../controllers/farmerController'
import { formatDzd } from '../../../utils/currency'
import { PageHeader, StatusBadge, buttonStyles, cn } from '../../../components/ui'
import ReportModal from '../../../components/ReportModal'

function ContactInfoCard({ title, contact }) {
  if (!contact) return null
  return (
    <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-900/20 mt-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
        <FiUser className="shrink-0" />
        {title}
      </p>
      <div className="mt-2">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{contact.full_name || contact.email}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {contact.phone_number && (
          <a
            href={`tel:${contact.phone_number}`}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
          >
            <FiPhone className="shrink-0" /> {contact.phone_number}
          </a>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-2 rounded-md bg-sky-100 px-3 py-1.5 text-sm font-medium text-sky-800 transition-colors hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:hover:bg-sky-900/60"
          >
            <FiMail className="shrink-0" /> {contact.email}
          </a>
        )}
      </div>
    </div>
  )
}

export default function FarmerOrders() {
  // State: stores local UI data and is updated by event handlers or API responses.
  const [orders, setOrders] = useState([])
  // State: stores local UI data and is updated by event handlers or API responses.
  const [selectedOrder, setSelectedOrder] = useState(null)
  // State: stores local UI data and is updated by event handlers or API responses.
  const [activeTab, setActiveTab] = useState('pending')
  // State: stores local UI data and is updated by event handlers or API responses.
  const [selectedIds, setSelectedIds] = useState([])
  const [reportOpen, setReportOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState(null)

  const loadOrders = useCallback(async () => {
    const data = await getOrders()
    setOrders(data)

    if (selectedOrder) {
      const refreshedSelected = data.find((order) => order.id === selectedOrder.id) || null
      setSelectedOrder(refreshedSelected)
    }
  }, [selectedOrder])

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    let active = true

    // run handles this module workflow, using its parameters and returning JSX, data, or a service result.
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
  // handleAccept handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleAccept = async (id) => {
    await acceptOrder(id)
    await loadOrders()
  }
  // handleDecline handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleDecline = async (id) => {
    await declineOrder(id)
    await loadOrders()
  }

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders
    return orders.filter((order) => order.status === activeTab)
  }, [activeTab, orders])

  // toggleSelect handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]))
  }

  // toggleSelectAll handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([])
      return
    }
    setSelectedIds(filteredOrders.map((order) => order.id))
  }
  // handleBulkConfirm handles this module workflow, using its parameters and returning JSX, data, or a service result.
  const handleBulkConfirm = async () => {
    const pendingIds = selectedIds.filter((id) =>
      orders.some((order) => order.id === id && order.status === 'pending'),
    )
    await Promise.all(pendingIds.map((id) => acceptOrder(id)))
    setSelectedIds([])
    await loadOrders()
  }

  const handleNotifyTransporters = async () => {
    const targetIds = selectedIds.filter((id) => orders.some((order) => order.id === id))
    await Promise.all(targetIds.map((id) => notifyTransporters(id)))
    setSelectedIds([])
    await loadOrders()
  }

  const totals = useMemo(() => {
    const validOrders = orders.filter((order) => order.status !== 'declined')
    const totalRevenue = validOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0)

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
      <PageHeader
        eyebrow="Orders"
        title="Review incoming orders and dispatch status"
        description="Filter orders by status, confirm pending requests, and inspect delivery details from one screen."
        meta={[
          { label: 'New', value: totals.newOrders },
          { label: 'Processing', value: totals.processing },
          { label: 'Completed', value: totals.completed },
          { label: 'Revenue', value: formatDzd(totals.totalRevenue) },
        ]}
      />

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
                      ? 'border-emerald-700 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200'
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
              <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-emerald-50/30 dark:hover:bg-slate-800/60">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{order.id}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{order.buyerName}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{order.orderDate}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 dark:text-slate-100">{order.product}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{order.quantity} units</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{formatDzd(order.amount)}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{order.deliveryAddress}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap justify-center gap-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAccept(order.id)}
                              className="rounded-lg border border-emerald-300 px-2 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-800/50 dark:text-emerald-300 dark:hover:bg-emerald-950/30"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDecline(order.id)}
                              className="rounded-lg border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-950/30"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className={cn(buttonStyles.secondary, 'px-2 py-1 text-xs')}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReportTarget(order)
                            setReportOpen(true)
                          }}
                          className={cn(buttonStyles.secondary, 'px-2 py-1 text-xs')}
                        >
                          <FiFlag />
                          Report
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

          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <p>
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <p>{selectedIds.length} selected</p>
          </div>
        </div>

        <aside className="surface-card h-fit p-5 xl:sticky xl:top-24">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Bulk Actions</h3>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={handleBulkConfirm}
              disabled={selectedIds.length === 0}
              className="btn-primary w-full px-4 py-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-50"
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
              onClick={handleNotifyTransporters}
              disabled={selectedIds.length === 0}
              className="btn-secondary w-full px-4 py-3 text-sm transition hover:bg-slate-50"
            >
              Notify Transporters
            </button>
          </div>

        </aside>
      </div>

      {selectedOrder && (
        <div className="surface-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Order Details</h3>
            <button
              type="button"
              onClick={() => {
                setReportTarget(selectedOrder)
                setReportOpen(true)
              }}
              className={cn(buttonStyles.secondary, 'text-sm')}
            >
              <FiFlag />
              Report order
            </button>
          </div>
          <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-slate-300 md:grid-cols-2">
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

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <ContactInfoCard title="Buyer Contact" contact={selectedOrder.buyerContact} />
            <ContactInfoCard title="Transporter Contact" contact={selectedOrder.transporterContact} />
          </div>

        </div>
      )}
      <ReportModal
        open={reportOpen}
        onClose={() => {
          setReportOpen(false)
          setReportTarget(null)
        }}
        title="Report order"
        target={{
          category: 'order',
          relatedOrderId: reportTarget?.id,
          label: reportTarget ? `Order ${reportTarget.id}` : '',
        }}
      />
    </section>
  )
}


