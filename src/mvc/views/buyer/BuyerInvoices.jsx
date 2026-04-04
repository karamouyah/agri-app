import { useEffect, useState } from 'react'
import { FiCreditCard, FiFileText } from 'react-icons/fi'
import { getInvoices } from '../../controllers/buyerController'
import { formatDzd } from '../../../utils/currency'
import Reveal from '../../../components/Reveal'

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
    <section className="agri-page space-y-5">
      <Reveal>
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Invoices</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Payment records</h2>
          </div>
          <div className="surface-muted p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Invoices</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{invoices.length}</p>
          </div>
          <div className="surface-muted p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Latest</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">
              {selectedInvoice ? formatDzd(selectedInvoice.amount) : '-'}
            </p>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <Reveal delay={50}>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-3 py-2">Invoice</th>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">PDF</th>
                  <th className="px-3 py-2">View</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-semibold text-slate-900">{invoice.id}</td>
                    <td className="px-3 py-2">{invoice.orderId}</td>
                    <td className="px-3 py-2">{invoice.date}</td>
                    <td className="px-3 py-2">{formatDzd(invoice.amount)}</td>
                    <td className="px-3 py-2">
                      <a href={invoice.downloadUrl} className="font-semibold text-emerald-700 hover:underline">
                        Download
                      </a>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(invoice)}
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

        {selectedInvoice ? (
          <Reveal delay={100}>
            <aside className="rounded-lg border border-slate-200 bg-white p-5 text-sm">
              <h3 className="text-lg font-bold text-slate-900">{selectedInvoice.id}</h3>
              <div className="mt-4 grid gap-3">
                <div className="surface-muted p-3">
                  <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                    <FiFileText />
                    Order
                  </p>
                  <p className="mt-1 text-slate-600">{selectedInvoice.orderId}</p>
                </div>
                <div className="surface-muted p-3">
                  <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                    <FiCreditCard />
                    Amount
                  </p>
                  <p className="mt-1 text-slate-600">{formatDzd(selectedInvoice.amount)}</p>
                </div>
                <div className="surface-muted p-3">
                  <p className="font-semibold text-slate-800">Notes</p>
                  <p className="mt-1 text-slate-600">{selectedInvoice.details}</p>
                </div>
              </div>
            </aside>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
