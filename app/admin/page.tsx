import { prisma } from '@/lib/db'
import { createSlot, deleteSlot } from '../actions'

export default async function AdminPage() {
    const slots = await prisma.slot.findMany({
        orderBy: { startTime: 'asc' },
        include: { _count: { select: { signups: true } } },
    })

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Create New Slot</h2>
                    <form action={createSlot} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Time</label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
                                <input
                                    type="number"
                                    name="maxCapacity"
                                    min="1"
                                    defaultValue="1"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Slot
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <h2 className="text-xl font-semibold p-6 border-b">Existing Slots</h2>
                    <ul className="divide-y divide-gray-200">
                        {slots.map((slot) => (
                            <li key={slot.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <p className="text-sm font-medium text-indigo-600">
                                        {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleTimeString()}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Capacity: {slot._count.signups} / {slot.maxCapacity}
                                    </p>
                                </div>
                                <form action={deleteSlot.bind(null, slot.id)}>
                                    <button
                                        type="submit"
                                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </form>
                            </li>
                        ))}
                        {slots.length === 0 && (
                            <li className="p-6 text-center text-gray-500">No slots created yet.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
