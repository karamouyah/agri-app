import { Card } from '../../../components/ui'

export default function TransporterDashboard() {
  return (
    <Card className="agri-page p-6">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Transporter Dashboard</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Handle delivery missions and update shipment status from this interface.
      </p>
    </Card>
  )
}
