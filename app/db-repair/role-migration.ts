'use server'

import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function migrateRolesToUser() {
    try {
        const session = await getSession()
        if (!session || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized')
        }

        // Update all users with role 'REGULAR' to 'USER'
        // We have to cast to text to avoid enum issues if possible, or just update if the enum supports both.
        // Since we added REGULAR back, both exist.

        // We need to use executeRaw because Prisma might be confused about the types if we just changed the schema.
        // But actually, if we reverted the schema to have both, we can just use updateMany.

        // However, 'REGULAR' is the old value. 'USER' is the new one.
        // Let's update all REGULAR to USER.

        const result = await prisma.user.updateMany({
            where: {
                role: 'REGULAR' as any
            },
            data: {
                role: 'USER'
            }
        })

        return { success: true, count: result.count, message: `Updated ${result.count} users from REGULAR to USER.` }
    } catch (e: any) {
        console.error('Role migration failed:', e)
        return { success: false, error: e.message }
    }
}
