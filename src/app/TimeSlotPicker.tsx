// components/TimeSlotPicker.tsx
'use client';

import { useRef, useState } from 'react';

interface TimeSlotPickerProps {
  timeSlots: string[];
  selectedDate: Date | null;
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  timeSlots,
  selectedDate,
  selectedTime,
  setSelectedTime,
}) => {
  const noSlotRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);

  const filteredSlots = timeSlots.filter((slot) => {
    if (!selectedDate) return false;
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const [hour, minute] = slot.split(':').map(Number);
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hour, minute, 0, 0);
    return !isToday || slotTime > now;
  });

  const handleNoSlotClick = () => {
    if (noSlotRef.current && !animating) {
      noSlotRef.current.classList.add('animate-shake');
      setAnimating(true);
      setTimeout(() => {
        noSlotRef.current?.classList.remove('animate-shake');
        setAnimating(false);
      }, 400);
    }
  };

  return selectedDate ? (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>

      {filteredSlots.length === 0 ? (
        <div
          ref={noSlotRef}
          onClick={handleNoSlotClick}
          className="cursor-pointer select-none flex flex-col items-center justify-center text-center bg-yellow-50 text-yellow-700 border border-yellow-200 rounded p-6 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 mb-3 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-medium">No available time slots</p>
          <p className="text-sm text-gray-600 mt-1">
            Please choose another day or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredSlots.map((slot) => {
            const [hour, minute] = slot.split(':').map(Number);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            const formatted = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;

            return (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`px-3 py-2 rounded border transition ${
                  selectedTime === slot
                    ? 'bg-blue-600 text-white'
                    : 'bg-white hover:bg-blue-100'
                }`}
              >
                {formatted}
              </button>
            );
          })}
        </div>
      )}
    </div>
  ) : null;
};

export default TimeSlotPicker;