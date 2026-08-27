import { useState } from "react";
import { useDispatch } from "react-redux";
import { createAuthor, editAuthors } from "../store/slice/authorSlice";
import { createMembers, editMembers } from "../store/slice/memberSlice";

export default function EntityForm({
  entityType,
  existingEntity,
  onSuccess,
  onCancel,
}) {
  const dispatch = useDispatch();
  const isAuthor = entityType === "author";
  const isEditMode = Boolean(existingEntity);
  const [formData, setFormData] = useState(
    isAuthor
      ? {
          name: existingEntity?.name || "",
          bio: existingEntity?.bio || "",
        }
      : {
          name: existingEntity?.name || "",
          email: existingEntity?.email || "",
        },
  );

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!isAuthor) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Enter a valid email address";
      }
    }
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const validationErrors = validate();
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    const thunk = isAuthor
      ? isEditMode
        ? editAuthors
        : createAuthor
      : isEditMode
        ? editMembers
        : createMembers;

    const payload = isEditMode
      ? isAuthor
        ? { authorId: existingEntity.id, authorData: formData }
        : { memberId: existingEntity.id, memberData: formData }
      : formData;

    const resultAction = await dispatch(thunk(payload));
    setSubmitting(false);
    if (thunk.fulfilled.match(resultAction)) {
      onSuccess(resultAction.payload);
    } else {
      setError(
        resultAction.error?.message ||
          `Failed to ${isEditMode ? "update" : "create"} ${entityType}`,
      );
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

      {isAuthor ? (
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
      ) : (
        <div>
          <label className="text-sm font-medium text-slate-600">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email..."
            className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition"
          />
          {fieldErrors.email && (
            <span className="text-rose-600 text-xs">{fieldErrors.email}</span>
          )}
        </div>
      )}

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
          {submitting
            ? "Saving..."
            : `${isEditMode ? "Update" : "Add"} ${isAuthor ? "Author" : "Member"}`}
        </button>
      </div>
    </form>
  );
}
