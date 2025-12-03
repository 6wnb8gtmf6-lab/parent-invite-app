'use client'

import { useState } from 'react'
import { createSlot } from '@/app/actions'

type Template = {
    id: string
    name: string
    isDefault: boolean
    collectDonationLink: boolean
}

type EventPage = {
    id: string
    title: string
}

export default function CreateSlotForm({ templates, events }: { templates: Template[], events: EventPage[] }) {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')

    const selectedTemplate = templates.find(t => t.id === selectedTemplateId)
    const showDonationLink = selectedTemplate?.collectDonationLink

    return (
        <form action={createSlot} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Use Template (Optional)</label>
                    <select
                        name="templateId"
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-gray-900 transition-all"
                    >
                        <option value="">-- Select a Template --</option>
                        {templates.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.name} {t.isDefault ? '(Default)' : ''}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Selecting a template will apply its name, description, and data collection settings.</p>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Assign to Event (Optional)</label>
                    <select
                        name="eventPageId"
                        className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-gray-900 transition-all"
                    >
                        <option value="">-- General / No Event --</option>
                        {events.map(e => (
                            <option key={e.id} value={e.id}>
                                {e.title}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Assign this slot to a specific event page.</p>
                </div>
            </div>

            <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Slot Name (Optional)</label>
                        <input
                            type="text"
                            name="name"
                            placeholder={selectedTemplate ? selectedTemplate.name : "e.g., Parent Conference"}
                            className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-gray-900 transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave blank to use template name (if selected).</p>
                    </div>
                    <div className="flex items-center h-full pt-6 space-x-6">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="hideTime"
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                            <span className="text-sm font-bold text-gray-700">Hide Time</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="hideEndTime"
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                            <span className="text-sm font-bold text-gray-700">Hide End Time</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Start Time</label>
                    <input
                        type="datetime-local"
                        name="startTime"
                        required
                        className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-gray-900 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">End Time</label>
                    <input
                        type="datetime-local"
                        name="endTime"
                        className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-gray-900 transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional if "Hide End Time" is checked.</p>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Max Capacity</label>
                    <input
                        type="number"
                        name="maxCapacity"
                        min="1"
                        defaultValue="1"
                        required
                        className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-gray-900 transition-all"
                    />
                </div>
            </div>

            {showDonationLink && (
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Donation Link</label>
                    <input
                        type="url"
                        name="donationLink"
                        required
                        placeholder="e.g., https://amazon.com/..."
                        className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-gray-900 transition-all"
                    />
                </div>
            )}

            <button
                type="submit"
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Time Slot
            </button>
        </form>
    )
}
