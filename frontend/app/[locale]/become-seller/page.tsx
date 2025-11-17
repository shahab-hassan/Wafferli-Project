// app/[locale]/become-seller/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BusinessTypeToggle } from "@/components/seller/segmented-conteol";
import { UploadDropzone } from "@/components/seller/upload-dropzone";
import { StepFooter } from "@/components/seller/step-input";
import { TextCounter } from "@/components/seller/text-counter";
import { IconLink } from "@/components/seller/social-input";
import { Input } from "@/components/common/input";
import { SellerHero } from "@/components/seller/hero-panel";
import { ComboSelect } from "@/components/seller/combo-select";
import { useDispatch, useSelector } from "react-redux";
import { CreateSeller, setSellerData } from "@/features/slicer/SellerSlice";
import { Button } from "@/components/common/button";
import { setRole } from "@/features/slicer/AuthSlice";
import toast from "react-hot-toast";
import LocationFields from "@/components/post-ad/location-field";

export default function Step1() {
  const router = useRouter();
  const { sellerData } = useSelector((state: any) => state.seller);
  const data = sellerData;

  const [name, setName] = useState(data.name || "");
  const [desc, setDesc] = useState(data.description || "");
  const [type, setType] = useState<"individual" | "business">(
    data.businessType || "business"
  );
  const [logo, setLogo] = useState<File | null>(data.logo || null);
  const [city, setCity] = useState<string>(data.city || "");
  const [neighborhood, setNeighborhood] = useState<string>(
    data.neighborhood || ""
  );
  const [category, setCategory] = useState(data.category || "");
  const [facebook, setFacebook] = useState(data.facebook || "");
  const [instagram, setInstagram] = useState(data.instagram || "");
  const [isLoading, setIsloading] = useState(false);
  const [website, setWebsite] = useState(data.website || "");

  const dispatch = useDispatch();

  // Individual seller ke liye handler
  const handleSeller = async () => {
    const socialLinks = {
      facebook: facebook.trim(),
      instagram: instagram.trim(),
    };

    const formData = new FormData();
    formData.append("businessType", type);
    formData.append("city", city);
    formData.append("neighbourhood", neighborhood);
    formData.append("category", "category");
    formData.append("website", website);
    formData.append("socialLinks", JSON.stringify(socialLinks));

    try {
      setIsloading(true);
      const res = await dispatch(CreateSeller(formData) as any).unwrap();
      if (res.success) {
        const role = res.data.user.role;
        await dispatch(setRole(role) as any);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setIsloading(false);
    } finally {
      setIsloading(false);
    }
  };

  // Next button handler - data save karega Redux mein
  const handleNext = () => {
    if (!type?.trim()) {
      toast.error("Please select a business type first");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter the business name");
      return;
    }

    if (!desc.trim()) {
      toast.error("Please enter the business description");
      return;
    }

    // if (!logo.trim()) {
    //   toast.error("Please upload a logo for your business");
    //   return;
    // }

    if (!city.trim()) {
      toast.error("Please select a city for your business");
      return;
    }
    if (!neighborhood.trim()) {
      toast.error("Please select a neighborhood for your business");
      return;
    }

    const sellerData = {
      businessType: type,
      name,
      description: desc,
      logo, // File object directly store karenge
      city,
      neighborhood,
      category,
      facebook,
      instagram,
    };

    dispatch(setSellerData(sellerData));
    router.push("/become-seller/business-details");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1220px] w-full mx-auto mt-10 mb-10 px-4">
      <div>
        <SellerHero />
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--brand-ink)]">
            Business Type
          </h2>
          <div className="sr-only" aria-live="polite">
            {type}
          </div>
        </div>

        <BusinessTypeToggle
          value={type}
          onChange={(v) => setType(v)}
          leftLabel="Individual"
          rightLabel="Business"
        />

        {type == "business" && (
          <>
            <div className="space-y-4 mt-6">
              <label className="block text-sm font-medium text-[var(--brand-ink)]">
                Name*
                <Input
                  placeholder="Enter your Store Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </label>

              <label className="block text-sm font-medium text-[var(--brand-ink)]">
                Description*
                <TextCounter value={desc} max={512} className="mt-1">
                  <textarea
                    className="h-28 w-full resize-none rounded-[var(--radius-lg)] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-3 text-[var(--brand-ink)] placeholder:text-[color-mix(in oklab, var(--brand-ink) 35%, white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in oklab, var(--brand-primary) 40%, white)]"
                    placeholder="Enter the description of your business"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    maxLength={512}
                  />
                </TextCounter>
              </label>

              <div>
                <span className="text-base font-semibold text-[var(--brand-ink)]">
                  Location*
                </span>
                <div className="flex flex-col gap-3 md:flex-row mt-2">
                  <LocationFields
                    value={{
                      city: city,
                      neighborhood: neighborhood,
                    }}
                    onChange={(next) => {
                      setCity(next.city || "");
                      setNeighborhood(next.neighborhood || "");
                    }}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="mt-2">
                <span className="text-sm font-medium text-[var(--brand-ink)]">
                  Logo
                </span>
                <UploadDropzone
                  type="logo"
                  file={logo || ""} // current state
                  onFiles={(files) => {
                    const file = files[0] || null;
                    setLogo(file); // update local state
                    dispatch(
                      setSellerData({
                        logo: file, // Redux me bhi File object
                      })
                    );
                  }}
                  multiple={false}
                  className="mt-1"
                />
              </div>
            </div>
            <StepFooter
              onNext={handleNext}
              nextLabel="Continue"
              // showBack={false}
            />
          </>
        )}

        {type == "individual" && (
          <>
            <div className="space-y-8 mt-6">
              <div>
                <span className="text-base font-semibold text-[var(--brand-ink)]">
                  Location*
                </span>
                <div className="mt-2 flex flex-col gap-3 md:flex-row">
                  <LocationFields
                    value={{
                      city: city,
                      neighborhood: neighborhood,
                    }}
                    onChange={(next) => {
                      setCity(next.city || "");
                      setNeighborhood(next.neighborhood || "");
                    }}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* <ComboSelect
                label="Category"
                items={CATEGORIES}
                value={category}
                onChange={setCategory}
              /> */}

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

              <div className="space-y-5">
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
            </div>
            <Button
              variant={"primary"}
              className="w-full mt-6"
              onClick={handleSeller}
              disabled={isLoading || !city || !neighborhood}
            >
              {isLoading ? "Loading..." : "Continue"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
