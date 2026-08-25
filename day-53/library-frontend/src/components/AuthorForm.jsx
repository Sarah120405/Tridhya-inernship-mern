import { useState } from "react";
import { useDispatch } from "react-redux";
import { createAuthor } from "../store/slice/authorSlice";

export default function AuthorForm({ onSuccess, onCancel }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const validationErrors = validate();
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    const resultAction = await dispatch(createAuthor(formData));

    setSubmitting(false);

    if (createAuthor.fulfilled.match(resultAction)) {
      onSuccess(resultAction.payload);
    } else {
      setError(resultAction.error?.message || "Failed to create author");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-rose-600 text-sm">{error}</p>}

      <div>
        <label className="text-sm font-medium text-slate-600">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition"
        />
        {fieldErrors.name && (
          <span className="text-rose-600 text-xs">{fieldErrors.name}</span>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-600">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition"
        />
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold py-2.5 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-xl bg-purple-600 text-white font-semibold py-2.5 hover:bg-purple-700 transition disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Add Author"}
        </button>
      </div>
    </form>
  );
}
