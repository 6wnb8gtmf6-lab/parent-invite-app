import { prisma } from '@/lib/db'
import { signupForSlot } from './actions'

export default async function Home() {
  const slots = await prisma.slot.findMany({
    orderBy: { startTime: 'asc' },
    include: { _count: { select: { signups: true } } },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Parent Teacher Conference Signups
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Select a time slot below to meet with the teacher.
          </p>
        </div>

        <div className="space-y-6">
          {slots.map((slot) => {
            const isFull = slot._count.signups >= slot.maxCapacity
            return (
              <div
                key={slot.id}
                className={`bg-white shadow overflow-hidden sm:rounded-lg border ${isFull ? 'border-gray-200 opacity-75' : 'border-indigo-100'
                  }`}
              >
                <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {new Date(slot.startTime).toLocaleString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                      {' - '}
                      {new Date(slot.endTime).toLocaleTimeString(undefined, {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {isFull
                        ? 'This slot is full'
                        : `${slot.maxCapacity - slot._count.signups} spots remaining`}
                    </p>
                  </div>
                  {!isFull && (
                    <div className="ml-4 flex-shrink-0">
                      <details className="group">
                        <summary className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Sign Up
                        </summary>
                        <div className="absolute mt-2 w-72 bg-white rounded-md shadow-lg z-10 p-4 border right-0 sm:right-auto">
                          <form action={signupForSlot} className="space-y-4">
                            <input type="hidden" name="slotId" value={slot.id} />
                            <div>
                              <label htmlFor={`name-${slot.id}`} className="block text-sm font-medium text-gray-700">
                                Your Name
                              </label>
                              <input
                                type="text"
                                name="parentName"
                                id={`name-${slot.id}`}
                                required
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2"
                              />
                            </div>
                            <div>
                              <label htmlFor={`email-${slot.id}`} className="block text-sm font-medium text-gray-700">
                                Email Address
                              </label>
                              <input
                                type="email"
                                name="email"
                                id={`email-${slot.id}`}
                                required
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Confirm Signup
                            </button>
                          </form>
                        </div>
                      </details>
                    </div>
                  )}
                  {isFull && (
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Full
                    </span>
                  )}
                </div>
              </div>
            )
          })}
          {slots.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No slots available at the moment. Please check back later.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
