import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import EditSlotForm from './EditSlotForm'
import SignupList from './SignupList'

export const dynamic = 'force-dynamic'

export default async function EditSlotPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session) redirect('/login')

    const { id } = await params

    const slot = await prisma.slot.findUnique({
        where: { id },
        include: {
            createdBy: { select: { id: true } },
            signups: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!slot) notFound()

    if (session.user.role !== 'ADMIN' && slot.createdById !== session.user.id) {
        redirect('/admin')
    }

    // Fetch events for the dropdown
    const eventWhere = session.user.role === 'ADMIN' ? {} : { userId: session.user.id }
    // @ts-ignore
    const events = await prisma.eventPage.findMany({
        where: eventWhere,
        orderBy: { title: 'asc' },
        select: { id: true, title: true }
    })

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Slot</h1>
                    <a href="/admin" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        ← Back to Dashboard
                    </a>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
                    <EditSlotForm slot={slot} events={events} />
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Registered Parents</h2>
                    <SignupList signups={slot.signups} />
                </div>
            </div>
        </div>
    )
}
