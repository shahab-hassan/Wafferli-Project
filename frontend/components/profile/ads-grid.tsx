"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import AdCard from "@/components/common/ad-card";

export default function AdsGrid({ business }: any) {
  const t = useTranslations("profile");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // If business is an array of ads, use it directly
  const ads = Array.isArray(business) ? business : [];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-4 text-sm gap-2">
        {/* You can add header content here if needed */}
      </div>

      {ads.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No ads found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ads.map((item: any, index: number) => (
              <AdCard
                key={item._id || index}
                id={item._id}
                type={item.adType} // This will show the badge
                title={item.title}
                subtitle={item.description}
                image={item.images?.[0] || "/placeholder.svg"}
                category={item.category}
                rating={item.rating}
                reviewCount={item.reviewsCount}
                fullPrice={item.fullPrice}
                discount={item.discountDeal}
                discountPercent={item.discountPercent}
                location={item.city}
                isFavorited={false}
                favoritesCount={item.favoritesCount}
                myAds={true}
                showBadge={true} // Control badge visibility
                onEdit={() => console.log("Edit", item._id)}
                onDelete={() => console.log("Delete", item._id)}
                deleting={false}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-2 text-sm">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                &lt;
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 border rounded ${
                      currentPage === pageNum
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <>
                  <span className="text-gray-500">...</span>
                  <button
                    className={`px-3 py-1 border rounded ${
                      currentPage === totalPages
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
