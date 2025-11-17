"use client";

import * as React from "react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/common/label";
import { Input } from "@/components/common/input";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: "rounded" | "rectangular";
  disabled?: boolean;
  className?: string;
  status?: string;
  statusType?: "default" | "error" | "success";
  showSearch?: boolean;
}

const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
  (
    {
      label,
      placeholder = "Select an option",
      options,
      value,
      onValueChange,
      variant = "rounded",
      disabled = false,
      className,
      status,
      statusType = "default",
      showSearch = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [focusedIndex, setFocusedIndex] = React.useState(-1);
    const [searchTerm, setSearchTerm] = React.useState("");
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const id = React.useId();

    const selectedOption = options.find((option) => option.value === value);

    // Filter options based on search term
    const filteredOptions = React.useMemo(() => {
      if (!searchTerm.trim()) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [options, searchTerm]);

    const statusColors = {
      default: "text-grey-3",
      error: "text-failure",
      success: "text-success",
    };

    // Handle click outside to close dropdown
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setFocusedIndex(-1);
          setSearchTerm("");
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    // Focus search input when dropdown opens with search
    React.useEffect(() => {
      if (isOpen && showSearch && searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    }, [isOpen, showSearch]);

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            const option = filteredOptions[focusedIndex];
            if (!option.disabled) {
              onValueChange?.(option.value);
              setIsOpen(false);
              setFocusedIndex(-1);
              setSearchTerm("");
            }
          }
          break;
        case "Escape":
          setIsOpen(false);
          setFocusedIndex(-1);
          setSearchTerm("");
          triggerRef.current?.focus();
          break;
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else {
            const nextIndex = Math.min(
              focusedIndex + 1,
              filteredOptions.length - 1
            );
            setFocusedIndex(nextIndex);
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (isOpen) {
            const prevIndex = Math.max(focusedIndex - 1, 0);
            setFocusedIndex(prevIndex);
          }
          break;
        case "Tab":
          if (isOpen) {
            setIsOpen(false);
            setFocusedIndex(-1);
            setSearchTerm("");
          }
          break;
      }
    };

    const handleOptionClick = (option: DropdownOption) => {
      if (!option.disabled) {
        onValueChange?.(option.value);
        setIsOpen(false);
        setFocusedIndex(-1);
        setSearchTerm("");
        triggerRef.current?.focus();
      }
    };

    const handleTriggerClick = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen) {
          setFocusedIndex(0);
          setSearchTerm("");
        }
      }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setFocusedIndex(0); // Reset focus to first item when search changes
    };

    return (
      <div className="w-full" ref={dropdownRef}>
        {label && (
          <Label
            htmlFor={id}
            className="text-normal-regular text-black-3 mb-2 block"
          >
            {label}
          </Label>
        )}

        <div className="relative">
          <button
            ref={triggerRef}
            id={id}
            type="button"
            onClick={handleTriggerClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className={cn(
              // Base styles
              "flex h-10 w-full items-center justify-between bg-white px-3 py-2 text-sm text-left",
              "border border-grey-4 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",

              // Variant styles
              variant === "rounded" ? "rounded-full" : "rounded-md",

              // Status styles
              statusType === "error" &&
                "border-failure focus:ring-failure focus:border-failure",
              statusType === "success" &&
                "border-success focus:ring-success focus:border-success",

              className
            )}
            {...props}
          >
            <span className={cn(!selectedOption && "text-grey-3", "truncate")}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDownIcon
              className={cn(
                "h-4 w-4 text-grey-3 transition-transform flex-shrink-0",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {isOpen && (
            <ul
              ref={listRef}
              role="listbox"
              className={cn(
                "absolute z-50 mt-1 max-h-96 min-w-full overflow-auto bg-white shadow-lg",
                "animate-in fade-in-0 zoom-in-95",
                variant === "rounded" ? "rounded-2xl" : "rounded-md",
                "border border-grey-4"
              )}
            >
              {/* Search Input */}
              {showSearch && (
                <li className="sticky top-0 bg-white border-b border-grey-4 p-2 z-10">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-grey-3" />
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-9 pr-3 py-2 text-sm border-0 focus:ring-0 focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </li>
              )}

              {/* Options List */}
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-sm text-grey-3 text-center">
                  No options found
                </li>
              ) : (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={value === option.value}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center px-3 py-2 text-sm",
                      "outline-none transition-colors",
                      "hover:bg-primary hover:text-white",
                      focusedIndex === index && "bg-primary text-white",
                      value === option.value && "bg-primary/10 text-primary",
                      option.disabled && "pointer-events-none opacity-50",
                      variant === "rounded"
                        ? "first:rounded-t-2xl last:rounded-b-2xl"
                        : "first:rounded-t-md last:rounded-b-md"
                    )}
                    onClick={() => handleOptionClick(option)}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    {option.label}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {status && (
          <p
            className={cn("text-small-regular mt-1", statusColors[statusType])}
          >
            {status}
          </p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export { Dropdown };
