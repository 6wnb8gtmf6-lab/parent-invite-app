'use server'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function addChildNameToSignups() {
    try {
        const session = await getSession()
        if (!session || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized')
        }

        // Add childName column to Signup table
        await prisma.$executeRawUnsafe(`ALTER TABLE "Signup" ADD COLUMN IF NOT EXISTS "childName" TEXT;`)

        // Set a default value for existing signups
        await prisma.$executeRawUnsafe(`
            UPDATE "Signup" 
            SET "childName" = 'Student' 
            WHERE "childName" IS NULL;
        `)

        return { success: true, message: 'Signup table updated successfully with childName field.' }
    } catch (e: any) {
        console.error('Signup childName fix failed:', e)
        return { success: false, error: e.message }
    }
}
