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
  const [orders, setOrders] = useState([])
  const [revenue, setRevenue] = useState({ total: 0, series: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
        <SkeletonBlock className="h-[360px]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-36" />
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
        eyebrow="Farm Command Center"
        title={`Welcome back, ${user?.farmName || user?.name || 'Farmer'}`}
        description="Monitor demand, protect pricing, and keep your approved produce listings performing through one bright operational workspace."
        variant="farmer"
        stats={[
          { label: 'Monthly Earnings', value: formatDzd(revenue.total), help: 'Tracked revenue for the current period' },
          { label: 'Pending Orders', value: pendingCount, help: 'Orders waiting for review or preparation' },
          { label: 'Delivered', value: deliveredCount, help: 'Completed shipments ready for follow-up' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FiDollarSign} label="Revenue" value={formatDzd(revenue.total)} help="Current month total" />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={orders.length} help="Across all order statuses" tone="slate" />
        <StatCard icon={FiClipboard} label="Pending" value={pendingCount} help="Needs confirmation or preparation" tone="sky" />
        <StatCard icon={FiTrendingUp} label="Delivered" value={deliveredCount} help="Completed fulfillment" tone="emerald" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Revenue Trend</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Earnings performance</h3>
            </div>
            <StatusBadge status="active" />
          </div>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue.series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => [formatDzd(value), 'Revenue']} />
                <Bar dataKey="amount" fill="#16a34a" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Quick Actions</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Move faster through daily farm operations</h3>
          <div className="mt-5 space-y-3">
            <Link to="/farmer/products" className="group flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/25 dark:text-slate-100 dark:hover:border-emerald-700/50 dark:hover:bg-emerald-950/35">
              <span className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100 dark:bg-slate-800 dark:text-emerald-300 dark:ring-slate-700">
                  <FiShoppingBag />
                </span>
                Manage product listings
              </span>
              <FiArrowRight className="transition group-hover:translate-x-0.5" />
            </Link>
            <Link to="/farmer/orders" className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-700/40 dark:hover:bg-slate-800">
              <span className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                  <FiClipboard />
                </span>
                Review incoming orders
              </span>
              <FiArrowRight className="transition group-hover:translate-x-0.5" />
            </Link>
            <Link to="/farmer/revenues" className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-700/40 dark:hover:bg-slate-800">
              <span className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                  <FiDollarSign />
                </span>
                Track revenue details
              </span>
              <FiArrowRight className="transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Recent Orders</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">Latest marketplace demand</h3>
          </div>
          <Link to="/farmer/orders" className={cn(buttonStyles.secondary, 'px-4 py-2')}>
            Open Orders
          </Link>
        </div>
        <div className="table-shell m-4 mt-0">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-semibold text-slate-900">{order.id}</td>
                    <td>{order.product}</td>
                    <td>{order.quantity}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>
                      <Link to="/farmer/orders" className="font-semibold text-emerald-700 transition hover:text-emerald-800">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
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
