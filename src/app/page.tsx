"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";

// Dummy event and availability
const event = {
  id: "event_001",
  name: "Consultation Session",
  duration: 30,
};

const availability = [
  {
    date: "2025-05-20",
    slots: ["10:00", "11:00", "14:00", "15:30"],
  },
  {
    date: "2025-05-22",
    slots: ["09:30", "12:00", "13:30", "16:00"],
  },
  {
    date: "2025-05-23",
    slots: ["10:00", "11:30", "15:00"],
  },
];

export default function BookingForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
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

    const startTime = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`);
    const endTime = new Date(startTime.getTime() + event.duration * 60000);

    const bookingData = {
      eventId: event.id,
      name: data.name,
      email: data.email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      additionalInfo: data.additionalInfo,
      meetLink: `https://meet.fake.com/${Math.random().toString(36).substring(2, 8)}`,
    };

    console.log("Submitted Booking:", bookingData);
    setSuccessData(bookingData);
  };

  const availableDays = availability.map((day) => new Date(day.date));

  const timeSlots = selectedDate
    ? availability.find((day) => day.date === format(selectedDate, "yyyy-MM-dd"))?.slots || []
    : [];

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
    <div className="flex flex-col gap-8 p-10 border bg-white max-w-4xl mx-auto">
      <div className="md:h-96 flex flex-col md:flex-row gap-5">
        <div className="w-full">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null); // Reset selected time when date changes
            }}
            disabled={[{ before: new Date() }]}
            modifiers={{ available: availableDays }}
  //             classNames={{
  //   day: "my-day",
  //   day_selected: "bg-green-500 text-white",
  //   day_today: "text-blue-600 font-bold",
  //   day_disabled: "text-gray-400 cursor-not-allowed",
  //   day_available: "bg-yellow-100 text-black",
  //   nav_button: "text-black hover:bg-gray-200",
  //   caption_label: "text-lg font-semibold",
  //   // more classes can be customized as needed
  // }}

            modifiersStyles={{
              available: {
                background: "lightblue",
                borderRadius: 100,
              },
            }}
          />
        </div>
        <div className="w-full h-full md:overflow-y-scroll">
          {selectedDate && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Available Time Slots</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`px-3 py-2 rounded border ${
                      selectedTime === slot ? "bg-blue-600 text-white" : "bg-white"
                    } hover:bg-blue-100`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedTime && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Your Name"
              className="w-full p-2 border rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <input
              {...register("email", { required: "Email is required" })}
              placeholder="Your Email"
              type="email"
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <textarea
              {...register("additionalInfo")}
              placeholder="Additional Info"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Schedule Event
          </button>
        </form>
      )}
    </div>
  );
}
