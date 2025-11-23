'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function checkDatabaseStatus() {
    try {
        // Check if User table has 'name' column
        const result = await prisma.$queryRaw`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'User';
        `
        return { success: true, columns: result }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function fixDatabaseSchema() {
    try {
        // 1. Create Enums if they don't exist
        try {
            await prisma.$executeRawUnsafe(`CREATE TYPE "Role" AS ENUM ('ADMIN', 'REGULAR');`)
        } catch (e) {
            console.log('Role enum might already exist')
        }

        try {
            await prisma.$executeRawUnsafe(`CREATE TYPE "Status" AS ENUM ('ACTIVE', 'SUSPENDED');`)
        } catch (e) {
            console.log('Status enum might already exist')
        }

        // 2. Add columns safely
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;`)
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "Role" DEFAULT 'REGULAR';`)
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "status" "Status" DEFAULT 'ACTIVE';`)

        // Handle timestamps
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`)
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;`)

        return { success: true, message: 'Schema patched successfully' }
    } catch (e: any) {
        console.error('Fix failed:', e)
        return { success: false, error: e.message }
    }
}

export async function normalizeUsernames() {
    try {
        // Update all usernames to be lowercase
        await prisma.$executeRawUnsafe(`UPDATE "User" SET username = LOWER(username);`)
        return { success: true, message: 'All usernames converted to lowercase' }
    } catch (e: any) {
        console.error('Normalization failed:', e)
        return { success: false, error: e.message }
    }
}

export async function listUsers() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, role: true, status: true }
        })
        return { success: true, users }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function fixSlotSchema() {
    try {
        // Add createdById column to Slot table
        await prisma.$executeRawUnsafe(`ALTER TABLE "Slot" ADD COLUMN IF NOT EXISTS "createdById" TEXT;`)
        return { success: true, message: 'Slot table updated successfully' }
    } catch (e: any) {
        console.error('Slot schema fix failed:', e)
        return { success: false, error: e.message }
    }
}

export async function fixSignupSchema() {
    try {
        // Add cancellationToken column to Signup table
        await prisma.$executeRawUnsafe(`ALTER TABLE "Signup" ADD COLUMN IF NOT EXISTS "cancellationToken" TEXT;`)

        // Generate tokens for existing signups
        await prisma.$executeRawUnsafe(`
            UPDATE "Signup" 
            SET "cancellationToken" = gen_random_uuid()::text 
            WHERE "cancellationToken" IS NULL;
        `)

        // Add unique constraint
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "Signup" 
            ADD CONSTRAINT IF NOT EXISTS "Signup_cancellationToken_key" 
            UNIQUE ("cancellationToken");
        `)

        return { success: true, message: 'Signup table updated successfully' }
    } catch (e: any) {
        console.error('Signup schema fix failed:', e)
        return { success: false, error: e.message }
    }
}
