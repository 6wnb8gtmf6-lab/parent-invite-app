'use server'

import { prisma } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'
import { randomBytes } from 'crypto'

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get('email') as string

    if (!email) {
        return { error: 'Email is required' }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            // Don't reveal if user exists
            return { success: true }
        }

        // Generate token
        const token = randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        // Save token
        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt,
            },
        })

        // Send email
        await sendPasswordResetEmail(email, token)

        return { success: true }
    } catch (error) {
        console.error('Password reset error:', error)
        return { error: 'Something went wrong. Please try again.' }
    }
}
