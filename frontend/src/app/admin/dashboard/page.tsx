'use client'
import { useEffect, useState } from 'react'
import { DashboardMetrics } from '../components/main-metrics'
import { QuickAccess } from '../components/quick-access'
import { Statistics } from '../components/statiscs'
import axios from '@/lib/axios'
interface Class {
    class_id: string
    plan: string
    students_count: number
}
interface classToday {
    day: string
    class: Class[]
    total_classes: number
}

interface Statistics {
    students_per_plan: Record<string, number>
    students_per_teacher: Record<string, number>
    classes_today: classToday
    students_per_class: {
        classes: Class[]
    }
    students_per_week: []
    payments_per_month: []
    total_students: number
    total_income: number
}
export default function DashboardPage() {
    const [statistics, setStatistics] = useState<Statistics>({
        students_per_plan: {},
        students_per_teacher: {},
        classes_today: {
            day: '',
            class: [],
            total_classes: 0,
        },
        students_per_class: {
            classes: [],
        },
        students_per_week: [],
        payments_per_month: [],
        total_students: 0,
        total_income: 0,
    })
    useEffect(() => {
        axios.get('/api/statistics').then(res => {
            setStatistics(res.data)
        })
    }, [])

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <DashboardMetrics
                total_students={statistics.total_students}
                total_classes={statistics.classes_today.total_classes}
                total_income={statistics.total_income}
            />
            <QuickAccess />
            <Statistics
                attendanceData={statistics.students_per_week}
                revenueData={statistics.payments_per_month}
            />
        </div>
    )
}
