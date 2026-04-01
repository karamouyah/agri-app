import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getRevenueData } from '../../mvc/controllers/farmerController'

export default function FarmerRevenues() {
  const [data, setData] = useState({ total: 0, series: [], transactions: [] })

  useEffect(() => {
    const load = async () => {
      const revenueData = await getRevenueData()
      setData(revenueData)
    }

    load()
  }, [])

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">Track Revenues</h2>
        <p className="mt-1 text-sm text-slate-600">Total earnings and revenue trends over time.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 md:col-span-1">
          <h3 className="text-sm font-medium text-slate-500">Total Earnings</h3>
          <p className="mt-2 text-3xl font-semibold text-emerald-700">{data.total} MAD</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 md:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#059669" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-lg font-semibold text-slate-800">Transactions</h3>
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-3 py-2">Order ID</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-slate-100">
                <td className="px-3 py-2">{tx.id}</td>
                <td className="px-3 py-2">{tx.product}</td>
                <td className="px-3 py-2">{tx.amount} MAD</td>
                <td className="px-3 py-2">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
