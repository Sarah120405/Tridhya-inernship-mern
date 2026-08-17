// components/ProductForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Jewellery",
  "Stationery",
];

export default function ProductForm({ existingProduct }) {
  const navigate = useNavigate();
  const isEditMode = Boolean(existingProduct);

  const [formData, setFormData] = useState({
    name: existingProduct?.name || "",
    description: existingProduct?.description || "",
    category: existingProduct?.category || "Electronics",
    price: existingProduct?.price || "",
    stock: existingProduct?.stock || "",
    image: null,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageChange(e) {
    setFormData((prev) => ({ ...prev, image: e.target.files?.[0] || null }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Enter a valid price";
    if (formData.stock === "" || Number(formData.stock) < 0)
      newErrors.stock = "Enter a valid stock quantity";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const validationErrors = validate();
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!isEditMode && !formData.image) {
      setError("Please select a product image");
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const url = isEditMode
        ? `http://localhost:5000/api/products/${existingProduct._id}`
        : "http://localhost:5000/api/products";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: data,
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(
          errData.error ||
            `Failed to ${isEditMode ? "update" : "create"} product`,
        );
        return;
      }

      const savedProduct = await res.json();
      navigate(`/products/${savedProduct._id}`);
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      {error && <p className="text-rose-600 text-sm">{error}</p>}

      <div>
        <label className="text-sm font-medium text-slate-600">
          Product Name
        </label>
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
        <label className="text-sm font-medium text-slate-600">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition"
        />
        {fieldErrors.description && (
          <span className="text-rose-600 text-xs">
            {fieldErrors.description}
          </span>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-600">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition bg-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-600">
            Price (₹)
          </label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition"
          />
          {fieldErrors.price && (
            <span className="text-rose-600 text-xs">{fieldErrors.price}</span>
          )}
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-600">Stock</label>
          <input
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition"
          />
          {fieldErrors.stock && (
            <span className="text-rose-600 text-xs">{fieldErrors.stock}</span>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-600">
          Product Image
        </label>
        {isEditMode && existingProduct.image && !formData.image && (
          <img
            src={existingProduct.image}
            alt="Current"
            className="w-24 h-24 object-cover rounded-lg mb-2 mt-1"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block mt-1 text-sm"
        />
        {isEditMode && (
          <p className="text-xs text-slate-400 mt-1">
            Leave empty to keep the current image
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-xl bg-purple-600 text-white font-semibold py-3 hover:bg-purple-700 transition disabled:opacity-50"
      >
        {submitting
          ? "Saving..."
          : isEditMode
            ? "Update Product"
            : "Add Product"}
      </button>
    </form>
  );
}
