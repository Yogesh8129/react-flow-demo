import type { ChangeEvent } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  name?: string;
}

export default function FormSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  name,
}: FormSelectProps) {
  return (
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-card text-foreground border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
