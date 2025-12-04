const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Find slots with "null" string as name or actual null (though schema says String, it might be "null" string from the bad update)
    const brokenSlots = await prisma.slot.findMany({
        where: {
            OR: [
                { name: 'null' },
                { name: null } // Just in case, though schema is non-nullable usually
            ]
        }
    })

    console.log(`Found ${brokenSlots.length} broken slots.`)

    for (const slot of brokenSlots) {
        const newName = `Recovered Slot ${slot.id.slice(-4)}`
        await prisma.slot.update({
            where: { id: slot.id },
            data: { name: newName }
        })
        console.log(`Renamed slot ${slot.id} to "${newName}"`)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
