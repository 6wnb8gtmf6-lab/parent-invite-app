import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DbRepairLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {children}
        </div>
    )
}
