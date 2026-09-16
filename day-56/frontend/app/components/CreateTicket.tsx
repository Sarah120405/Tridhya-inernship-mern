"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiFileText,
  FiFlag,
  FiTag,
  FiType,
} from "react-icons/fi";

interface FormData {
  title: string;
  description: string;
  category: string;
  priority: string;
}

const CATEGORIES = [
  { value: "TECHNICAL", label: "Technical" },
  { value: "BILLING", label: "Billing" },
  { value: "ACCOUNT", label: "Account" },
  { value: "FEATURE_REQUEST", label: "Feature Request" },
  { value: "GENERAL_INQUIRY", label: "General Inquiry" },
  { value: "OTHER", label: "Other" },
];

const PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

const initialFormData: FormData = {
  title: "",
  description: "",
  category: "",
  priority: "MEDIUM",
};

export default function CreateTicket() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [fieldError, setFieldError] = useState<
    Partial<Record<keyof FormData, string>>
  >({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldError((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSubmitError("");
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title.trim()) {
      errors.title = "Please enter a ticket title.";
    } else if (formData.title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters.";
    }

    if (!formData.description.trim()) {
      errors.description = "Please describe your issue.";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters.";
    }

    if (!formData.category) {
      errors.category = "Please select a category.";
    }

    setFieldError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          priority: formData.priority,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to create ticket.");
      }

      // Update this route if your ticket details page uses a different path.
      const ticketId = result.data?.id ?? result.id;

      if (ticketId) {
        router.push(`/tickets/${ticketId}`);
      } else {
        router.push("/tickets");
      }

      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-4 ${
      hasError
        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
        : "border-gray-200 focus:border-[#8B7ED8] focus:ring-purple-100"
    }`;

  return (
    <form onSubmit={handleSubmit} className="">
      {/* Ticket title */}
      <div>
        <label
          htmlFor="title"
          className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <FiType className="text-[#8B7ED8]" />
          Ticket title <span className="text-rose-500">*</span>
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Briefly describe your issue"
          maxLength={150}
          aria-invalid={Boolean(fieldError.title)}
          className={inputClass(Boolean(fieldError.title))}
        />

        <div className="mt-1.5 flex justify-between gap-3">
          {fieldError.title ? (
            <p className="text-xs text-rose-600">{fieldError.title}</p>
          ) : (
            <p className="text-xs text-gray-400">Keep it short and specific.</p>
          )}

          <span className="shrink-0 text-xs text-gray-400">
            {formData.title.length}/150
          </span>
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          <FiFileText className="text-[#8B7ED8]" />
          Description <span className="text-rose-500">*</span>
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Explain what happened, what you expected, and any steps you've already tried..."
          rows={6}
          maxLength={5000}
          aria-invalid={Boolean(fieldError.description)}
          className={`${inputClass(
            Boolean(fieldError.description),
          )} min-h-36 resize-y`}
        />

        <div className="mt-1.5 flex justify-between gap-3">
          {fieldError.description ? (
            <p className="text-xs text-rose-600">{fieldError.description}</p>
          ) : (
            <p className="text-xs text-gray-400">
              Include details that can help us resolve your issue.
            </p>
          )}

          <span className="shrink-0 text-xs text-gray-400">
            {formData.description.length}/5000
          </span>
        </div>
      </div>

      {/* Category and priority */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
          >
            <FiTag className="text-[#8B7ED8]" />
            Category <span className="text-rose-500">*</span>
          </label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            aria-invalid={Boolean(fieldError.category)}
            className={inputClass(Boolean(fieldError.category))}
          >
            <option value="" disabled>
              Select a category
            </option>

            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {fieldError.category && (
            <p className="mt-1.5 text-xs text-rose-600">
              {fieldError.category}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="priority"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
          >
            <FiFlag className="text-[#8B7ED8]" />
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={inputClass(false)}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>

          <p className="mt-1.5 text-xs text-gray-400">
            Choose how urgently you need help.
          </p>
        </div>
      </div>

      {/* Error message */}
      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <span className="mt-0.5">!</span>
          <p>{submitError}</p>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C5DD3] to-[#8B7ED8] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#5B4CC4] hover:to-[#7B6BCB] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Creating ticket...
            </>
          ) : (
            <>
              <FiCheckCircle />
              Submit Ticket
            </>
          )}
        </button>
      </div>
    </form>
  );
}
