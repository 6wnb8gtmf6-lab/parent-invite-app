const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const slots = await prisma.slot.findMany({
        select: {
            id: true,
            name: true,
            templateId: true,
            template: {
                select: {
                    name: true
                }
            }
        }
    })

    console.log('Total slots:', slots.length)
    console.log('Slots:')
    slots.forEach(slot => {
        console.log(`- ID: ${slot.id}, Name: "${slot.name}", Template: "${slot.template?.name}"`)
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
