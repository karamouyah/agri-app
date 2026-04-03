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
import { FiActivity, FiBarChart2, FiShield, FiUsers } from 'react-icons/fi'
import { getNationalStats } from '../../controllers/adminController'
import { formatDzd } from '../../../utils/currency'

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
    <section className="agri-page space-y-5">
      <div className="surface-card p-6 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Ministry Intelligence</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">National Agriculture Oversight</h2>
        <p className="mt-2 text-sm text-slate-600 md:text-base">
          Monitor active participants, regional sales movement, and price behavior across the marketplace.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="surface-card p-5">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <FiBarChart2 />
            Total Sales Volume
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{summary.totalSalesVolumeTons} tons</h3>
        </article>
        <article className="surface-card p-5">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <FiUsers />
            Active Farmers
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{summary.activeFarmers}</h3>
        </article>
        <article className="surface-card p-5">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <FiUsers />
            Active Buyers
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{summary.activeBuyers}</h3>
        </article>
        <article className="surface-card p-5">
          <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <FiShield />
            Active Transporters
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{summary.activeTransporters}</h3>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="surface-card p-5">
          <h3 className="text-base font-bold text-slate-900">Regional Sales Volumes</h3>
          <p className="mt-1 text-xs text-slate-500">Compare production movement by pickup region</p>
          <div className="mt-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dce9dc" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="volume" fill="#1f7a3d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card p-5">
          <h3 className="text-base font-bold text-slate-900">Price Trends (DZD)</h3>
          <p className="mt-1 text-xs text-slate-500">Monthly movement for strategic market products in Algerian Dinar</p>
          <div className="mt-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dce9dc" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [formatDzd(value), name]} />
                <Legend />
                <Line type="monotone" dataKey="tomatoes" stroke="#1f7a3d" strokeWidth={2.5} />
                <Line type="monotone" dataKey="oranges" stroke="#0ea5a3" strokeWidth={2.5} />
                <Line type="monotone" dataKey="potatoes" stroke="#f59e0b" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="surface-card p-5">
        <h3 className="inline-flex items-center gap-2 text-base font-bold text-slate-900">
          <FiActivity />
          Ministry Action Note
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Use the user and product modules to keep quality standards high, then export reports for policy and
          seasonal interventions.
        </p>
      </div>
    </section>
  )
}
