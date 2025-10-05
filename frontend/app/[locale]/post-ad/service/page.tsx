"use client"

import { PageContainer } from "@/components/common/page-container"
import { PageHeader } from "@/components/common/page-header"
import { BackLink } from "@/components/common/back-link"
import { ServiceInfoForm } from "@/components/post-ad/service-info-form"
import { Suspense } from "react"

function Content() {
  return (
    <>
      <BackLink className="mb-2" />
      <PageHeader title="Post Your Ad" />
      <ServiceInfoForm onChangeType={() => history.back()} />
    </>
  )
}

export default function ServicePage() {
  return (
    <PageContainer>
      <Suspense>
        <Content />
      </Suspense>
    </PageContainer>
  )
}
