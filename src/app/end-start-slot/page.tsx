/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";
import TimeSlotsComponent from "./TimeSlotPicker";

// Dummy event and availability
const event = {
  id: "event_001",
  name: "Consultation Session",
  duration: 30,
};

// const availability = [

//   {
//     date: "2025-07-10",
//     slots: ["07:00", "09:30", "14:00", "17:30"],
//   },
//   {
//     date: "2025-07-20",
//     slots: ["08:00", "11:00", "13:00", "19:00"],
//   },

// ];
const apiAvailability = [
  {
    teacherId: "teacher-1",
    slots: [
      // Day 1 (June 1, 2025) - 24 hourly slots
      { start: "2025-05-28T00:00:00.000Z", end: "2025-05-28T01:00:00.000Z" },
      { start: "2025-05-28T01:00:00.000Z", end: "2025-05-28T02:00:00.000Z" },
      { start: "2025-05-28T02:00:00.000Z", end: "2025-05-28T03:00:00.000Z" },
      { start: "2025-05-28T03:00:00.000Z", end: "2025-05-28T04:00:00.000Z" },
      { start: "2025-05-28T04:00:00.000Z", end: "2025-05-28T05:00:00.000Z" },
      { start: "2025-05-28T05:00:00.000Z", end: "2025-05-28T06:00:00.000Z" },
      { start: "2025-05-28T06:00:00.000Z", end: "2025-05-28T07:00:00.000Z" },
      { start: "2025-05-28T07:00:00.000Z", end: "2025-05-28T08:00:00.000Z" },
      { start: "2025-05-28T08:00:00.000Z", end: "2025-05-28T09:00:00.000Z" },
      { start: "2025-05-28T09:00:00.000Z", end: "2025-05-28T10:00:00.000Z" },
      { start: "2025-05-28T10:00:00.000Z", end: "2025-05-28T11:00:00.000Z" },
      { start: "2025-05-28T11:00:00.000Z", end: "2025-05-28T12:00:00.000Z" },
      { start: "2025-05-28T12:00:00.000Z", end: "2025-05-28T13:00:00.000Z" },
      { start: "2025-05-28T13:00:00.000Z", end: "2025-05-28T14:00:00.000Z" },
      { start: "2025-05-28T14:00:00.000Z", end: "2025-05-28T15:00:00.000Z" },
      { start: "2025-05-28T15:00:00.000Z", end: "2025-05-28T16:00:00.000Z" },
      { start: "2025-05-28T16:00:00.000Z", end: "2025-05-28T17:00:00.000Z" },
      { start: "2025-05-28T16:38:00.000Z", end: "2025-05-28T18:00:00.000Z" },
      { start: "2025-05-28T18:00:00.000Z", end: "2025-05-28T19:00:00.000Z" },
      { start: "2025-05-28T19:00:00.000Z", end: "2025-05-28T20:00:00.000Z" },
      { start: "2025-05-28T20:00:00.000Z", end: "2025-05-28T21:00:00.000Z" },
      { start: "2025-05-28T21:00:00.000Z", end: "2025-05-28T22:00:00.000Z" },
      { start: "2025-05-28T22:00:00.000Z", end: "2025-05-28T23:00:00.000Z" },
      { start: "2025-05-28T23:00:00.000Z", end: "2025-06-02T00:00:00.000Z" },

      // Day 2 (June 2, 2025) - 24 hourly slots
      { start: "2025-06-02T00:00:00.000Z", end: "2025-06-02T01:00:00.000Z" },
      { start: "2025-06-02T01:00:00.000Z", end: "2025-06-02T02:00:00.000Z" },
      // ... (repeat for all 24 hours of June 2)
      { start: "2025-06-02T23:00:00.000Z", end: "2025-06-03T00:00:00.000Z" },

      // Days 3-10 (June 3-10, 2025) - Same pattern for 8 more days
      { start: "2025-06-03T00:00:00.000Z", end: "2025-06-03T01:00:00.000Z" },
      // ... (all 24 hours for June 3)
      { start: "2025-06-10T23:00:00.000Z", end: "2025-06-11T00:00:00.000Z" }
    ]
  },
  // Optional: Add another teacher with similar availability
  {
    teacherId: "teacher-2",
    slots: [
      { start: "2025-05-28T00:00:00.000Z", end: "2025-05-28T01:00:00.000Z" },
      // ... (same hourly structure for teacher-2)
    ]
  }
];

type Slot = {
  start: string; // ISO date string
  end: string;   // ISO date string
};

type TeacherAvailability = {
  teacherId: string;
  slots: Slot[];
};

type ConvertedSlot = {
  start: string; // formatted HH:mm
  end: string;   // formatted HH:mm
};

type ConvertedAvailability = {
 teacherId:string,
  date: string; // YYYY-MM-DD
  slots: ConvertedSlot[];
};

export function convertAvailability(data: TeacherAvailability[]): ConvertedAvailability[] {
  const result: ConvertedAvailability[] = [];

  data.forEach(({ teacherId, slots }) => {
    const dateMap: Record<string, ConvertedSlot[]> = {};

    slots.forEach(({ start, end }) => {
      const startDate = new Date(start);
      const endDate = new Date(end);

      const dateKey = startDate.toLocaleDateString("en-CA"); // YYYY-MM-DD

      const formatTime = (date: Date): string =>
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = [];
      }

      dateMap[dateKey].push({
        start: formatTime(startDate),
        end: formatTime(endDate),
      });
    });

    Object.entries(dateMap).forEach(([date, slots]) => {
      result.push({
      teacherId,
        date,
        slots,
      });
    });
  });

  return result;
}






const availability = convertAvailability(apiAvailability);













export default function BookingForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  const {
    register,
    handleSubmit,

    setValue,
  } = useForm();

  useEffect(() => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, setValue]);

  useEffect(() => {
    if (selectedTime) {
      setValue("time", selectedTime);
    }
  }, [selectedTime, setValue]);

  const onSubmit = (data: any) => {
    if (!selectedDate || !selectedTime) {
      console.error("Date or time not selected");
      return;
    }

    const startTime = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`
    );
    const endTime = new Date(startTime.getTime() + event.duration * 60000);

    const bookingData = {
      eventId: event.id,
      name: data.name,
      email: data.email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      additionalInfo: data.additionalInfo,
      meetLink: `https://meet.fake.com/${Math.random()
        .toString(36)
        .substring(2, 8)}`,
    };

    console.log("Submitted Booking:", selectedDate,selectedTime);
    setSuccessData(bookingData);
  }
const today = new Date().toISOString().split("T")[0];
const now = new Date();
const filteredSlots = availability
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
  
 



  const availableDays = filteredSlots.map((day) => new Date(day.date));
  console.log(availableDays);

    

  if (successData) {
    return (
      <div className="text-center p-10 border bg-white">
        <h2 className="text-2xl font-bold mb-4">Booking Successful!</h2>
        <p>
          Meeting Link:{" "}
          <a
            href={successData.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {successData.meetLink}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="px-2 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* // <div className=""> */}
    
      <div className="flex rounded-md w-full my-20 flex-col gap-8 p-5    sm:p-10 border bg-white max-w-4xl mx-auto">
        <div className="md:h-96 flex flex-col md:flex-row gap-5">
          <div className="w-full">
            <DayPicker
              mode="single"
              // selected={selectedDate}
              selected={selectedDate ?? undefined}
              onSelect={(date) => {
                setSelectedDate(date ?? null);

                setSelectedTime(null);
              }}
              disabled={[
                { before: new Date() },
                {
                  after: new Date(
                    new Date().setMonth(new Date().getMonth() + 2)
                  ),
                },
              ]}
              modifiers={{ available: availableDays }}
              modifiersStyles={{
                available: {
                  background: "lightblue",
                  borderRadius: 100,
                },
              }}
            />
          </div>
          <div className="w-full h-full md:overflow-y-scroll">
            <TimeSlotsComponent
              selectedDate={selectedDate}
              timeSlots={availability}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          </div>
        </div>

        {selectedTime && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <textarea
                {...register("additionalInfo")}
                placeholder="Message"
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Make an appointment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
