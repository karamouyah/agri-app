// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
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
import { FiBarChart2, FiShield, FiUsers } from 'react-icons/fi'
import { getNationalStats } from '../../controllers/adminController'
import { formatDzd } from '../../../utils/currency'
import { useAuth } from '../../../context/AuthContext'
import PageHero from '../../../components/PageHero'
import { Card, SkeletonBlock, StatCard } from '../../../components/ui'

export default function AdminDashboard() {
  const { user } = useAuth()
  // State: stores local UI data and is updated by event handlers or API responses.
  const [data, setData] = useState(null)

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    // load handles this module workflow, using its parameters and returning JSX, data, or a service result.
    const load = async () => {
      const stats = await getNationalStats()
      setData(stats)
    }

    load()
  }, [])

  if (!data) {
    return (
      <section className="app-page">
        <SkeletonBlock className="h-[300px]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-32" />
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
        title={`Welcome, ${user?.name || 'Administrator'}`}
        description="Monitor approvals, marketplace activity, regional trade signals, and pricing anomalies from across the national network."
        stats={[
          { label: 'Sales Volume', value: `${summary.totalSalesVolumeTons} T`, help: 'Tracked movement' },
          { label: 'Active Farmers', value: summary.activeFarmers, help: 'Approved sellers' },
          { label: 'Transporters', value: summary.activeTransporters, help: 'Logistics operators' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FiBarChart2} label="Volume" value={`${summary.totalSalesVolumeTons} T`} help="Total captured trade" tone="sky" />
        <StatCard icon={FiUsers} label="Farmers" value={summary.activeFarmers} help="Verified producers" tone="emerald" />
        <StatCard icon={FiUsers} label="Buyers" value={summary.activeBuyers} help="Active wholesale buyers" tone="slate" />
        <StatCard icon={FiShield} label="Logistics" value={summary.activeTransporters} help="Registered carriers" tone="emerald" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5 md:p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Regional Trade Volume</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Dispatched tonnage by origin wilaya</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" vertical={false} />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="volume" name="Tons" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Strategic Price Index card removed per request */}
      </div>
    </section>
  )
}

