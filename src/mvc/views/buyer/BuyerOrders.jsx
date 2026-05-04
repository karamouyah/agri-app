// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { useEffect, useState } from 'react'
import { FiClock, FiFlag, FiMapPin, FiPackage, FiPhone, FiMail, FiUser } from 'react-icons/fi'
import { getBuyerOrders } from '../../controllers/buyerController'
import { formatDzd } from '../../../utils/currency'
import { Card, PageHeader, StatusBadge, buttonStyles, cn } from '../../../components/ui'
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
            <FiPhone className="shrink-0" /> Call
          </a>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-2 rounded-md bg-sky-100 px-3 py-1.5 text-sm font-medium text-sky-800 transition-colors hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:hover:bg-sky-900/60"
          >
            <FiMail className="shrink-0" /> Email
          </a>
        )}
      </div>
    </div>
  )
}

export default function BuyerOrders() {
  // State: stores local UI data and is updated by event handlers or API responses.
  const [orders, setOrders] = useState([])
  // State: stores local UI data and is updated by event handlers or API responses.
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState(null)

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    // load handles this module workflow, using its parameters and returning JSX, data, or a service result.
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
                  <th>Actions</th>
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
                      <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className={cn(buttonStyles.secondary, 'px-3 py-1.5 text-xs')}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReportTarget(order)
                          setReportOpen(true)
                        }}
                        className={cn(buttonStyles.secondary, 'px-3 py-1.5 text-xs')}
                      >
                        <FiFlag />
                        Report
                      </button>
                      </div>
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

            <ContactInfoCard title="Transporter Contact" contact={selectedOrder.transporterContact} />
            <ContactInfoCard title="Farmer Contact" contact={selectedOrder.farmerContact} />

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

            <button
              type="button"
              onClick={() => {
                setReportTarget(selectedOrder)
                setReportOpen(true)
              }}
              className={cn(buttonStyles.secondary, 'mt-5 w-full')}
            >
              <FiFlag />
              Report this order
            </button>
          </Card>
        ) : null}
      </div>
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
