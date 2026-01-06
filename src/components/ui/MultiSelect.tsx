/**
 * MultiSelect Component
 * Checkbox-based multi-select with collapsible sections and search
 */

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import type { SelectOption } from '@/types';

interface MultiSelectProps {
  /** Section label displayed in header */
  label: string;
  /** Available options to select from */
  options: SelectOption[];
  /** Currently selected values */
  value: string[];
  /** Callback when selection changes */
  onChange: (selected: string[]) => void;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Whether section is initially expanded */
  defaultExpanded?: boolean;
  /** Maximum height of options list before scrolling */
  maxHeight?: number;
}

export default function MultiSelect({
  label,
  options,
  value,
  onChange,
  searchPlaceholder = 'Search...',
  defaultExpanded = false,
  maxHeight = 200,
}: MultiSelectProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // Toggle individual option
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  // Select all visible options
  const handleSelectAll = () => {
    const visibleValues = filteredOptions.map((opt) => opt.value);
    const newSelection = [...new Set([...value, ...visibleValues])];
    onChange(newSelection);
  };

  // Clear all selections
  const handleClear = () => {
    onChange([]);
  };

  // Get count badge text
  const getCountText = () => {
    if (value.length === 0) return null;
    return value.length === 1 ? '1 selected' : `${value.length} selected`;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header - always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown size={16} className="text-gray-500" />
          ) : (
            <ChevronRight size={16} className="text-gray-500" />
          )}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        {value.length > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
            {getCountText()}
          </span>
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Search and actions bar */}
          <div className="p-2 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              {/* Search input */}
              <div className="flex-1 relative">
                <Search
                  size={14}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Action buttons */}
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
              >
                All
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-gray-500 hover:text-gray-700 whitespace-nowrap"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Options list */}
          <div
            className="overflow-y-auto bg-white"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-xs text-gray-400 text-center">
                No options found
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-50 ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(option.value)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span
                        className={`text-sm ${
                          isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'
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
