"use client";

import * as React from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { EventAdData } from "@/types/ad";
import { toast } from "react-hot-toast";
import { UpdatedAd } from "@/features/slicer/AdSlice";

type Values = {
  eventType?: string;
  date?: Date;
  timeStart?: string;
  timeEnd?: string;
  features: string[];
};

function formatDDMMYYYY(d?: Date) {
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function formatDateForAPI(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD format
}

export function EditEventInfoForm({
  onContinue,
}: {
  onContinue?: (values: Values) => void;
}) {
  const [values, setValues] = React.useState<Values>({
    features: [],
    eventType: "party",
  });
  const [open, setOpen] = React.useState(false);

  const setField = <K extends keyof Values>(k: K, v: Values[K]) =>
    setValues((p) => ({ ...p, [k]: v }));

  const [loading, setLoading] = React.useState(false);

  const { Ad } = useSelector((state: any) => state.ad);
  const router = useRouter();
const dispatch=useDispatch()
  // Get ad data from Redux or localStorage
  const myAd = React.useMemo(() => {
    try {
      const adLocalStorage =
        typeof window !== "undefined" ? localStorage.getItem("myAd") : null;
      const parsedLocalAd = adLocalStorage ? JSON.parse(adLocalStorage) : null;
      return Ad && Object.keys(Ad).length > 0 ? Ad : parsedLocalAd;
    } catch (error) {
      console.error("Error parsing ad data:", error);
      return null;
    }
  }, [Ad]);

  console.log(myAd, "✅ myAd (final usable data)");

  // Initialize form with existing data
  React.useEffect(() => {
    if (myAd) {
      // Set event type
      if (myAd.eventType) {
        setField("eventType", myAd.eventType);
      }

      // Set date
      if (myAd.eventDate) {
        setField("date", new Date(myAd.eventDate));
      }

      // Set time
      if (myAd.eventTime) {
        const formattedTime = formatTimeForInput(myAd.eventTime);
        setField("timeStart", formattedTime);
      }

      // Set end time if available, otherwise calculate
      if (myAd.endTime) {
        const formattedEndTime = formatTimeForInput(myAd.endTime);
        setField("timeEnd", formattedEndTime);
      } else if (myAd.eventTime) {
        // Calculate end time as 2 hours after start
        const formattedTime = formatTimeForInput(myAd.eventTime);
        if (formattedTime) {
          const [hours, minutes] = formattedTime.split(":").map(Number);
          const endHours = (hours + 2) % 24;
          setField(
            "timeEnd",
            `${endHours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}`
          );
        }
      }

      // Set features
      if (myAd.featuresAmenities && Array.isArray(myAd.featuresAmenities)) {
        setField("features", myAd.featuresAmenities);
      }
    }
  }, [myAd]);

  const formatTimeForInput = (timeString: string): string => {
    if (!timeString) return "";

    console.log(`🕒 Formatting time: "${timeString}"`);

    // If already in correct format for input[type="time"] (HH:MM), return as is
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
      console.log(`✅ Already in 24-hour format: ${timeString}`);
      return timeString;
    }

    // If in 12-hour format with AM/PM, convert to 24-hour
    const time = timeString.match(/(\d+):?(\d+)?\s*(AM|PM)/i);
    if (time) {
      let hours = parseInt(time[1]);
      const minutes = time[2] || "00";
      const period = time[3].toUpperCase();

      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      const formattedTime = `${hours
        .toString()
        .padStart(2, "0")}:${minutes.padStart(2, "0")}`;
      console.log(`🔄 Converted ${timeString} to ${formattedTime}`);
      return formattedTime;
    }

    // If it's just hours without minutes, add minutes
    if (/^\d{1,2}$/.test(timeString)) {
      const formattedTime = `${timeString.padStart(2, "0")}:00`;
      console.log(`🔄 Added minutes to ${timeString}: ${formattedTime}`);
      return formattedTime;
    }

    console.log(`❌ Could not format time: ${timeString}`);
    return timeString;
  };

  const formatTimeForAPI = (timeString: string): string => {
    if (!timeString) return "";

    // Convert 24-hour format to 12-hour format with AM/PM for API
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const twelveHour = hours % 12 || 12;

    return `${twelveHour}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const toggleFeature = (f: string) =>
    setValues((p) => ({
      ...p,
      features: p.features.includes(f)
        ? p.features.filter((x) => x !== f)
        : [...p.features, f],
    }));

  const handleSubmit = async () => {
    if (!isFormValid || !myAd?._id) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      // Prepare the data for API
      const formData = new FormData();

      // Append basic ad data from myAd
      formData.append("adType", myAd.adType || "event");
      formData.append("title", myAd.title || "");
      formData.append("description", myAd.description || "");
      formData.append(
        "locationSameAsProfile",
        String(myAd.locationSameAsProfile || true)
      );
      formData.append("city", myAd.city || "");
      formData.append("neighbourhood", myAd.neighbourhood || "");
      formData.append("phone", myAd.phone || "");
      formData.append("showPhone", String(myAd.showPhone !== false));

      // Append event-specific data from form values
      formData.append("eventType", values.eventType || "");

      if (values.date) {
        formData.append("eventDate", formatDateForAPI(values.date));
      }

      if (values.timeStart) {
        formData.append("eventTime", formatTimeForAPI(values.timeStart));
      }

      if (values.timeEnd) {
        formData.append("endTime", formatTimeForAPI(values.timeEnd));
      }

      // Append features
      if (values.features.length > 0) {
        formData.append("featuresAmenities", JSON.stringify(values.features));
      }

      // Append images if any new images were added
      if (myAd.newImages?.length) {
        myAd.newImages.forEach((image: any, index: number) => {
          if (image instanceof File && image.size > 0) {
            formData.append("images", image);
          }
        });
      }

      // Append removed images if any
      if (myAd.removedExistingImages?.length) {
        formData.append(
          "removedImages",
          JSON.stringify(myAd.removedExistingImages)
        );
      }

      // Log FormData contents for debugging
      console.log("📤 FormData being sent:");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      });

      // Import your update API function

      // Call update API
      const res = await dispatch(
        UpdatedAd({
          id: myAd._id,
          data: formData,
        }) as any
      ).unwrap();

      if (res.success) {
        toast.success("Event updated successfully!");
        // Clear localStorage and redirect
        localStorage.removeItem("myAd");
        router.push("/all-my-ads");
      } else {
        toast.error(res.message || "Failed to update event");
      }
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast.error(error?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue(values);
    } else {
      handleSubmit();
    }
  };

  const isFormValid =
    !!values.eventType &&
    !!values.date &&
    !!values.timeStart &&
    !!values.timeEnd;

  return (
    <div className="space-y-6">
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

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Event Information</h2>
        <Card className="rounded-2xl border bg-card p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Event Type
                {!values.eventType ? (
                  <span className="ml-0.5 text-destructive">*</span>
                ) : null}
              </Label>
              <Select
                value={values.eventType}
                onValueChange={(v) => setField("eventType", v)}
              >
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Choose an event type" />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="concert">Concert</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="exhibition">Exhibition</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Date
                {!values.date ? (
                  <span className="ml-0.5 text-destructive">*</span>
                ) : null}
              </Label>
              <div className="relative w-full sm:w-64">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full rounded-full border bg-background px-10 py-2.5 text-left text-sm",
                        !values.date && "text-muted-foreground"
                      )}
                    >
                      {formatDDMMYYYY(values.date) || "dd-mm-yyyy"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={values.date}
                      onSelect={(d) => {
                        setField("date", d || undefined);
                        setOpen(false);
                      }}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Time
                {!(values.timeStart && values.timeEnd) ? (
                  <span className="ml-0.5 text-destructive">*</span>
                ) : null}
              </Label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="time"
                    className="pl-10 w-full sm:w-40"
                    value={values.timeStart ?? ""}
                    onChange={(e) => setField("timeStart", e.target.value)}
                  />
                </div>
                <span className="text-muted-foreground hidden sm:inline">
                  -
                </span>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="time"
                    className="pl-10 w-full sm:w-40"
                    value={values.timeEnd ?? ""}
                    onChange={(e) => setField("timeEnd", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Features & Amenities</div>
              <div className="space-y-3">
                {[
                  "Family Friendly",
                  "Parking available",
                  "Wheelchair accessible",
                  "Indoor",
                  "Free entry",
                  "Food & Drinks",
                  "Live Music",
                  "Outdoor",
                ].map((label) => (
                  <label
                    key={label}
                    className="flex items-center gap-3 text-sm cursor-pointer"
                  >
                    <EnhancedCheckbox
                      checked={values.features.includes(label)}
                      onCheckedChange={() => toggleFeature(label)}
                      aria-label={label}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-4">
              <Button
                variant="primary"
                disabled={!isFormValid || loading}
                className={cn(
                  "rounded-full px-6 transition-transform hover:translate-y-[-1px]",
                  loading && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleContinue}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    Update Event
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
