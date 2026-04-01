import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { generateReport } from '../../controllers/adminController'

const initialForm = {
  region: '',
  category: '',
  fromDate: '',
  toDate: '',
}

export default function AdminReports() {
  const [formData, setFormData] = useState(initialForm)
  const [result, setResult] = useState({ rows: [] })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async (event) => {
    event.preventDefault()
    const report = await generateReport(formData)
    setResult(report)
  }

  return (
    <section className="agri-page space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">Reports</h2>
        <form onSubmit={handleGenerate} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Regions</option>
            <option value="Rabat">Rabat</option>
            <option value="Meknes">Meknes</option>
            <option value="Fes">Fes</option>
            <option value="Casablanca">Casablanca</option>
            <option value="Kenitra">Kenitra</option>
          </select>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Cereals">Cereals</option>
            <option value="Legumes">Legumes</option>
          </select>

          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />

          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Generate Report
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.alert('Mock CSV download triggered.')}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
            >
              Download CSV
            </button>
            <button
              type="button"
              onClick={() => window.alert('Mock PDF download triggered.')}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
            >
              Download PDF
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-base font-semibold text-slate-800">Results Table</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-3 py-2">Region</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Volume</th>
                <th className="px-3 py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, index) => (
                <tr key={`${row.region}-${row.category}-${index}`} className="border-b border-slate-100">
                  <td className="px-3 py-2">{row.region}</td>
                  <td className="px-3 py-2">{row.category}</td>
                  <td className="px-3 py-2">{row.volume}</td>
                  <td className="px-3 py-2">{row.revenue} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.rows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}


