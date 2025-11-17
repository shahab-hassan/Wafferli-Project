"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/common/shadecn-card";
import { Label } from "@/components/common/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { Button } from "@/components/common/button";
import { EnhancedCheckbox } from "@/components/common/enhanced-checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/popover";
import { Calendar } from "@/components/common/calender";
import { Input } from "@/components/common/input";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, PartyPopper, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { setAdData } from "@/features/slicer/AdSlice";
import type { RootState } from "@/features/store/store";
import type { EventAdData } from "@/features/slicer/AdSlice";

// Date formatting utility
function formatDDMMYYYY(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

// Convert 24-hour time to 12-hour format with AM/PM
const convertTo12Hour = (time24: string): string => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// Convert 12-hour format to 24-hour for input
const convertTo24Hour = (time12: string): string => {
  if (!time12) return "";
  const [time, period] = time12.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  let hours24 = hours;
  if (period === "PM" && hours !== 12) {
    hours24 = hours + 12;
  } else if (period === "AM" && hours === 12) {
    hours24 = 0;
  }

  return `${hours24.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export function EventInfoForm({ onChangeType }: { onChangeType: () => void }) {
  const dispatch = useDispatch();
  const adData = useSelector(
    (state: RootState) => state.ad.adData
  ) as EventAdData;
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  // Ensure features array always exists
  const features = adData?.features || [];

  // Type-safe setField function
  const setField = <K extends keyof EventAdData>(
    key: K,
    value: EventAdData[K]
  ) => {
    dispatch(setAdData({ [key]: value }));
  };

  // Toggle feature - with safety check
  const toggleFeature = (feature: string) => {
    const currentFeatures = features;
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter((f) => f !== feature)
      : [...currentFeatures, feature];

    setField("features", updatedFeatures);
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD format
      setField("eventDate", formattedDate);
    }
    setOpen(false);
  };

  // Handle time change
  // const handleTimeChange = (field: "eventTime" | "endTime", time: string) => {
  //   setField(field, time);
  // };

  // Validation
  const eventTypeValid = !!adData?.eventType?.trim();
  const dateValid = !!adData?.eventDate;
  const timeValid = !!adData?.eventTime && !!adData?.endTime;

  // Time validation: end time should be after start time
  const timeOrderValid =
    adData?.eventTime && adData?.endTime && adData.eventTime < adData.endTime;

  const valid = eventTypeValid && dateValid && timeValid && timeOrderValid;

  // Event type options
  const eventTypeOptions = [
    { value: "concert", label: "Concert" },
    { value: "sports", label: "Sports" },
    { value: "exhibition", label: "Exhibition" },
    { value: "festival", label: "Festival" },
    { value: "conference", label: "Conference" },
    { value: "workshop", label: "Workshop" },
    { value: "party", label: "Party" },
    { value: "other", label: "Other" },
  ];

  // Features options
  const featureOptions = [
    "Family Friendly",
    "Parking available",
    "Wheelchair accessible",
    "Indoor",
    "Free entry",
    "Food & Drinks",
    "Live Music",
    "Outdoor",
    "Paid entry",
  ];
  // Convert stored 12-hour times back to 24-hour for input display
  const eventTime24 = adData?.eventTime
    ? convertTo24Hour(adData.eventTime)
    : "";
  const endTime24 = adData?.endTime ? convertTo24Hour(adData.endTime) : "";

  // Handle time change - save in 12-hour format with AM/PM
  const handleTimeChange = (field: "eventTime" | "endTime", time24: string) => {
    if (time24 && /^\d{2}:\d{2}$/.test(time24)) {
      const time12 = convertTo12Hour(time24);
      setField(field, time12);
    } else {
      setField(field, time24);
    }
  };

  return (
    <div className="space-y-6">
      {/* Type summary */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Type</h2>
        <Card className="relative flex flex-col rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PartyPopper className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-sm font-medium">Event</div>
              <div className="text-xs text-muted-foreground">
                Exciting events happening around Kuwait.
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Event Information */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Event Information</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5">
            {/* Event Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Event Type
                {!eventTypeValid && (
                  <span className="ml-0.5 text-destructive">*</span>
                )}
              </Label>
              <Select
                value={adData?.eventType || ""}
                onValueChange={(value: string) => setField("eventType", value)}
              >
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Choose an event type" />
                </SelectTrigger>
                <SelectContent align="start">
                  {eventTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Date
                {!dateValid && (
                  <span className="ml-0.5 text-destructive">*</span>
                )}
              </Label>
              <div className="relative w-full sm:w-64">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full rounded-full border bg-background px-10 py-2.5 text-left text-sm",
                        !adData?.eventDate && "text-muted-foreground"
                      )}
                    >
                      {formatDDMMYYYY(adData?.eventDate) || "dd-mm-yyyy"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={
                        adData?.eventDate
                          ? new Date(adData.eventDate)
                          : undefined
                      }
                      onSelect={handleDateSelect}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Time
                {(!timeValid || !timeOrderValid) && (
                  <span className="ml-0.5 text-destructive">*</span>
                )}
              </Label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="time"
                      className="pl-10 w-40 rounded-full"
                      value={eventTime24}
                      onChange={(e) =>
                        handleTimeChange("eventTime", e.target.value)
                      }
                    />
                  </div>
                  <span className="text-muted-foreground">-</span>
                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="time"
                      className="pl-10 w-40 rounded-full"
                      value={endTime24}
                      onChange={(e) =>
                        handleTimeChange("endTime", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Time validation message */}
                {adData?.eventTime && adData?.endTime && !timeOrderValid && (
                  <div className="text-xs text-destructive">
                    End time must be after start time
                  </div>
                )}

                {/* Display selected times in 12-hour format */}
                {(adData?.eventTime || adData?.endTime) && timeOrderValid && (
                  <div className="text-xs text-muted-foreground">
                    Selected: {adData.eventTime} to {adData.endTime}
                  </div>
                )}
              </div>
            </div>

            {/* Features & Amenities */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Features & Amenities</div>
              <div className="space-y-3">
                {featureOptions.map((label) => (
                  <label
                    key={label}
                    className="flex items-center gap-3 text-sm"
                  >
                    <EnhancedCheckbox
                      checked={features.includes(label)}
                      onCheckedChange={() => toggleFeature(label)}
                      aria-label={label}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-4">
              <Button
                variant="primary"
                disabled={!valid}
                className={cn(
                  "rounded-full px-6 transition-transform hover:translate-y-[-1px]"
                )}
                onClick={() => router.push("/post-ad/billing")}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
