"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { BackLink } from "@/components/common/back-link";
import { Badge } from "@/components/common/badge";
import { DeleteAdButton } from "@/components/edit-ad/delete-ad-dialog";
import { EditExploreInfoForm } from "@/components/edit-ad/edit-explore-info-form";
import { useSelector } from "react-redux";

function Content() {
  const params = useSearchParams();
  const router = useRouter();
  // const status = (params.get("status") ?? "active").toLowerCase()
  const { Ad } = useSelector((state: any) => state.ad);
  const myAd = useMemo(() => {
    const adLocalStorage = localStorage.getItem("myAd");
    const parsedLocalAd = adLocalStorage ? JSON.parse(adLocalStorage) : null;

    return Ad && Object.keys(Ad).length > 0 ? Ad : parsedLocalAd;
  }, [Ad]); // only re-run when Redux 'Ad' changes
  console.log(Ad, "myad");
  return (
    <>
      <BackLink className="mb-2" />
      <PageHeader
        title="Edit Ad"
        actions={<DeleteAdButton adId={myAd._id} />}
        className="items-start"
      />
      {/* {status === "active" ? (
        <Badge className="mb-6 rounded-full bg-green-500 text-white hover:bg-green-500">
          Active
        </Badge>
      ) : (
        <Badge
          variant="secondary"
          className="mb-6 rounded-full bg-destructive/10 text-destructive"
        >
          Rejected
        </Badge>
      )} */}

      <EditExploreInfoForm
      // onChangeType={() => router.push("/edit-ad")}
      // onContinue={() => router.push("/edit-ad/explore/store")}
      />
    </>
  );
}

export default function EditAdExplorePage() {
  return (
    <PageContainer>
      <Suspense>
        <Content />
      </Suspense>
    </PageContainer>
  );
}
