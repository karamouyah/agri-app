import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getNationalStats } from '../../mvc/controllers/adminController'

export default function AdminDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const load = async () => {
      const stats = await getNationalStats()
      setData(stats)
    }

    load()
  }, [])

  if (!data) {
    return <p className="text-sm text-slate-600">Loading national statistics...</p>
  }

  const { summary, regionalSales, priceTrends } = data

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Total Sales Volume</p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-800">{summary.totalSalesVolumeTons} tons</h3>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Active Farmers</p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-800">{summary.activeFarmers}</h3>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Active Buyers</p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-800">{summary.activeBuyers}</h3>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Active Transporters</p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-800">{summary.activeTransporters}</h3>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-800">Regional Sales Volumes</h3>
          <div className="mt-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="volume" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-800">Price Trends (Key Products)</h3>
          <div className="mt-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tomatoes" stroke="#059669" strokeWidth={2} />
                <Line type="monotone" dataKey="oranges" stroke="#0284c7" strokeWidth={2} />
                <Line type="monotone" dataKey="potatoes" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
