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

export default function FarmerDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [revenue, setRevenue] = useState({ total: 0, series: [] })

  useEffect(() => {
    const load = async () => {
      const [ordersData, revenueData] = await Promise.all([getOrders(), getRevenueData()])
      setOrders(ordersData)
      setRevenue(revenueData)
    }

    load()
  }, [])

  const recentOrders = useMemo(() => orders.slice(0, 4), [orders])
  const deliveredCount = orders.filter((item) => item.status === 'delivered').length
  const pendingCount = orders.filter((item) => item.status === 'pending').length

  return (
    <section className="agri-page space-y-6">
      <div className="surface-card relative overflow-hidden p-6 md:p-7">
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-lime-200/50 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Farm Command Center</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            Welcome back, {user?.farmName || user?.name || 'Farmer'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 md:text-base">
            Monitor production performance, manage orders, and keep your marketplace flow healthy.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="surface-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Earnings</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">{revenue.total} MAD</p>
          <p className="mt-1 text-xs text-slate-500">Total tracked transactions this month</p>
        </article>

        <article className="surface-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Orders</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{orders.length}</p>
          <p className="mt-1 text-xs text-slate-500">Across pending, in progress, and delivered</p>
        </article>

        <article className="surface-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Orders</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{pendingCount}</p>
          <p className="mt-1 text-xs text-slate-500">Need confirmation or preparation</p>
        </article>

        <article className="surface-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Delivered</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{deliveredCount}</p>
          <p className="mt-1 text-xs text-slate-500">Completed shipments</p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900">Earnings Trend</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
              <FiTrendingUp />
              Revenue growth
            </span>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue.series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dce9dc" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#1f7a3d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card p-5">
          <h3 className="text-base font-bold text-slate-900">Quick Links</h3>
          <div className="mt-4 space-y-3 text-sm">
            <Link
              to="/farmer/products"
              className="surface-muted flex items-center justify-between px-3 py-2.5 text-slate-700 transition hover:border-emerald-300"
            >
              <span className="inline-flex items-center gap-2 font-semibold">
                <FiShoppingBag />
                Manage Products
              </span>
              <FiArrowRight />
            </Link>
            <Link
              to="/farmer/orders"
              className="surface-muted flex items-center justify-between px-3 py-2.5 text-slate-700 transition hover:border-emerald-300"
            >
              <span className="inline-flex items-center gap-2 font-semibold">
                <FiClipboard />
                View Incoming Orders
              </span>
              <FiArrowRight />
            </Link>
            <Link
              to="/farmer/revenues"
              className="surface-muted flex items-center justify-between px-3 py-2.5 text-slate-700 transition hover:border-emerald-300"
            >
              <span className="inline-flex items-center gap-2 font-semibold">
                <FiDollarSign />
                Track Revenues
              </span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      <div className="surface-card p-5">
        <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-3 py-2">Order ID</th>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Quantity</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-semibold text-slate-900">{order.id}</td>
                  <td className="px-3 py-2">{order.product}</td>
                  <td className="px-3 py-2">{order.quantity}</td>
                  <td className="px-3 py-2 capitalize">{order.status}</td>
                  <td className="px-3 py-2">
                    <Link to="/farmer/orders" className="font-semibold text-emerald-700 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={5}>
                    No recent orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
