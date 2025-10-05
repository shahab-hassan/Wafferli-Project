"use client"

import { PageContainer } from "@/components/common/page-container"
import { PageHeader } from "@/components/common/page-header"
import { OfferInfoForm } from "@/components/post-ad/offer-info-form"
import { Suspense } from "react"
import { BackLink } from "@/components/common/back-link"

function Content() {
  return (
    <>
      <BackLink className="mb-2" />
      <PageHeader title="Post Your Ad" />
      <OfferInfoForm onChangeType={() => history.back()} />
    </>
  )
}

export default function OfferPage() {
  return (
    <PageContainer>
      <Suspense>
        <Content />
      </Suspense>
    </PageContainer>
  )
}
