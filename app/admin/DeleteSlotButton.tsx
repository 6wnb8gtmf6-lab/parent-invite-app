'use client'

import { deleteSlot } from '@/app/actions'

export default function DeleteSlotButton({ id }: { id: string }) {
    return (
        <form action={deleteSlot.bind(null, id)}>
            <button
                type="submit"
                className="px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:text-white hover:bg-red-600 border-2 border-red-200 hover:border-red-600 transition-all duration-200"
                onClick={(e) => {
                    if (!confirm('Are you sure you want to delete this slot?')) {
                        e.preventDefault()
                    }
                }}
            >
                Delete
            </button>
        </form>
    )
}
