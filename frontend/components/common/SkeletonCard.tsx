export function SkeletonCard() {
  return (
    <div className="w-full max-w-[320px] h-[290px] bg-white rounded-[12px] overflow-hidden border border-grey-5">
      <div className="h-[145px] bg-gray-200 animate-pulse"></div>
      <div className="p-3 space-y-2.5">
        <div className="h-4 bg-gray-200 animate-pulse w-1/3 rounded-full"></div>
        <div className="space-y-1.5">
          <div className="h-5 bg-gray-200 animate-pulse w-3/4 rounded"></div>
          <div className="h-4 bg-gray-200 animate-pulse w-full rounded"></div>
          <div className="h-4 bg-gray-200 animate-pulse w-2/3 rounded"></div>
        </div>
        <div className="flex justify-between pt-2">
          <div className="flex gap-1 items-center">
            <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-3 w-12 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
}
