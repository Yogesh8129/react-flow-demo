import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import type { SelectOption } from "@/types";

interface MultiSelectProps {
  label: string;
  options: SelectOption[];
  value: string[];
  onChange: (selected: string[]) => void;
  searchPlaceholder?: string;
  defaultExpanded?: boolean;
  maxHeight?: number;
}

export default function MultiSelect({
  label,
  options,
  value,
  onChange,
  searchPlaceholder = "Search...",
  defaultExpanded = false,
  maxHeight = 200,
}: MultiSelectProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleSelectAll = () => {
    const visibleValues = filteredOptions.map((opt) => opt.value);
    const newSelection = [...new Set([...value, ...visibleValues])];
    onChange(newSelection);
  };

  const handleClear = () => {
    onChange([]);
  };

  const getCountText = () => {
    if (value.length === 0) return null;
    return value.length === 1 ? "1 selected" : `${value.length} selected`;
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-muted hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown size={16} className="text-muted-foreground" />
          ) : (
            <ChevronRight size={16} className="text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        {value.length > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 bg-primary/15 text-primary rounded-full">
            {getCountText()}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-border">
          <div className="p-2 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search
                  size={14}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-7 pr-2 py-1.5 text-xs bg-card text-foreground border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-primary hover:text-secondary whitespace-nowrap"
              >
                All
              </button>
              <span className="text-border">|</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                Clear
              </button>
            </div>
          </div>

          <div
            className="overflow-y-auto bg-card"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                No options found
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-accent ${
                        isSelected ? "bg-primary/10" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(option.value)}
                        className="w-3.5 h-3.5 rounded border-input text-primary focus:ring-ring focus:ring-offset-0"
                      />
                      <span
                        className={`text-sm ${
                          isSelected
                            ? "text-primary font-medium"
                            : "text-foreground"
                        }`}
                      >
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
