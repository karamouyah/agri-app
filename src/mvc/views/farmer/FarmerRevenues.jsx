// File responsibility: Renders an application screen that is mounted from the React router for a specific user workflow.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
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
import { getRevenueData } from '../../controllers/farmerController'
import { formatDzd } from '../../../utils/currency'
import PageHero from '../../../components/PageHero'
import { Card } from '../../../components/ui'

export default function FarmerRevenues() {
  // State: stores local UI data and is updated by event handlers or API responses.
  const [data, setData] = useState({ total: 0, series: [], transactions: [] })

  // Effect: runs after render to load data, sync storage, or react to dependency changes.
  useEffect(() => {
    // load handles this module workflow, using its parameters and returning JSX, data, or a service result.
    const load = async () => {
      const revenueData = await getRevenueData()
      setData(revenueData)
    }

    load()
  }, [])

  return (
    <section className="app-page">
      <PageHero
        eyebrow="Revenues"
        title="Income overview"
        description="Track DZD earnings, monitor transaction flow, and review revenue trends from one readable farmer finance view."
        variant="farmer"
        stats={[
          { label: 'Total', value: formatDzd(data.total), help: 'Current accumulated earnings' },
          { label: 'Transactions', value: data.transactions.length, help: 'Recorded farmer payments and settlements' },
          { label: 'Trend', value: data.series.length, help: 'Revenue periods available in the chart' },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5 md:col-span-1">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total earnings</h3>
          <p className="mt-2 text-3xl font-semibold text-emerald-700 dark:text-emerald-300">{formatDzd(data.total)}</p>
        </Card>

        <Card className="p-5 md:col-span-2">
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
        </Card>
      </div>

      <Card className="overflow-hidden p-4">
        <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">Transactions</h3>
        <div className="table-shell">
          <table className="table-base min-w-full text-left text-sm">
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.product}</td>
                  <td>{formatDzd(tx.amount)}</td>
                  <td>{tx.date}</td>
                </tr>
              ))}
              {data.transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    No revenue transactions yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  )
}
