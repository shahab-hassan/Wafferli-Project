import { MapPin, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { Input } from "./common/input";
import { Button } from "./common/button";

export function HeroSection({
  title = "",
  subtitle = "",
  placeholder = "",
  searchQuery,
  setSearchQuery,
  onSearch,
  suggestions = [],
  showSuggestions = false,
  onSuggestionSelect,
  onHideSuggestions,
}: {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  suggestions?: any[];
  showSuggestions?: boolean;
  onSuggestionSelect: (suggestion: any) => void;
  onHideSuggestions: () => void;
}) {
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        onHideSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onHideSuggestions]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    // Full width container - main change yahan hai
    <section className="w-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-4 sm:p-8 lg:p-12 mb-8 sm:mb-12">
      {/* Inner container for content alignment */}
      <div className="w-full max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            {subtitle}
          </p>

          <div
            className="relative max-w-2xl mx-auto px-4 sm:px-0"
            ref={suggestionsRef}
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="text"
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 sm:pl-12 pr-4 py-2 sm:py-3 rounded-full border-2 focus:border-primary transition-colors text-sm sm:text-base"
                />

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-lg mt-2 z-50 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                        onClick={() => onSuggestionSelect(suggestion)}
                      >
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-foreground text-sm sm:text-base">
                            {suggestion.name}
                          </div>
                          {suggestion.category && (
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {suggestion.category}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                onClick={onSearch}
                className="rounded-full px-6 sm:px-8 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
