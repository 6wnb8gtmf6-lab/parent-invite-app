'use server'

import { prisma } from '@/lib/db'
import { validatePasswordStrength } from '@/lib/password'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function resetPassword(token: string, prevState: any, formData: FormData) {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || !confirmPassword) {
        return { error: 'All fields are required' }
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' }
    }

    if (!validatePasswordStrength(password)) {
        return { error: 'Password does not meet requirements' }
    }

    try {
        // Verify token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        })

        if (!resetToken) {
            return { error: 'Invalid or expired reset link' }
        }

        if (resetToken.expiresAt < new Date()) {
            // Clean up expired token
            await prisma.passwordResetToken.delete({
                where: { id: resetToken.id },
            })
            return { error: 'Reset link has expired' }
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(password, 10)

        // Update user and delete token
        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { passwordHash },
            }),
            prisma.passwordResetToken.delete({
                where: { id: resetToken.id },
            }),
        ])
    } catch (error) {
        console.error('Reset password error:', error)
        return { error: 'Something went wrong. Please try again.' }
    }

    redirect('/login?reset=success')
}
