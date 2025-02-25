import { DashboardMetrics } from "../components/dashboard-metrics"
import { QuickAccess } from "../components/quick-access"
import { Statistics } from "../components/statistics"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardMetrics />
      <QuickAccess />
      <Statistics />
    </div>
  )
}

