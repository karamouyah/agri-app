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
import PageHero from '../../../components/PageHero'
import { Card, SkeletonBlock, StatCard } from '../../../components/ui'

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
    return (
      <section className="app-page">
        <SkeletonBlock className="h-[360px]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-36" />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <SkeletonBlock className="h-96" />
          <SkeletonBlock className="h-96" />
        </div>
      </section>
    )
  }

  const { summary, regionalSales, priceTrends } = data

  return (
    <section className="app-page">
      <PageHero
        eyebrow="Ministry Intelligence"
        title="Monitor approvals, marketplace activity, and regional trade signals"
        description="Use this dashboard to follow active participants, market movement by region, and price trends that may require review or intervention."
        variant="admin"
        stats={[
          { label: 'Sales Volume', value: `${summary.totalSalesVolumeTons} tons`, help: 'Tracked marketplace movement across current data' },
          { label: 'Active Farmers', value: summary.activeFarmers, help: 'Approved sellers on the platform' },
          { label: 'Transporters', value: summary.activeTransporters, help: 'Active delivery operators' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FiBarChart2} label="Sales Volume" value={`${summary.totalSalesVolumeTons} tons`} help="Current monitored trade volume" />
        <StatCard icon={FiUsers} label="Active Farmers" value={summary.activeFarmers} help="Approved producers" tone="slate" />
        <StatCard icon={FiUsers} label="Active Buyers" value={summary.activeBuyers} help="Verified buyers" tone="sky" />
        <StatCard icon={FiShield} label="Transporters" value={summary.activeTransporters} help="Active logistics operators" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Regional Sales</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Volume by pickup region</h3>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="volume" fill="#16a34a" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Price Trends</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Strategic products in DZD</h3>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [formatDzd(value), name]} />
                <Legend />
                <Line type="monotone" dataKey="tomatoes" stroke="#16a34a" strokeWidth={2.5} />
                <Line type="monotone" dataKey="oranges" stroke="#0ea5a3" strokeWidth={2.5} />
                <Line type="monotone" dataKey="potatoes" stroke="#475569" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="inline-flex items-center gap-2 text-xl font-bold text-slate-900">
          <FiActivity />
          Oversight Focus
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Review pending user approvals and product activity first, then use reports to compare regional movement, pricing behavior, and delivery performance before taking policy or moderation action.
        </p>
      </Card>
    </section>
  )
}
