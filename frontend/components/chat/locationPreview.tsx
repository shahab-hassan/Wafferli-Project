import { MapPin, Navigation } from "lucide-react";

interface LocationPreviewProps {
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  className?: string;
}
export function LocationPreview({
  location,
  className = "",
}: LocationPreviewProps) {
  const openInMaps = () => {
    const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    window.open(url, "_blank");
  };

  const getStaticMapUrl = () => {
    // Using a static map service - you can use Google Static Maps, MapBox, etc.
    return `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=300x150&markers=color:red%7C${location.lat},${location.lng}&key=YOUR_MAPS_API_KEY`;
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
    >
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium text-gray-900">
            Location Shared
          </span>
        </div>
      </div>

      {/* Map Preview */}
      <div className="relative">
        {/* Static Map Image - Replace with your preferred map service */}
        <div
          className="w-full h-32 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center cursor-pointer"
          onClick={openInMaps}
        >
          <div className="text-center">
            <div className="relative">
              <Navigation className="h-6 w-6 text-red-500 mx-auto mb-1" />
              <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">Click to view in maps</p>
          </div>
        </div>

        {/* Coordinates */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </div>
      </div>

      {/* Address if available */}
      {location.address && (
        <div className="p-3 bg-gray-50">
          <p className="text-xs text-gray-600 truncate">{location.address}</p>
        </div>
      )}

      {/* Action Button */}
      <div className="p-2 border-t border-gray-100">
        <button
          onClick={openInMaps}
          className="w-full flex items-center justify-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium py-1"
        >
          <Navigation className="h-3 w-3" />
          Open in Maps
        </button>
      </div>
    </div>
  );
}
