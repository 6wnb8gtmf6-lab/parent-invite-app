import { prisma } from '@/lib/db'
import SignupForm from '../SignupForm'
import { Slot } from '@prisma/client'

export const dynamic = 'force-dynamic'

type SlotWithCount = Slot & {
    _count: { signups: number }
    name?: string | null
    description?: string | null
    collectContributing?: boolean
    collectDonating?: boolean
}

export default async function HomeDesign2() {
    let slots: SlotWithCount[] = []
    let error = null

    try {
        slots = await prisma.slot.findMany({
            orderBy: { startTime: 'asc' },
            include: {
                _count: { select: { signups: true } },
                createdBy: { select: { name: true, username: true } }
            },
        })
    } catch (e: any) {
        console.error('Failed to fetch slots:', e)
        error = e.message || 'Failed to load slots'
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50">
                <div className="text-center">
                    <h1 className="text-2xl font-serif font-bold text-amber-900 mb-2">System Unavailable</h1>
                    <p className="text-amber-700">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FFFBF5] font-serif">
            {/* Warm Header */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-amber-100">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-amber-900">San Ramon Community</h1>
                    <a href="/login" className="px-6 py-2 bg-amber-100 text-amber-900 rounded-full hover:bg-amber-200 transition-colors font-medium text-sm">
                        Teacher Portal
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative h-[600px]">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1444491741275-3747c53c99b4?q=80&w=2070&auto=format&fit=crop"
                        alt="Golden Hills"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 via-transparent to-[#FFFBF5]"></div>
                </div>
                <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center justify-center text-center pt-20">
                    <div>
                        <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-4 border border-white/30">
                            Fall 2025 Conferences
                        </span>
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                            Building Bridges<br />Together
                        </h2>
                        <p className="text-xl text-amber-50 max-w-2xl mx-auto drop-shadow-md">
                            Join us for parent-teacher conferences. Let's collaborate to ensure every child thrives in our community.
                        </p>
                    </div>
                </div>
            </div>

            {/* Slots Section */}
            <div className="max-w-4xl mx-auto px-4 py-16 -mt-20 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-amber-100">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-900 mb-3">Reserve Your Time</h3>
                        <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-6">
                        {slots.map((slot) => {
                            const isFull = slot._count.signups >= slot.maxCapacity
                            // @ts-ignore
                            const teacherName = slot.createdBy?.name || slot.createdBy?.username || 'Unknown Teacher'

                            return (
                                <div key={slot.id} className="bg-[#FFFBF5] rounded-2xl border border-amber-100 overflow-hidden transition-all hover:shadow-md">
                                    <details className="group">
                                        <summary className="list-none cursor-pointer p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-full bg-white border-2 border-amber-200 flex items-center justify-center text-amber-700 font-bold shadow-sm">
                                                        {new Date(slot.startTime).getDate()}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-900">
                                                            {slot.name || 'Conference Slot'}
                                                        </h4>
                                                        <p className="text-amber-800/80 font-medium">
                                                            {new Date(slot.startTime).toLocaleTimeString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">Teacher</p>
                                                        <p className="font-medium text-gray-900">{teacherName}</p>
                                                    </div>
                                                    {isFull ? (
                                                        <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-sm font-bold">Full</span>
                                                    ) : (
                                                        <span className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-sm group-open:hidden">
                                                            Select
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {slot.description && (
                                                <p className="mt-4 text-gray-600 text-sm italic pl-[72px]">{slot.description}</p>
                                            )}
                                        </summary>

                                        {!isFull && (
                                            <div className="px-6 pb-8 pt-2 pl-[24px] md:pl-[88px]">
                                                <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm">
                                                    <SignupForm
                                                        slotId={slot.id}
                                                        collectContributing={slot.collectContributing}
                                                        collectDonating={slot.collectDonating}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </details>
                                </div>
                            )
                        })}

                        {slots.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-amber-800">No slots currently available. Please check back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
