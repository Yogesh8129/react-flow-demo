import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  validate?: (value: string) => string | null;
}

export default function TagInput({
  value = [],
  onChange,
  placeholder = "Type and press Enter",
  validate,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (value.includes(trimmed)) {
      setError("Already added");
      return;
    }

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

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-2 border border-input rounded-md min-h-[42px] bg-card focus-within:ring-2 focus-within:ring-ring focus-within:border-primary transition-colors">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-foreground text-sm rounded"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-muted-foreground hover:text-foreground transition-colors"
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
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent text-foreground placeholder:text-muted-foreground"
        />
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
