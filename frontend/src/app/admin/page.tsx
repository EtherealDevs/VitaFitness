import { DashboardNav } from "./dashboard/components/dashboard-nav"
import { DashboardHeader } from "./dashboard/components/dashboard-header"
import { QuickAccess } from "./dashboard/components/quick-access"
import { Statistics } from "./dashboard/components/statistics"
import { MainMetrics } from "./dashboard/components/main-metrics"

export default function DashboardPage() {
    return (
        <div className="flex h-screen bg-background">
            <DashboardNav />
            <main className="flex-1 overflow-y-auto">
                <DashboardHeader />
                <div className="p-6 space-y-6">
                    <MainMetrics />
                    <QuickAccess />
                    <Statistics />
                </div>
            </main>
        </div>
    )
}
