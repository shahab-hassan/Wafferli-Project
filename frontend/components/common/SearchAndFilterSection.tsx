import { useMediaQuery } from "react-responsive";
import { Button } from "./button";
import { Filter } from "lucide-react";
import { Badge } from "./badge";

export function SearchAndFilterSection({
  showFilters,
  setShowFilters,
  getActiveFilterCount,
}: {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  getActiveFilterCount: () => number;
}) {
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  return (
    <div className="flex flex-row gap-4 items-center mb-10">
      <Button
        variant="normal"
        onClick={() => setShowFilters(!showFilters)}
        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-4 sm:px-8 py-3 sm:py-5 relative text-white font-medium shrink-0"
      >
        <Filter className="w-4 sm:w-5 h-4 sm:h-5 mr-3" />
        {isDesktop ? "Filters" : ""}
        {getActiveFilterCount() > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-tertiary text-black rounded-full w-7 h-7 p-0 flex items-center justify-center text-smaller-bold">
            {getActiveFilterCount()}
          </Badge>
        )}
      </Button>
    </div>
  );
}
