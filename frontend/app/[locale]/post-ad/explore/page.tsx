"use client"

import { PageContainer } from "@/components/common/page-container"
import { PageHeader } from "@/components/common/page-header"
import { BackLink } from "@/components/common/back-link"
import { ExploreInfoForm } from "@/components/post-ad/explore-info-form"
import { Suspense } from "react"

function Content() {
  return (
    <>
      <BackLink className="mb-2" />
      <PageHeader title="Post Your Ad" />
      <ExploreInfoForm onChangeType={() => history.back()} />
    </>
  )
}

export default function ExplorePage() {
  return (
    <PageContainer>
      <Suspense>
        <Content />
      </Suspense>
    </PageContainer>
  )
}
