"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { SearchSuggestion } from "@/features/slicer/AdSlice";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export default function SearchBar({ className, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await dispatch(
          SearchSuggestion({ query }) as any
        ).unwrap();
        setSuggestions(response.data.suggestions || []);
      } catch (error) {
        console.error(error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    if (!showResults) fetchSuggestions();
  }, [query, dispatch, showResults]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setShowResults(true);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const handleItemClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    setQuery(item.title);
    setShowResults(true);

    if (item.adType && item._id) {
      router.push(`/${item.adType}/${item._id}`);
    }
  };

  return (
    <div className={cn("w-full max-w-2xl relative", className)}>
      <form onSubmit={handleSearch} className="relative">
        <div
          className={cn(
            // RESPONSIVE FIXES
            "flex w-full items-center px-3 py-2 rounded-full border-2 transition-all duration-200",
            "bg-white border-gray-200 hover:border-gray-300",
            "sm:h-12 h-auto gap-2 flex-wrap sm:flex-nowrap",
            isFocused && "border-primary shadow-sm"
          )}
        >
          {/* Search Icon */}
          <Search
            size={20}
            className={cn(
              "text-gray-400 mr-1 flex-shrink-0",
              isFocused && "text-primary"
            )}
          />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(false);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={
              placeholder || "Search for offers, products, services..."
            }
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400 text-gray-800"
          />

          {/* Clear Button (Hide on Mobile) */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors sm:block hidden"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="md:flex hidden ml-0 sw-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isFocused && (suggestions.length > 0 || showResults) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {loading && <div className="p-3 text-gray-500">Loading...</div>}

          {suggestions.length === 0 && showResults && !loading && (
            <div className="p-3 text-gray-500">No results found.</div>
          )}

          {suggestions.map((item) => (
            <div
              key={item.id}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
              onClick={(e) => handleItemClick(e, item)}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-10 h-10 object-cover rounded-md mr-3"
                />
              )}

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {item.title}
                </span>
                <span className="text-xs text-gray-500">
                  {item.neighbourhood}, {item.city}
                </span>

                {item.adType && (
                  <span className="text-xs text-primary mt-1 font-medium">
                    {item.adType}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
