"use client"

import { PageContainer } from "@/components/common/page-container"
import { PageHeader } from "@/components/common/page-header"
import { ProductInfoForm } from "@/components/post-ad/product-info-form"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { BackLink } from "@/components/common/back-link"

// Wrap to read query in an RSC-friendly way
function Content() {
  // type might be passed from previous step; we just show its label if present
  const params = useSearchParams()
  const type = params.get("type") ?? "Product"

  return (
    <>
      <BackLink className="mb-2" />
      <PageHeader title="Post Your Ad" subtitle="Product Information" />
      <ProductInfoForm typeLabel={type} onChangeType={() => history.back()} />
    </>
  )
}

export default function ProductInfoPage() {
  return (
    <PageContainer>
      <Suspense>
        <Content />
      </Suspense>
    </PageContainer>
  )
}
