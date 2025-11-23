// Format date and time for conference slots
export function formatSlotDateTime(startTime: Date, endTime: Date): {
    dateStr: string
    timeStr: string
} {
    const start = new Date(startTime)
    const end = new Date(endTime)

    // Check if same day
    const sameDay = start.toDateString() === end.toDateString()

    // Format date
    const dateStr = start.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    // Format time
    const startTimeStr = start.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    })

    const endTimeStr = end.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    })

    const timeStr = `${startTimeStr} - ${endTimeStr}`

    return { dateStr, timeStr }
}

// Format for email (returns full formatted string)
export function formatSlotDateTimeForEmail(startTime: Date, endTime: Date): string {
    const { dateStr, timeStr } = formatSlotDateTime(startTime, endTime)
    return `${dateStr}<br>${timeStr}`
}
