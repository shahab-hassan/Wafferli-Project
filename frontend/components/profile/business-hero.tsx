"use client";

import React, { useEffect, useState } from "react";
import { Heart, Share2 } from "lucide-react";

export default function BusinessHero({ sellerData }: any) {
  const [liked, setLiked] = useState(false);
  const [index, setIndex] = useState(0);

  // sellerData.images se slider images
  const IMAGES =
    sellerData?.images?.length > 0
      ? sellerData.images
      : ["https://via.placeholder.com/800x400?text=No+Image"]; // placeholder agar koi image na ho

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length);
    }, 3000);
    return () => clearInterval(id);
  }, [IMAGES.length]);

  return (
    <section className="relative w-full h-[220px] md:h-[300px] lg:h-[360px] rounded-xl overflow-hidden border border-white/30 mt-4">
      <div className="absolute inset-0">
        {IMAGES.map((src, i) => (
          <div
            key={src + i}
            className={`absolute inset-0 bg-center bg-cover transition-opacity duration-700 ease-in-out transform ${
              i === index
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0"
            }`}
            style={{ backgroundImage: `url(${src})` }}
            aria-hidden
          />
        ))}
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
        <button
          aria-pressed={liked}
          onClick={() => setLiked((s) => !s)}
          className="p-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/40 shadow transition transform hover:scale-105 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/40"
          title={liked ? "Unfavorite" : "Favorite"}
        >
          <Heart
            className={`w-5 h-5 ${liked ? "text-primary" : "text-gray-600"}`}
          />
        </button>

        <button
          className="p-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/40 shadow transition transform hover:scale-105 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/40"
          title="Share"
        >
          <Share2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all w-2 h-2 rounded-full ${
              i === index
                ? "w-8 h-2 rounded-full bg-primary"
                : "bg-white/70 border border-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-6 pointer-events-none" />
    </section>
  );
}
