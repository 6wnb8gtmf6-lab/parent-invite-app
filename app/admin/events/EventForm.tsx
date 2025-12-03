'use client'

import { createEvent, updateEvent } from './actions'

export default function EventForm({ event }: { event?: any }) {
    return (
        <form action={event ? updateEvent : createEvent} className="space-y-6">
            {event && <input type="hidden" name="id" value={event.id} />}

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Title</label>
                <input
                    type="text"
                    name="title"
                    required
                    defaultValue={event?.title}
                    placeholder="e.g., Fall Conference"
                    className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 px-4 py-3"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                    name="description"
                    rows={3}
                    defaultValue={event?.description}
                    placeholder="Brief description of the event..."
                    className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 px-4 py-3"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Image URL (Optional)</label>
                <input
                    type="url"
                    name="imageUrl"
                    defaultValue={event?.imageUrl}
                    placeholder="https://example.com/image.jpg"
                    className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 px-4 py-3"
                />
                <p className="text-xs text-gray-500 mt-1">Provide a direct link to an image to display on the event page.</p>
            </div>

            <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md"
            >
                {event ? 'Save Changes' : 'Create Event'}
            </button>
        </form>
    )
}
