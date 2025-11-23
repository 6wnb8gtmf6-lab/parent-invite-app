const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'asc' }
    })

    console.log(`Found ${users.length} users to update.`)

    const baseEmail = 'unrflanagan@gmail.com'

    for (let i = 0; i < users.length; i++) {
        const user = users[i]
        // For the first user (or if only one), use the base email.
        // For subsequent users, append +1, +2, etc. to maintain uniqueness.
        const email = i === 0 ? baseEmail : baseEmail.replace('@', `+${i}@`)

        console.log(`Updating user ${user.username} (${user.id}) with email ${email}...`)

        try {
            await prisma.user.update({
                where: { id: user.id },
                data: { email }
            })
            console.log(`Successfully updated user ${user.username}`)
        } catch (error) {
            console.error(`Failed to update user ${user.username}:`, error)
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
