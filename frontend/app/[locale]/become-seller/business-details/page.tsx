"use client";

import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/components/seller/upload-dropzone";
import { StepFooter } from "@/components/seller/step-input";
import { SellerHero } from "@/components/seller/hero-panel";
import { ComboSelect } from "@/components/seller/combo-select";
import { IconLink } from "@/components/seller/social-input";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateSeller, setSellerData } from "@/features/slicer/SellerSlice";
import { Button } from "@/components/common/button";
import toast from "react-hot-toast";

const CITIES = ["Kuwait City", "Hawally", "Salmiya", "Farwaniya", "Jahra"];
const NEIGHBORHOODS = {
  "Kuwait City": ["Sharq", "Dasman", "Qibla", "Mirqab"],
  Hawally: ["Bayan", "Jabriya", "Rumaithiya"],
  Salmiya: ["Block 10", "Marina", "Salmiya Center"],
  Farwaniya: ["Khaitan", "Al-Dajeej"],
  Jahra: ["Naeem", "Al-Qaser"],
} as const;

const CATEGORIES = [
  "Food & Beverage",
  "Clothing",
  "Beauty",
  "Electronics",
  "Services",
];

export default function Step3() {
  const router = useRouter();
  const { sellerData } = useSelector((state: any) => state.seller);
  const data = sellerData;
  const [website, setWebsite] = useState(data.website || "");

  // const [category, setCategory] = useState<string>(data.category || "");
  const [facebook, setFacebook] = useState<string>(data.facebook || "");
  const [instagram, setInstagram] = useState<string>(data.instagram || "");
  const [isLoading, setIsloading] = useState(false);

  const dispatch = useDispatch();
  const handleSeller = async () => {
    // ✅ Required fields validation
    console.log(data, "data");
    if (!data.businessType?.trim()) {
      toast.error("Please select a business type first");
      return;
    }

    if (!data.name?.trim()) {
      toast.error("Please enter the business name");
      return;
    }

    // ✅ Optional social links (Facebook, Instagram)
    const socialLinks = {
      facebook: facebook?.trim() || "",
      instagram: instagram?.trim() || "",
    };

    // ✅ Create FormData
    const formData = new FormData();
    formData.append("businessType", data.businessType);
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("category", "category"); // static for now
    formData.append("socialLinks", JSON.stringify(socialLinks));
    formData.append("city", data.city || "");
    formData.append("neighbourhood", data.neighborhood || "");
    formData.append("website", website || "");

    // ✅ Add gallery images
    // ✅ Add gallery
    if (Array.isArray(data.gallery) && data.gallery.length > 0) {
      data.gallery.forEach((item: any) => {
        formData.append("images", item.file || item); // support both File or object
      });
    }

    // ✅ Add logo
    if (data.logo) {
      formData.append("logo", data.logo.file || data.logo); // same check
    }

    // ✅ API Call with proper loading state
    try {
      setIsloading(true);
      const res = await dispatch(CreateSeller(formData) as any).unwrap();
      console.log(res, "res");

      if (res.success) {
        toast.success("Seller created successfully! 🎉");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsloading(false);
    }

    console.log([...formData.entries()], "📦 FormData check");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1220px] w-full mx-auto mt-10 mb-10 px-4">
      <div>
        <SellerHero stepIndex={0} />
      </div>
      <div className="space-y-6">
        {/* Images Section */}
        <div>
          <h2 className="text-xl font-semibold text-[var(--brand-ink)] mb-2">
            Images
          </h2>
          <p className="text-sm text-[color-mix(in oklab, var(--brand-ink) 55%, white)]">
            For the cover picture we recommend using the landscape mode.
          </p>

          {/* ✅ Upload Component */}
          <UploadDropzone
            type="gallery"
            onFiles={(files) =>
              dispatch(
                setSellerData({
                  gallery: [...(data.gallery || []), ...files], // add new files
                })
              )
            }
            multiple
            large
          />

          {/* ✅ Image Preview with Delete Icon */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {data.gallery?.map((file: any, index: number) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                {/* Delete Button */}
                <button
                  onClick={() => {
                    const updatedGallery = data.gallery.filter(
                      (_: any, i: number) => i !== index
                    );
                    dispatch(setSellerData({ gallery: updatedGallery }));
                  }}
                  className="absolute top-1 right-1 bg-black/60 text-white text-xs p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Category */}
        {/* <div className="mt-4">
          <ComboSelect
            label="Category"
            items={CATEGORIES}
            value={category}
            onChange={setCategory}
          />
        </div> */}

        {/* Website URL */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-[var(--brand-ink)] mb-2">
            Website URL
          </label>
          <IconLink
            icon="external-link"
            placeholder="Enter Website URL"
            value={website}
            onChange={(e: any) => setWebsite(e.target.value)}
          />
        </div>

        {/* Socials */}
        <div className="mt-4 space-y-3">
          <span className="text-base font-semibold text-[var(--brand-ink)]">
            Socials
          </span>
          <IconLink
            platform="facebook"
            placeholder="Enter Facebook URL"
            value={facebook}
            onChange={(e: any) => setFacebook(e.target.value)}
          />
          <IconLink
            platform="instagram"
            placeholder="Enter Instagram URL"
            value={instagram}
            onChange={(e: any) => setInstagram(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-between mt-6">
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={() => router.push("/become-seller")}
          >
            ← Previous
          </Button>

          <Button variant="primary" onClick={handleSeller} disabled={isLoading}>
            {isLoading ? "Loading..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
