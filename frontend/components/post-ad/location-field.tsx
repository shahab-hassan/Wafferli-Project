"use client";

import * as React from "react";
import { Label } from "@/components/common/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { Input } from "@/components/common/input";
import { cn } from "@/lib/utils";
import { allCity, allNeighborhood } from "@/lib/data";

// Convert enum arrays to the expected format
const cities = allCity.map((city, index) => ({
  id: city,
  name: city
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
}));

const neighborhoods = allNeighborhood.map((neighborhood, index) => ({
  id: neighborhood,
  name: neighborhood
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
  cityId: "kuwait-city", // You might want to map neighborhoods to cities properly
}));

type Props = {
  value: { city?: string; neighborhood?: string };
  onChange: (next: { city?: string; neighborhood?: string }) => void;
  className?: string;
};

export function LocationFields({ value, onChange, className }: Props) {
  const [citySearch, setCitySearch] = React.useState("");
  const [neighSearch, setNeighSearch] = React.useState("");

  const filteredCities = React.useMemo(() => {
    return cities.filter((c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase())
    );
  }, [citySearch]);

  const filteredNeighborhoods = React.useMemo(() => {
    let list = neighborhoods;
    if (value.city) {
      // Filter neighborhoods by selected city if you have proper city-neighborhood mapping
      list = list; // Add proper filtering logic based on your data structure
    }
    return list.filter((n) =>
      n.name.toLowerCase().includes(neighSearch.toLowerCase())
    );
  }, [value.city, neighSearch]);

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      {/* City */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">City</Label>
        <Select
          value={value.city}
          onValueChange={(v) => onChange({ city: v, neighborhood: undefined })}
        >
          <SelectTrigger className="w-full" aria-label="Select City">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Input
                placeholder="Search city..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="mb-2"
              />
            </div>
            {filteredCities.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Neighborhood */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Neighborhood</Label>
        <Select
          value={value.neighborhood}
          onValueChange={(v) => onChange({ ...value, neighborhood: v })}
          disabled={!value.city}
        >
          <SelectTrigger className="w-full" aria-label="Select Neighborhood">
            <SelectValue placeholder="Select Neighborhood" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Input
                placeholder="Search neighborhood..."
                value={neighSearch}
                onChange={(e) => setNeighSearch(e.target.value)}
                className="mb-2"
              />
            </div>
            {filteredNeighborhoods.map((n) => (
              <SelectItem key={n.id} value={n.id}>
                {n.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default LocationFields;
