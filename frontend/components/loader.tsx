"use client";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        {/* App Name */}
        <h1 className="text-2xl font-semibold text-primary tracking-wide">
          Wafferli App
        </h1>

        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
