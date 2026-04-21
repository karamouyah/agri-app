import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FiBarChart2, FiDownload, FiFileText } from 'react-icons/fi'
import { generateReport } from '../../controllers/adminController'
import { useLocations } from '../../../context/LocationContext'
import { formatDzd } from '../../../utils/currency'
import PageHero from '../../../components/PageHero'
import { Card, EmptyState, Input, SectionHeader, Select, buttonStyles, cn } from '../../../components/ui'

const initialForm = {
  region: '',
  category: '',
  fromDate: '',
  toDate: '',
}

const categoryOptions = ['Vegetables', 'Fruits', 'Herbs', 'Dry products']

export default function AdminReports() {
  const { wilayas } = useLocations()
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

  const metrics = useMemo(() => {
    const rows = result.rows || []
    return rows.reduce(
      (summary, row) => ({
        regions: summary.regions.add(row.region),
        totalVolume: summary.totalVolume + Number(row.volume || 0),
        totalRevenue: summary.totalRevenue + Number(row.revenue || 0),
      }),
      { regions: new Set(), totalVolume: 0, totalRevenue: 0 },
    )
  }, [result.rows])

  return (
    <section className="app-page">
      <PageHero
        eyebrow="Reporting Suite"
        title="Generate regional market reports for oversight and planning"
        description="Filter by region, product category, and reporting period to review marketplace volume and revenue before exporting report data."
        variant="admin"
        stats={[
          { label: 'Regions', value: metrics.regions.size || 0, help: 'Regions represented in the current result set' },
          { label: 'Volume', value: metrics.totalVolume || 0, help: 'Aggregated reported volume' },
          { label: 'Revenue', value: formatDzd(metrics.totalRevenue || 0), help: 'Total revenue in DZD' },
        ]}
      />

      <Card className="p-5 md:p-6">
        <SectionHeader
          eyebrow="Filters"
          title="Build and export a report"
          description="Generate a fresh report, then export the current data view as CSV or PDF."
        />

        <form onSubmit={handleGenerate} className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          <Select name="region" value={formData.region} onChange={handleChange}>
            <option value="">All Regions</option>
            {wilayas.map((wilaya) => (
              <option key={wilaya.id} value={wilaya.id}>
                {wilaya.code} - {wilaya.name}
              </option>
            ))}
          </Select>

          <Select name="category" value={formData.category} onChange={handleChange}>
            <option value="">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>

          <Input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} />
          <Input type="date" name="toDate" value={formData.toDate} onChange={handleChange} />

          <button type="submit" className={cn(buttonStyles.primary, 'xl:min-w-44')}>
            <FiBarChart2 />
            Generate
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.alert('Mock CSV download triggered.')}
            className={buttonStyles.secondary}
          >
            <FiDownload />
            Download CSV
          </button>
          <button
            type="button"
            onClick={() => window.alert('Mock PDF download triggered.')}
            className={buttonStyles.secondary}
          >
            <FiFileText />
            Download PDF
          </button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              Report Results
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">Table and revenue chart</h3>
          </div>
          <span className="badge-soft px-3 py-1.5 text-xs">{result.rows.length} rows</span>
        </div>

        {result.rows.length === 0 ? (
          <div className="px-5 pb-6 md:px-6">
            <EmptyState
              icon={FiBarChart2}
              title="No report data yet"
              description="No report generated yet. Select filters and run a report to review regional volume and revenue data."
            />
          </div>
        ) : (
          <div className="grid gap-4 px-5 pb-6 md:px-6 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="table-shell">
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Region</th>
                      <th>Category</th>
                      <th>Volume</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, index) => (
                      <tr key={`${row.region}-${row.category}-${index}`}>
                        <td className="font-semibold text-slate-900 dark:text-slate-100">{row.region}</td>
                        <td>{row.category}</td>
                        <td>{row.volume}</td>
                        <td>{formatDzd(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Card className="p-4 md:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                Revenue Chart
              </p>
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.rows}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatDzd(value), 'Revenue']} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </section>
  )
}
