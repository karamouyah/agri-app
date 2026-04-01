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
import { getOrders, getRevenueData } from '../../mvc/controllers/farmerController'
import { useAuth } from '../../context/AuthContext'

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

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">
          Welcome, {user?.farmName || 'Farmer'}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Overview of your current operations and earnings this month.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-medium text-slate-500">Total Earnings (Month)</h3>
          <p className="mt-2 text-3xl font-semibold text-emerald-700">{revenue.total} MAD</p>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue.series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-medium text-slate-500">Quick Links</h3>
          <div className="mt-4 grid gap-3">
            <Link
              to="/farmer/products"
              className="rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              Manage Products
            </Link>
            <Link
              to="/farmer/orders"
              className="rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              View Incoming Orders
            </Link>
            <Link
              to="/farmer/revenues"
              className="rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              Track Revenues
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-800">Recent Orders</h3>
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
                  <td className="px-3 py-2">{order.id}</td>
                  <td className="px-3 py-2">{order.product}</td>
                  <td className="px-3 py-2">{order.quantity}</td>
                  <td className="px-3 py-2 capitalize">{order.status}</td>
                  <td className="px-3 py-2">
                    <Link to="/farmer/orders" className="text-emerald-700 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
