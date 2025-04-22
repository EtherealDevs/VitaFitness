'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import Loader from '@/app/admin/components/ui/loader'

interface LoadingContextType {
    showLoader: (options?: { text?: string; fullScreen?: boolean }) => void
    hideLoader: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState<string | undefined>(
        undefined,
    )
    const [isFullScreen, setIsFullScreen] = useState(true)

    const showLoader = (options?: { text?: string; fullScreen?: boolean }) => {
        setLoadingText(options?.text)
        setIsFullScreen(options?.fullScreen !== false)
        setLoading(true)
    }

    const hideLoader = () => {
        setLoading(false)
    }

    return (
        <LoadingContext.Provider value={{ showLoader, hideLoader }}>
            {loading && <Loader text={loadingText} fullScreen={isFullScreen} />}
            {children}
        </LoadingContext.Provider>
    )
}

export function useLoading() {
    const context = useContext(LoadingContext)
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider')
    }
    return context
}
