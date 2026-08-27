export default function SelectField({
  label,
  value,
  name,
  onChange,
  options,
  placeholder,
}) {
  return (
    <div className="flex-1">
      <label className="mb-1.5 block text-xs font-medium text-[#6F6878]">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#E8E1EF] bg-white px-3 py-2.5 text-sm text-[#29252F] outline-none focus:border-[#8B7CE6] focus:ring-4 focus:ring-[#EDE9FE]"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
