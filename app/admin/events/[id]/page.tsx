import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import EventForm from '../EventForm'

export const dynamic = 'force-dynamic'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session) redirect('/login')

    const { id } = await params

    const event = await prisma.eventPage.findUnique({
        where: { id }
    })

    if (!event) notFound()

    if (session.user.role !== 'ADMIN' && event.userId !== session.user.id) {
        redirect('/admin/events')
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Event Page</h1>
                    <a href="/admin/events" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        ← Back to Events
                    </a>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <EventForm event={event} />
                </div>
            </div>
        </div>
    )
}
