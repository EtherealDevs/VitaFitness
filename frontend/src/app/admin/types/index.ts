// Student Types
export interface Student {
    id: string
    name: string
    last_name: string
    phone: string
    dni: string
    registration_date: string
    status: 'activo' | 'inactivo' | 'pendiente'
    paymentDueDate: string
    daysOverdue: number
    daysUntilDue: number
    remainingClasses: number
    canAttend: boolean
    branch: string
    payments?: Payment[]
    attendances?: Attendance[]
    accountInfo?: AccountInfo
    address?: string
    birthDate?: string
    memberSince?: string
    lastPaymentAmount?: number
    paymentHistory?: Payment[]
    attendanceHistory?: AttendanceRecord[]
}

export interface Attendance {
    date: string
    classSchedule: ClassSchedule
}

export interface AttendanceRecord {
    date: string
    className: string
}

export interface AccountInfo {
    balance: number
    lastEntryDate: string
    lastEntryTime: string
    lastPaymentDate: string
    lastPaymentPlan: string
    lastPaymentAmount: number
}

// Teacher Types
export interface Teacher {
    id: string
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
    schedules: TeacherSchedule[]
    originalScheduleData: ScheduleData[]
    classes: TeacherClass[]
    created_at: string
    updated_at: string
}

export interface TeacherSchedule {
    schedule_id: string
    days: string[]
    timeslots: Timeslot[]
}

export interface ScheduleData {
    schedule_id: string
    schedule_days: string[]
    timeslot_id: string
    timeslot_hour: string
}

export interface Timeslot {
    id: string
    hour: string
}

export interface TeacherClass {
    class_id: string
    plan: [plan_id: string, name: string]
}

export interface TeacherFromServer {
    id: string
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
    schedules: ScheduleData[]
    classes: TeacherClass[]
    created_at: string
    updated_at: string
}

// Payment Types
export interface Payment {
    id: string
    student_id: string
    amount: number
    payment_date: string
    expiration_date: string
    status: 'pagado' | 'pendiente' | 'vencido'
    payment_method?: string
    notes?: string
    classSchedule?: ClassSchedule
    created_at: string
    updated_at: string
}

// Class and Schedule Types
export interface ClassSchedule {
    id: string
    class: Class
    schedule?: Schedule
}

export interface Class {
    id: string
    name: string
}

export interface Schedule {
    id: string
    days: string[]
    timeslots: StudentTimeslot[]
}

export interface StudentTimeslot {
    id: string
    hour: string | string[]
}

// API Response Types
export interface StudentsResponse {
    students: Student[]
    total: number
}

export interface TeachersResponse {
    teachers: Teacher[]
    total: number
}

export interface PaymentResponse {
    payment: Payment
    message: string
}

// Report Types
export interface StudentReportData {
    totalStudents: number
    activeStudents: number
    inactiveStudents: number
    studentsWithDebt: number
    studentsByClass: ClassCount[]
    studentsBySchedule: ScheduleCount[]
    recentRegistrations: number
}

export interface TeacherReportData {
    totalTeachers: number
    teachersByStudents: TeacherStudentCount[]
    teachersByClass: TeacherClassCount[]
}

export interface PaymentReportData {
    totalRevenue: number
    monthlyRevenue: number
    revenueByClass: ClassRevenue[]
    averagePayment: number
    pendingPayments: number
    overduePayments: number
}

export interface ClassCount {
    className: string
    count: number
}

export interface ScheduleCount {
    schedule: string
    count: number
}

export interface TeacherStudentCount {
    teacherName: string
    studentCount: number
}

export interface TeacherClassCount {
    teacherName: string
    className: string
    studentCount: number
}

export interface ClassRevenue {
    className: string
    revenue: number
}
