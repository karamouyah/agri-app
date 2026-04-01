import { useEffect, useState } from 'react'
import { getInvoices } from '../../mvc/controllers/buyerController'

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
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">Invoices</h2>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-3 py-2">Invoice ID</th>
              <th className="px-3 py-2">Order ID</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">PDF</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-slate-100">
                <td className="px-3 py-2">{invoice.id}</td>
                <td className="px-3 py-2">{invoice.orderId}</td>
                <td className="px-3 py-2">{invoice.date}</td>
                <td className="px-3 py-2">{invoice.amount} MAD</td>
                <td className="px-3 py-2">
                  <a href={invoice.downloadUrl} className="text-emerald-700 hover:underline">
                    Download
                  </a>
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(invoice)}
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

      {selectedInvoice && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-700">
          <h3 className="text-lg font-semibold text-slate-800">Invoice Details - {selectedInvoice.id}</h3>
          <div className="mt-3 space-y-1">
            <p>
              <span className="font-medium">Order ID:</span> {selectedInvoice.orderId}
            </p>
            <p>
              <span className="font-medium">Date:</span> {selectedInvoice.date}
            </p>
            <p>
              <span className="font-medium">Amount:</span> {selectedInvoice.amount} MAD
            </p>
            <p>
              <span className="font-medium">Notes:</span> {selectedInvoice.details}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
