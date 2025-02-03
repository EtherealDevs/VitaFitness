import { Bell } from "lucide-react"
import Button from "@/components/ui/Button"
import Image from "next/image"

export function DashboardHeader() {
    return (
        <header className="border-b bg-white">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">26°</span>
                    <span className="text-sm text-muted-foreground">Huancayo, Peru</span>
                </div>
                <div className="flex items-center gap-4">
                    <Button>
                        <Bell className="w-5 h-5" />
                    </Button>
                    <Image src="/placeholder.svg" alt="Avatar" className="rounded-full" width={32} height={32} />
                    <Image src="/placeholder.svg" alt="Avatar" className="rounded-full" width={32} height={32} />
                </div>
                <div />
            </div>
        </header>
    )
}

