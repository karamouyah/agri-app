// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { useEffect, useState } from 'react'
import { FiCreditCard, FiFileText } from 'react-icons/fi'
import { getInvoices } from '../../controllers/buyerController'
import { formatDzd } from '../../../utils/currency'
import PageHero from '../../../components/PageHero'
import { Card, buttonStyles, cn } from '../../../components/ui'

export default function BuyerInvoices() {
  // State: stores local UI data and is updated by event handlers or API responses.
  const [invoices, setInvoices] = useState([])
  // State: stores local UI data and is updated by event handlers or API responses.
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    // load handles this module workflow, using its parameters and returning JSX, data, or a service result.
    const load = async () => {
      const data = await getInvoices()
      setInvoices(data)
      setSelectedInvoice(data[0] || null)
    }

    load()
  }, [])

  return (
    <section className="app-page">
      <PageHero
        eyebrow="Invoices"
        title="Payment records"
        description="Review your payment history and inspect detailed order charges in DZD."
        variant="buyer"
        stats={[
          { label: 'Invoices', value: invoices.length, help: 'Issued payment records' },
          { label: 'Latest amount', value: selectedInvoice ? formatDzd(selectedInvoice.amount) : '-', help: 'Most recent invoice currently selected' },
          { label: 'Currency', value: 'DZD', help: 'Invoices stay aligned with platform pricing rules' },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_400px]">
        <Card className="overflow-hidden p-4">
          <div className="table-shell">
            <table className="table-base min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="font-semibold text-slate-900 dark:text-slate-100">{invoice.id}</td>
                    <td>{invoice.orderId}</td>
                    <td>{invoice.date}</td>
                    <td>{formatDzd(invoice.amount)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(invoice)}
                        className={cn(buttonStyles.secondary, 'px-3 py-1.5 text-xs')}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No invoices available yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedInvoice ? (
          <Card className="p-5 text-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedInvoice.id}</h3>
              <span className="text-xs font-medium text-slate-500">{selectedInvoice.date}</span>
            </div>
            
            <div className="space-y-4">
              <div className="surface-muted p-3 space-y-2">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <FiFileText />
                  Order #{selectedInvoice.orderId}
                </p>
                <div className="space-y-1">
                  {selectedInvoice.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                      <span>{item.name} x {item.quantity}</span>
                      <span className="font-medium">{formatDzd(item.unit_price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="soft-divider my-2" />
                <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100">
                  <span>Total Paid</span>
                  <span>{formatDzd(selectedInvoice.amount)}</span>
                </div>
              </div>

              <div className="surface-muted p-3">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100 mb-1">
                  <FiCreditCard />
                  Payment
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">{selectedInvoice.details}</p>
              </div>

              {selectedInvoice.deliveryLocation && (
                <div className="surface-muted p-3">
                  <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Delivery Address</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{selectedInvoice.deliveryLocation.label}</p>
                </div>
              )}

              {selectedInvoice.farmerContact && (
                <div className="surface-muted p-3">
                  <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Farmer Contact</p>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <p>{selectedInvoice.farmerContact.full_name}</p>
                    <p>{selectedInvoice.farmerContact.phone_number}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ) : null}
      </div>
    </section>
  )
}
