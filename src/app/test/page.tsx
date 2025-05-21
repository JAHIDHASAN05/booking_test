'use client'
import { useState } from 'react'

const scheduleData = [
  {
    day: 'Tuesday',
    times: ['2:30pm', '8:00pm', '8:30pm', '9:00pm'],
  },
  {
    day: 'Wednesday',
    times: ['2:30pm', '8:00pm', '2:30pm', '8:30pm', '8:30pm', '9:00pm'],
  },
  {
    day: 'Thursday',
    times: [],
  },
]

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-3xl bg-white rounded-lg p-6 mx-4 sm:mx-0">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            This Week 17/05/2025 - 25/06/2025
          </h2>
        </div>

        {/* Schedule */}
        <div className="space-y-6">
          {scheduleData.map((day, i) => (
            <div key={i}>
              <h3 className="text-md font-semibold text-gray-700 mb-2">{day.day}</h3>
              <div className="flex flex-wrap gap-3">
                {day.times.length ? (
                  day.times.map((time, index) => (
                    <span
                      key={index}
                      className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold"
                    >
                      {time}
                    </span>
                  ))
                ) : (
                  <span className="text-sm italic text-gray-400">No slots</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-8 text-right">
          <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition">
            Next Week
          </button>
        </div>
      </div>
    </div>
  )
}
