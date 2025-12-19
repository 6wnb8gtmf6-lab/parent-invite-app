import { prisma } from '@/lib/db'
import { sendReminderEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Ensure this route is not cached

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const now = new Date()
        // Look ahead up to 60 days. This covers most reasonable reminder settings.
        const futureLimit = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)

        let potentialSignups: any[] = []
        let retries = 3

        while (retries > 0) {
            try {
                potentialSignups = await prisma.signup.findMany({
                    where: {
                        reminderSent: false,
                        slot: {
                            startTime: {
                                gt: now,
                                lt: futureLimit,
                            },
                            sendReminder: true,
                        },
                    },
                    include: {
                        slot: {
                            include: {
                                createdBy: true,
                            },
                        },
                    },
                })
                break // Success, exit loop
            } catch (error) {
                console.error(`Database query failed, retries left: ${retries - 1}`, error)
                retries--
                if (retries === 0) throw error
                // Wait 2 seconds before retrying
                await new Promise(resolve => setTimeout(resolve, 2000))
            }
        }

        // Filter in memory to check precise reminder timing
        const signupsToSend = potentialSignups.filter(signup => {
            const timeUntilStartMs = new Date(signup.slot.startTime).getTime() - now.getTime()
            const hoursUntilStart = timeUntilStartMs / (1000 * 60 * 60)

            // Check if we are within the reminder window (e.g. <= 24 hours)
            // We use a small buffer (e.g. 0.0) so if it's exactly on the hour it counts.
            // Since the cron runs hourly, as soon as hoursUntilStart runs below the threshold, strictly, we send.
            return hoursUntilStart <= signup.slot.reminderHoursBefore
        })

        console.log(`Found ${potentialSignups.length} potential signups, sending ${signupsToSend.length} reminders due now.`)

        const results = await Promise.allSettled(
            signupsToSend.map(async (signup) => {
                const teacherName = signup.slot.createdBy?.name || signup.slot.createdBy?.username || 'Teacher'

                const sent = await sendReminderEmail(
                    signup.email,
                    signup.parentName,
                    signup.childName || 'Student',
                    signup.slot.startTime,
                    signup.slot.endTime,
                    teacherName,
                    signup.cancellationToken || '',
                    signup.slot.name,
                    signup.slot.hideEndTime,
                    signup.slot.hideTime
                )

                if (sent) {
                    await prisma.signup.update({
                        where: { id: signup.id },
                        data: { reminderSent: true },
                    })
                } else {
                    console.error(`Failed to send reminder to ${signup.email} (signup: ${signup.id})`)
                    // We don't update reminderSent so it will be retried next hour
                }
            })
        )

        const successCount = results.filter((r) => r.status === 'fulfilled').length
        const failureCount = results.filter((r) => r.status === 'rejected').length

        return NextResponse.json({
            success: true,
            processed: signupsToSend.length,
            sent: successCount,
            failed: failureCount,
        })
    } catch (error) {
        console.error('Reminder cron failed:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
