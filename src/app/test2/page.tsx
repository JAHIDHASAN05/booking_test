'use client'

import { useState } from 'react'
import { format, addDays, startOfWeek } from 'date-fns'

const generateWeek = (startDate: Date) => {
  return Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
}

// Dummy booking slots
const getSlotsForDay = (day: string): string[] => {
  const baseSlots = ['2:30pm', '8:00pm', '8:30pm', '9:00pm']
  return ['Tuesday', 'Wednesday'].includes(day) ? baseSlots : []
}

export default function BookingModal() {
  const [weekOffset, setWeekOffset] = useState(0)

  const today = new Date()
  const weekStart = startOfWeek(addDays(today, weekOffset * 7), { weekStartsOn: 1 }) // Start week on Monday
  const weekDates = generateWeek(weekStart)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-3xl bg-white rounded-lg p-6 mx-4 sm:mx-0">
        {/* Close Button */}
        {/* Add a close button here if needed */}

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            This Week {format(weekDates[0], 'dd/MM/yyyy')} - {format(weekDates[6], 'dd/MM/yyyy')}
          </h2>
        </div>

        {/* Calendar */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {weekDates.map((date, idx) => {
            const dayName = format(date, 'EEEE') // Full day name (e.g., "Monday")
            const displayDate = format(date, 'dd MMM')
            const slots = getSlotsForDay(dayName)

            return (
              <div key={idx}>
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  {dayName} <span className="text-gray-400">({displayDate})</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {slots.length > 0 ? (
                    slots.map((slot, i) => (
                      <span
                        key={i}
                        className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold"
                      >
                        {slot}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm italic text-gray-400">No slots</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          {weekOffset > 0 && (
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-full text-sm"
            >
              Previous Week
            </button>
          )}
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full text-sm"
          >
            Next Week
          </button>
        </div>
      </div>
    </div>
  )
}
