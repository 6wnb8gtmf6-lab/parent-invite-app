'use client'

import { useEffect } from 'react'
import { logout } from '@/app/actions'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
    const router = useRouter()

    useEffect(() => {
        const doLogout = async () => {
            await logout()
            window.location.href = '/login' // Force full reload
        }
        doLogout()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <h1 className="text-xl font-bold mb-2">Logging out...</h1>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    )
}
