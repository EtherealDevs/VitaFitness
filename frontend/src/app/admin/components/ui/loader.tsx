import type { FC } from 'react'

interface LoaderProps {
    size?: 'small' | 'medium' | 'large'
    text?: string
    fullScreen?: boolean
    variant?: 'purple' | 'green'
}

const Loader: FC<LoaderProps> = ({
    size = 'medium',
    text,
    fullScreen = false,
    variant = 'purple',
}) => {
    // Size mappings
    const sizeMap = {
        small: {
            spinner: 'h-5 w-5',
            text: 'text-sm',
        },
        medium: {
            spinner: 'h-8 w-8',
            text: 'text-base',
        },
        large: {
            spinner: 'h-12 w-12',
            text: 'text-lg',
        },
    }

    // Color variants
    const colorMap = {
        purple: 'border-purple-600 dark:border-purple-400',
        green: 'border-green-600 dark:border-green-400',
    }

    // Container classes
    const containerClasses = fullScreen
        ? 'fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50'
        : 'flex flex-col items-center justify-center py-6'

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center gap-3">
                <div
                    className={`animate-spin rounded-full border-b-2 ${colorMap[variant]} ${sizeMap[size].spinner}`}
                    role="status"
                    aria-label="Loading"
                />
                {text && (
                    <p
                        className={`text-gray-600 dark:text-gray-300 ${sizeMap[size].text}`}>
                        {text}
                    </p>
                )}
            </div>
        </div>
    )
}

export default Loader
