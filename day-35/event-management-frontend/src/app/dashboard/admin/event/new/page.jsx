"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Music", "Tech", "Sports", "Arts", "Food", "Other"];

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    price: "",
    category: "Other",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const validationErrors = validate();
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/event/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? Number(formData.capacity) : undefined,
          price: formData.price ? Number(formData.price) : 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create event");
        return;
      }

      const newEvent = await res.json();
      router.push(`/dashboard/events/${newEvent._id}`);
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full border rounded-lg px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-400";
  const labelClass = "block text-sm font-medium text-zinc-700 mb-1";
  const errorClass = "text-rose-600 text-xs mt-1 block";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Create Event</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Fill in the details to publish a new event.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border p-6 flex flex-col gap-5"
      >
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="Enter title"
            onChange={handleChange}
            className={inputClass}
          />
          {fieldErrors.title && (
            <span className={errorClass}>{fieldErrors.title}</span>
          )}
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={inputClass}
          />
          {fieldErrors.description && (
            <span className={errorClass}>{fieldErrors.description}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={inputClass}
            />
            {fieldErrors.date && (
              <span className={errorClass}>{fieldErrors.date}</span>
            )}
          </div>

          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              placeholder="Enter location"
              onChange={handleChange}
              className={inputClass}
            />
            {fieldErrors.location && (
              <span className={errorClass}>{fieldErrors.location}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              placeholder="0 for free"
              onChange={handleChange}
              min="0"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              placeholder="Enter capacity"
              onChange={handleChange}
              min="1"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-full text-white font-medium py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 disabled:opacity-50 transition"
        >
          {submitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
