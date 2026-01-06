import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  children: ReactNode;
}

export default function FormField({
  label,
  name,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-foreground mb-1"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
