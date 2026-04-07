import { useEffect, useState } from 'react'
import { FiCreditCard, FiFileText } from 'react-icons/fi'
import { getInvoices } from '../../controllers/buyerController'
import { formatDzd } from '../../../utils/currency'
import PageHero from '../../../components/PageHero'
import { Card, buttonStyles, cn } from '../../../components/ui'

export default function BuyerInvoices() {
  const [invoices, setInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  useEffect(() => {
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
        description="Review downloadable invoice history and inspect each order charge in DZD without losing readability in dark mode."
        variant="buyer"
        stats={[
          { label: 'Invoices', value: invoices.length, help: 'Issued records available for download' },
          { label: 'Latest amount', value: selectedInvoice ? formatDzd(selectedInvoice.amount) : '-', help: 'Most recent invoice currently selected' },
          { label: 'Currency', value: 'DZD', help: 'Invoices stay aligned with platform pricing rules' },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden p-4">
          <div className="table-shell">
            <table className="table-base min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>PDF</th>
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
                      <a href={invoice.downloadUrl} className="font-semibold text-emerald-700 transition hover:underline dark:text-emerald-300">
                        Download
                      </a>
                    </td>
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
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedInvoice.id}</h3>
            <div className="mt-4 grid gap-3">
              <div className="surface-muted p-3">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <FiFileText />
                  Order
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{selectedInvoice.orderId}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <FiCreditCard />
                  Amount
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{formatDzd(selectedInvoice.amount)}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="font-semibold text-slate-800 dark:text-slate-100">Notes</p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{selectedInvoice.details}</p>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </section>
  )
}
