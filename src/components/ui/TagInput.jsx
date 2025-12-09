import { useState } from "react";
import { X } from "lucide-react";

export default function TagInput({
  value = [],
  onChange,
  placeholder = "Type and press Enter",
  validate,
}) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Check for duplicates
    if (value.includes(trimmed)) {
      setError("Already added");
      return;
    }

    // Run custom validation if provided
    if (validate) {
      const validationError = validate(trimmed);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    onChange([...value, trimmed]);
    setInputValue("");
    setError("");
  };

  const removeTag = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[42px] bg-white focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none text-sm"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
