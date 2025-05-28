
import { useEffect, useState } from "react";
import { format } from "date-fns";
type TimeSlotsComponentProps = {
  selectedDate: Date | null;
  timeSlots: string[];
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
};

export default function TimeSlotsComponent({
  selectedDate,
  timeSlots,
  selectedTime,
  setSelectedTime,
}: TimeSlotsComponentProps) {
  const [shakeKey, setShakeKey] = useState(0);

  // Check if no available slots (filtered)
  


const today = new Date().toISOString().split("T")[0];
const now = new Date();

const filteredSlots = timeSlots
  .filter(({ date }) => date >= today) // keep today or future dates only
  .map(({ date, slots }) => {
    const filteredSlots = slots.filter(({ start }) => {
      if (date > today) return true; // future dates: keep all

      // for today, check if slot's start time is in the future
      const [hour, minute] = start.split(":").map(Number);
      const slotTime = new Date(date);
      slotTime.setHours(hour, minute, 0, 0);
      return slotTime > now;
    });

    return { date, slots: filteredSlots };
  })
  .filter(({ slots }) => slots.length > 0); // remove dates with no valid slots
  
  // When no slots, update shakeKey to retrigger animation
  useEffect(() => {
    if (filteredSlots.length === 0) {
      setShakeKey((k) => k + 1);
    }
  }, [filteredSlots.length, selectedDate]);





const filtered = filteredSlots
  .filter((day) => {
    // Only match the selected date (no time check)
    const isSelectedDate = day.date === format(selectedDate || today, "yyyy-MM-dd");
    return isSelectedDate;
  })
  .filter((day) => day.slots.length > 0); 


console.log(filtered,format(selectedDate || today, "yyyy-MM-dd"));


  return (
    selectedDate ? (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>

<div className="grid grid-cols-2  lg:grid-cols-3  gap-2">
  {filtered.map(({ date, slots }) =>
    slots.map((slot) => {
      const [startHour, startMinute] = slot.start.split(":").map(Number);
      const [endHour, endMinute] = slot.end.split(":").map(Number);

      const formatTime = (hour: number, minute: number) => {
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
      };

      const formattedStart = formatTime(startHour, startMinute);
      const formattedEnd = formatTime(endHour, endMinute);

      return (
        <button
          key={`${date}-${slot.start}-${slot.end}`}
          onClick={() => setSelectedTime(slot.start)}
          className={`px-3 flex items-center justify-center  py-2 rounded border transition  ${
            selectedTime === slot.start
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-blue-100"
          }`}
        >
          {formattedStart}
                  -
          { formattedEnd}
          
          </button>
      );
    })
  )}
</div>







        {/* {filteredSlots.length === 0 ? (
          <div
            key={shakeKey} // key change forces React to remount this div, retriggering animation
            className=" flex flex-col items-center justify-center text-center bg-yellow-50 text-yellow-700 border border-yellow-200 rounded p-6"
          >
           <div className="shake flex flex-col items-center justify-center">
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
        </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredSlots.map((slot) => {
              const [hour, minute] = slot.split(":").map(Number);
              const ampm = hour >= 12 ? "PM" : "AM";
              const hour12 = hour % 12 || 12;
              const formatted = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;

              return (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`px-3 py-2 rounded border transition ${
                    selectedTime === slot
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-blue-100"
                  }`}
                >
                  {formatted}
                </button>
              );
            })}
          </div>
        )} */}
      </div>
    ): 
    <div>
             <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>

<div className="mb-4  flex flex-col items-center justify-center text-center bg-yellow-50 text-yellow-700 border border-yellow-200 rounded p-6">
        
        <div className="shake flex flex-col items-center justify-center ">
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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-medium">No date selected</p>
        <p className="text-sm text-yellow-700 mt-1">
          Please select a date to see available time slots.
        </p>
        </div>
      </div>

    </div>
    
  );
}
