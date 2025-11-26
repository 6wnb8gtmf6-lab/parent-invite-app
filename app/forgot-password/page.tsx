'use client'

import { useActionState } from 'react'
import { requestPasswordReset } from './actions'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [state, action, pending] = useActionState(requestPasswordReset, null)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {state?.success ? (
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                    If an account exists for that email, we have sent a password reset link.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Return to login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form action={action} className="mt-8 space-y-6">
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="text-red-500 text-sm text-center">
                                {state.error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={pending}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {pending ? 'Sending...' : 'Send reset link'}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Back to login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
