'use server'

import { prisma } from '@/lib/db'
import { sendCancellationEmail } from '@/lib/email'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function cancelSignup(token: string) {
    // Find the signup by cancellation token
    const signup = await prisma.signup.findUnique({
        where: { cancellationToken: token },
        include: {
            slot: true,
        },
    })

    if (!signup) {
        throw new Error('Signup not found or already cancelled')
    }

    // Store email info before deletion
    const email = signup.email
    const parentName = signup.parentName
    const slotTime = signup.slot.startTime

    // Delete the signup
    await prisma.signup.delete({
        where: { id: signup.id },
    })

    // Send cancellation confirmation email (don't fail if this errors)
    try {
        await sendCancellationEmail(email, parentName, slotTime)
    } catch (error) {
        console.error('Failed to send cancellation email:', error)
    }

    // Revalidate paths
    revalidatePath('/')
    revalidatePath('/admin')

    // Redirect to success page
    redirect('/cancel/success')
}
