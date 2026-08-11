"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import EventForm from "@/app/components/EventForm";

export default function EditEventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/event/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then(setEvent);
  }, [id]);

  if (!event) return <p>Loading...</p>;
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Edit Event</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Fill in the details to edit your event.
        </p>
      </div>
      <EventForm existingEvent={event} />
    </div>
  );
}
