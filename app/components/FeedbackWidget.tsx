'use client'

import { useState } from 'react'
import { submitRecommendation } from '@/app/actions'

export default function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    async function handleSubmit(formData: FormData) {
        setStatus('submitting')
        try {
            await submitRecommendation(formData)
            setStatus('success')
            setTimeout(() => {
                setIsOpen(false)
                setStatus('idle')
            }, 2000)
        } catch (e) {
            setStatus('error')
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80 sm:w-96 animate-in slide-in-from-bottom-10 fade-in duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Recommend Enhancements</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-green-800 font-medium">Thank you for your feedback!</p>
                        </div>
                    ) : (
                        <form action={handleSubmit}>
                            <textarea
                                name="feedback"
                                required
                                placeholder="What features would you like to see? How can we improve?"
                                className="w-full h-32 p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none text-sm mb-4"
                            />

                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500 italic max-w-[60%]">
                                    Built by parents for parents and teachers ❤️
                                </p>
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
                                >
                                    {status === 'submitting' ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-full shadow-lg border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-200"
                >
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="font-medium text-sm">Feedback</span>
                </button>
            )}
        </div>
    )
}
