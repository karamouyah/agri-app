// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FiArrowRight, FiClipboard, FiDollarSign, FiShoppingBag, FiTrendingUp } from 'react-icons/fi'
import { getOrders, getRevenueData } from '../../controllers/farmerController'
import { useAuth } from '../../../context/AuthContext'
import { formatDzd } from '../../../utils/currency'
import PageHero from '../../../components/PageHero'
import { Card, SkeletonBlock, StatCard, StatusBadge, buttonStyles, cn } from '../../../components/ui'

export default function FarmerDashboard() {
  const { user } = useAuth()
  // State: stores local UI data and is updated by event handlers or API responses.
  const [orders, setOrders] = useState([])
  // State: stores local UI data and is updated by event handlers or API responses.
  const [revenue, setRevenue] = useState({ total: 0, series: [] })
  // State: stores local UI data and is updated by event handlers or API responses.
  const [loading, setLoading] = useState(true)

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    // load handles this module workflow, using its parameters and returning JSX, data, or a service result.
    const load = async () => {
      const [ordersData, revenueData] = await Promise.all([getOrders(), getRevenueData()])
      setOrders(ordersData)
      setRevenue(revenueData)
      setLoading(false)
    }

    load()
  }, [])

  const recentOrders = useMemo(() => orders.slice(0, 4), [orders])
  const deliveredCount = orders.filter((item) => item.status === 'delivered').length
  const pendingCount = orders.filter((item) => item.status === 'pending').length

  if (loading) {
    return (
      <section className="app-page">
        <SkeletonBlock className="h-[300px]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <SkeletonBlock className="h-80" />
          <SkeletonBlock className="h-80" />
        </div>
      </section>
    )
  }

  return (
    <section className="app-page">
      <PageHero
        eyebrow="Dashboard"
        title={`Welcome, ${user?.farmName || user?.name || 'Farmer'}`}
        description="Follow your orders, track your earnings, and keep your farm products up to date."
        variant="farmer"
        stats={[
          { label: 'Monthly Earnings', value: formatDzd(revenue.total), help: 'Current period' },
          { label: 'Pending Orders', value: pendingCount, help: 'Needs review' },
          { label: 'Delivered', value: deliveredCount, help: 'Completed' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FiDollarSign} label="Revenue" value={formatDzd(revenue.total)} help="Current month total" />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={orders.length} help="Across all statuses" tone="slate" />
        <StatCard icon={FiClipboard} label="Pending" value={pendingCount} help="Needs confirmation" tone="sky" />
        <StatCard icon={FiTrendingUp} label="Delivered" value={deliveredCount} help="Completed fulfillment" tone="emerald" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Revenue Trend</h3>
            </div>
            <StatusBadge status="active" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue.series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" vertical={false} />
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip formatter={(value) => [formatDzd(value), 'Revenue']} cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <Link to="/farmer/products" className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/50">
              <span className="inline-flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <FiShoppingBag />
                </span>
                Manage products
              </span>
              <FiArrowRight className="text-slate-400 transition group-hover:translate-x-1" />
            </Link>
            <Link to="/farmer/orders" className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/50">
              <span className="inline-flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                  <FiClipboard />
                </span>
                Review orders
              </span>
              <FiArrowRight className="text-slate-400 transition group-hover:translate-x-1" />
            </Link>
            <Link to="/farmer/revenues" className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/50">
              <span className="inline-flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <FiDollarSign />
                </span>
                Track revenue
              </span>
              <FiArrowRight className="text-slate-400 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Orders</h3>
          </div>
          <Link to="/farmer/orders" className=" px-3 py-1.5 text-xs">
            View All
          </Link>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="table-base w-full">
              <thead>
                <tr>
                  <th className="text-left">Order ID</th>
                  <th className="text-left">Product</th>
                  <th className="text-left">Quantity</th>
                  <th className="text-left">Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium text-slate-900 dark:text-slate-100">{order.id}</td>
                    <td>{order.product}</td>
                    <td>{order.quantity}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="text-right">
                      <Link to="/farmer/orders" className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                      No recent orders yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </section>
  )
}

