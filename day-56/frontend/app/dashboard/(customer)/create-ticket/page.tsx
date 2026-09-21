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
  FiUploadCloud,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  ticketSuggestion,
  clearAiSuggestion,
  markSuggestionUsed,
} from "../../../store/slice/aiSlice";
import { createTicket } from "../../../store/slice/ticketSlice";

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
  const [attachments, setAttachments] = useState<File[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const {
    suggestion: aiSuggestion,
    isLoading: isSuggesting,
    error: aiError,
    suggestionUsed: aiSuggestionUsed,
  } = useSelector((state: RootState) => state.ai);
  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    setAttachments((prev) => [...prev, ...files]);

    event.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

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
    if (name === "title" || name === "description") {
      dispatch(clearAiSuggestion());
    }
    setFieldError((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSubmitError("");
  };

  const handleSuggest = () => {
    dispatch(
      ticketSuggestion({
        title: formData.title,
        description: formData.description,
        customerCategory: formData.category || "OTHER",
      }),
    );
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
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("priority", formData.priority);
      data.append("aiSuggestionUsed", String(aiSuggestionUsed));

      if (aiSuggestionUsed && aiSuggestion) {
        data.append("aiSuggestion", JSON.stringify(aiSuggestion));
      }

      attachments.forEach((file) => {
        data.append("attachments", file);
      });
      const result = await dispatch(createTicket(data)).unwrap();
      router.push(`/tickets/${result}`);

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
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-800 outline-none transition duration-200 placeholder:text-gray-400 focus:ring-4 ${
      hasError
        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
        : "border-gray-200 focus:border-[#8B7ED8] focus:ring-purple-100"
    }`;

  return (
    <div className="min-h-screen bg-[#EOFFFF] px-4 py-8 sm:px-6 lg:py-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-3xl space-y-6 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-8 lg:p-10"
      >
        <div className="border-b border-violet-100 pb-5">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#6C5DD3]"
          >
            <FiArrowLeft />
            Back
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Create a Support Ticket
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Tell us what you need help with. Our support team will get back to
            you.
          </p>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
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
              <p className="text-xs text-gray-400">
                Keep it short and specific.
              </p>
            )}

            <span className="shrink-0 text-xs text-gray-400">
              {formData.title.length}/150
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
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
        <button
          type="button"
          disabled={
            isSuggesting ||
            formData.title.trim().length < 4 ||
            formData.description.trim().length < 10
          }
          onClick={handleSuggest}
          className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSuggesting
            ? "Analyzing ticket..."
            : "✨ Suggest category & priority with AI"}
        </button>
        {aiError && (
          <p role="alert" className="mt-2 text-sm text-rose-600">
            {aiError}
          </p>
        )}

        {aiSuggestion && (
          <div className="mt-4 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg">✨</span>
              <h3 className="font-semibold text-violet-900">AI Suggestions</h3>
              <span className="ml-auto rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">
                {Math.round(aiSuggestion.confidence * 100)}% confidence
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-violet-100 bg-white p-3">
                <p className="text-xs text-gray-500">Suggested category</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {CATEGORIES.find(
                    (item) => item.value === aiSuggestion.suggestedCategory,
                  )?.label ?? aiSuggestion.suggestedCategory}
                </p>
              </div>

              <div className="rounded-xl border border-violet-100 bg-white p-3">
                <p className="text-xs text-gray-500">Suggested priority</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {PRIORITIES.find(
                    (item) => item.value === aiSuggestion.suggestedPriority,
                  )?.label ?? aiSuggestion.suggestedPriority}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {aiSuggestion.reasoning}
            </p>

            <button
              type="button"
              onClick={() => {
                if (!aiSuggestion) return;

                setFormData((prev) => ({
                  ...prev,
                  category: aiSuggestion.suggestedCategory,
                  priority: aiSuggestion.suggestedPriority,
                }));

                dispatch(markSuggestionUsed());
              }}
              className="mt-4 rounded-xl bg-[#6C5DD3] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5949C6]"
            >
              Use these suggestions
            </button>
          </div>
        )}
        {/* Category and priority */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
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
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
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
        <div className="space-y-3">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
            <FiUploadCloud className="text-lg text-[#8B7ED8] transition group-hover:-translate-y-1" />{" "}
            Attachments
          </label>

          <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/70 px-5 py-8 text-center transition hover:border-[#8B7ED8] hover:bg-violet-100/70">
            <span className="text-sm font-semibold text-violet-800">
              Click to upload or choose files
            </span>
            <span className="mt-1 text-xs text-gray-500">
              Attach screenshots or other relevant files
            </span>

            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFilesChange}
            />
          </label>

          {attachments.length > 0 && (
            <ul className="space-y-2">
              {attachments.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-violet-100 bg-white p-3 transition hover:border-violet-200 hover:bg-violet-50/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="ml-3 text-sm font-medium text-rose-600 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-violet-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C5DD3] to-[#8B7ED8] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#5B4CC4] hover:to-[#7B6BCB] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
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
    </div>
  );
}
