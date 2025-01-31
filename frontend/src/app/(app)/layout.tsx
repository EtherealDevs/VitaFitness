'use client'

import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/(app)/Navigation'
import Loading from '@/app/(app)/Loading'

// Agregar el tipo de props para AppLayout
interface AppLayoutProps {
    children: React.ReactNode; // Definir children como una propiedad requerida
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation user={user} />

            <main>{children}</main>
        </div>
    )
}

export default AppLayout
