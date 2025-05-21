'use client'

import { useState } from 'react'
import {
  format,
  addDays,
  isSameDay,
  startOfToday,
} from 'date-fns'

// Constants
const MAX_WEEKS_AHEAD = 4
const DAYS_PER_WEEK = 7

// Dummy slot fetcher
const fetchSlotsForDate = (date: Date): string[] => {
  const weekday = format(date, 'EEEE')
  if (['Tuesday', 'Wednesday'].includes(weekday)) {
    return ['2:30pm', '8:00pm', '8:30pm', '9:00pm']
  }
  return []
}

const generateWeek = (offset: number) => {
  const today = startOfToday()
  return Array.from({ length: DAYS_PER_WEEK }, (_, i) =>
    addDays(today, i + offset * DAYS_PER_WEEK)
  )
}

export default function BookingModal() {
  const [weekOffset, setWeekOffset] = useState(0)

  const weekDates = generateWeek(weekOffset)
  const today = startOfToday()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-3xl bg-white rounded-lg p-6 mx-4 sm:mx-0">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            Week of {format(weekDates[0], 'dd/MM/yyyy')} - {format(weekDates[6], 'dd/MM/yyyy')}
          </h2>
        </div>

        {/* Week Days & Slots */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {weekDates.map((date, idx) => {
            const dayName = format(date, 'EEEE') // e.g. Tuesday
            const displayDate = format(date, 'dd MMM')
            const slots = fetchSlotsForDate(date)

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

        {/* Pagination Controls */}
        <div className="mt-8 flex justify-between">
          {/* Hide Previous if on first week */}
          {weekOffset > 0 ? (
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-full text-sm"
            >
              Previous Week
            </button>
          ) : (
            <div />
          )}

          {/* Disable Next if past 4 weeks */}
          {weekOffset < MAX_WEEKS_AHEAD - 1 && (
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full text-sm"
            >
              Next Week
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
