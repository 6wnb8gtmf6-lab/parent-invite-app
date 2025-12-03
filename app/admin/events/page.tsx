import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { deleteEvent } from './actions'
import EventForm from './EventForm'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
    const session = await getSession()
    if (!session) redirect('/login')

    const isAdmin = session.user.role === 'ADMIN'
    const where = isAdmin ? {} : { userId: session.user.id }

    // @ts-ignore
    const events = await prisma.eventPage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            _count: { select: { slots: true } }
        }
    })

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Custom Event Pages</h1>
                    <a href="/admin" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        ← Back to Dashboard
                    </a>
                </div>

                {/* Create Event Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Event Page</h2>
                    <EventForm />
                </div>

                {/* Events List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event: any) => (
                        <div key={event.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 relative group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-900 truncate pr-8">{event.title}</h3>
                                <form action={deleteEvent.bind(null, event.id)}>
                                    <button
                                        className="text-red-400 hover:text-red-600 p-1"
                                        onClick={(e) => {
                                            if (!confirm('Are you sure you want to delete this event page?')) {
                                                e.preventDefault()
                                            }
                                        }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </form>
                            </div>

                            {event.imageUrl && (
                                <div className="mb-4 h-32 rounded-lg bg-gray-100 overflow-hidden">
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                </div>
                            )}

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description || 'No description'}</p>

                            <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                                <span>{event._count.slots} Slots Assigned</span>
                                <a href={`/events/${event.slug}`} target="_blank" className="text-blue-600 hover:underline">
                                    View Page
                                </a>
                            </div>
                        </div>
                    ))}

                    {events.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No event pages created yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
