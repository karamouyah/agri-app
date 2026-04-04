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
import { FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import { getRevenueData } from '../../controllers/farmerController'
import { formatDzd } from '../../../utils/currency'
import Reveal from '../../../components/Reveal'

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
    <section className="agri-page space-y-5">
      <Reveal>
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Revenues</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Income overview</h2>
          </div>
          <div className="surface-muted p-3">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              <FiDollarSign />
              Total
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">{formatDzd(data.total)}</p>
          </div>
          <div className="surface-muted p-3">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              <FiTrendingUp />
              Transactions
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{data.transactions.length}</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:col-span-1">
            <h3 className="text-sm font-medium text-slate-500">Total earnings</h3>
            <p className="mt-2 text-3xl font-semibold text-emerald-700">{formatDzd(data.total)}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 md:col-span-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.series}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatDzd(value), 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#059669" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-lg font-semibold text-slate-800">Transactions</h3>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-3 py-2">Order</th>
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
                  <td className="px-3 py-2">{formatDzd(tx.amount)}</td>
                  <td className="px-3 py-2">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  )
}
