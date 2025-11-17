"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/features/slicer/AdSlice";
import toast from "react-hot-toast";

interface WishlistButtonProps {
  adId: string;
  isFavorited?: boolean;
}

export default function WishlistButton({
  adId,
  isFavorited = false,
}: WishlistButtonProps) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isFav, setIsFav] = useState(isFavorited);
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  //  Sync with prop changes
  useEffect(() => {
    setIsFav(isFavorited);
  }, [isFavorited]);

  //  Correct toggle function
  const toggleWishlist = async () => {
    if (!adId || isLoading || !isAuthenticated) {
      if (!isAuthenticated) {
        toast.error("You must be logged in to add favorites");
      }
      return;
    }

    try {
      setIsLoading(true);

      //  Toggle locally first for instant UI feedback
      setIsFav((prev) => !prev);

      const res = await dispatch(toggleFavorite(adId) as any).unwrap();

      //  Set based on API response
      if (res.success) {
        setIsFav(res.data.isFavorited); //  API ke hisab se set karo
      } else {
        //  If API fails, revert back
        setIsFav((prev) => !prev);
        toast.error("Failed to update favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      //  Revert on error
      setIsFav((prev) => !prev);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 ${
        isFav ? "text-red-500" : "text-gray-600" //  isFav use karo
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
      ) : (
        <Heart
          className="w-5 h-5 transition-all duration-200"
          fill={isFav ? "currentColor" : "none"} //  isFav use karo
          strokeWidth={isFav ? 0 : 2} //  isFav use karo
        />
      )}
    </button>
  );
}
