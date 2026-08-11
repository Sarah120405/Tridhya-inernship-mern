"use client";
import EventForm from "@/app/components/EventForm";

export default function CreateEventPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Create Event</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Fill in the details to publish a new event.
        </p>
      </div>
      <EventForm />
    </div>
  );
}
