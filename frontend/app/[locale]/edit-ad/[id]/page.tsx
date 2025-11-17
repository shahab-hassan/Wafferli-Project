"use client";

import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { BackLink } from "@/components/common/back-link";
import { Badge } from "@/components/common/badge";
import { Alert, AlertDescription } from "@/components/common/alert";
import { DeleteAdButton } from "@/components/edit-ad/delete-ad-dialog";
import { EditGeneralInfoForm } from "@/components/edit-ad/edit-general-info-form";
import { useParams, useSearchParams } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { GetAdById } from "@/features/slicer/AdSlice";
import { useEffect } from "react";

export default function EditAdGeneralPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const adId = id || "";
  const fetchAd = async () => {
    try {
      const res = await dispatch(GetAdById(adId) as any).unwrap();
      console.log(res, "res");
      const ad = res.data.ad;
      // Save directly from response instead of store
      localStorage.setItem("myAd", JSON.stringify(ad));
    } catch (error) {
      console.error("Error fetching ad:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAd();
    }
  }, [id]);

  const { Ad } = useSelector((state: any) => state.ad);
  console.log(Ad, "myAd");

  console.log(id, "param");
  return (
    <PageContainer>
      <BackLink className="mb-2" />
      <PageHeader
        title="Edit Ad"
        subtitle=""
        className="items-start"
        actions={<DeleteAdButton adId={adId} />}
      />

      {/* <div className="mb-6">
        {status === "rejected" ? (
          <>
            <Badge variant="secondary" className="mb-3 rounded-full bg-destructive/10 text-destructive">
              Rejected
            </Badge>
            <Alert variant="destructive" className="rounded-2xl">
              <TriangleAlert className="h-5 w-5" />
              <AlertDescription>
                Images not clear, also unclear details about the product and what the customer will be receiving.
              </AlertDescription>
            </Alert>
          </>
        ) : (
          <Badge className="mb-6 rounded-full bg-green-500 text-white hover:bg-green-500">Active</Badge>
        )}
      </div> */}

      <EditGeneralInfoForm initialType={Ad.adType} />
    </PageContainer>
  );
}
