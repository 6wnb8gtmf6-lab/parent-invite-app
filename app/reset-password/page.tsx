'use client'

import { useActionState, useState, Suspense } from 'react'
import { resetPassword } from './actions'
import { getPasswordRequirements, getPasswordStrengthScore } from '@/lib/password'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    // Bind the token to the action. Note: useActionState passes state as first arg, so we need to handle that in the action or bind carefully.
    // The action signature is (token, prevState, formData).
    // We bind token first.
    const resetPasswordWithToken = resetPassword.bind(null, token || '')
    const [state, action, pending] = useActionState(resetPasswordWithToken, null)

    const [password, setPassword] = useState('')
    const requirements = getPasswordRequirements(password)
    const strengthScore = getPasswordStrengthScore(password)

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Invalid Link</h2>
                    <p className="mt-2 text-gray-600">
                        This password reset link is invalid or missing.
                    </p>
                    <div className="mt-6">
                        <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Request a new link
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Set new password
                    </h2>
                </div>

                <form action={action} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Password Strength Meter */}
                        <div className="mt-2">
                            <div className="flex space-x-1 h-1.5">
                                {[0, 1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-full transition-colors duration-300 ${i < strengthScore
                                                ? strengthScore <= 1
                                                    ? 'bg-red-500'
                                                    : strengthScore <= 2
                                                        ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                                : 'bg-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                            <ul className="mt-2 space-y-1">
                                {requirements.map((req, index) => (
                                    <li
                                        key={index}
                                        className={`text-xs flex items-center ${req.passed ? 'text-green-600' : 'text-gray-500'
                                            }`}
                                    >
                                        <span className="mr-1.5">
                                            {req.passed ? '✓' : '•'}
                                        </span>
                                        {req.label}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                            {pending ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
