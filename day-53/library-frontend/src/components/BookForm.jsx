// components/BookForm.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBook, updateBook } from "../store/slice/bookSlice";

export default function BookForm({
  existingBook,
  authors,
  onSuccess,
  onCancel,
}) {
  const dispatch = useDispatch();
  const isEditMode = Boolean(existingBook);

  const [formData, setFormData] = useState({
    title: existingBook?.title || "",
    author_id: existingBook?.author_id || (authors[0]?.id ?? ""),
    genre: existingBook?.genre || "",
    published_year: existingBook?.published_year || "",
    copies_available: existingBook?.copies_available ?? 1,
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
    if (!formData.author_id) newErrors.author_id = "Author is required";
    if (!formData.published_year)
      newErrors.published_year = "Published year is required";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const validationErrors = validate();
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    const payload = {
      ...formData,
      author_id: Number(formData.author_id),
      published_year: Number(formData.published_year),
      copies_available: Number(formData.copies_available),
    };

    const resultAction = isEditMode
      ? await dispatch(
          updateBook({ bookId: existingBook.id, bookData: payload }),
        )
      : await dispatch(createBook(payload));
    setSubmitting(false);

    const actionCreator = isEditMode ? updateBook : createBook;

    if (actionCreator.fulfilled.match(resultAction)) {
      onSuccess(resultAction.payload);
    } else {
      setError(
        resultAction.error?.message ||
          `Failed to ${isEditMode ? "update" : "create"} book`,
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-rose-600 text-sm">{error}</p>}

      <div>
        <label className="text-sm font-medium text-slate-600">Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition"
        />
        {fieldErrors.title && (
          <span className="text-rose-600 text-xs">{fieldErrors.title}</span>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-600">Author</label>
        <select
          name="author_id"
          value={formData.author_id}
          onChange={handleChange}
          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition bg-white"
        >
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        {fieldErrors.author_id && (
          <span className="text-rose-600 text-xs">{fieldErrors.author_id}</span>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-600">Genre</label>
        <input
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-600">
            Published Year
          </label>
          <input
            name="published_year"
            type="number"
            value={formData.published_year}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition"
          />
          {fieldErrors.published_year && (
            <span className="text-rose-600 text-xs">
              {fieldErrors.published_year}
            </span>
          )}
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-600">
            Copies Available
          </label>
          <input
            name="copies_available"
            type="number"
            value={formData.copies_available}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition"
          />
        </div>
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
          {submitting ? "Saving..." : isEditMode ? "Update Book" : "Add Book"}
        </button>
      </div>
    </form>
  );
}
