"use client"

import { PageContainer } from "@/components/common/page-container"
import { PageHeader } from "@/components/common/page-header"
import { BackLink } from "@/components/common/back-link"
import { EventInfoForm } from "@/components/post-ad/event-info-form"
import { Suspense } from "react"

function Content() {
  return (
    <>
      <BackLink className="mb-2" />
      <PageHeader title="Post Your Ad" />
      <EventInfoForm onChangeType={() => history.back()} />
    </>
  )
}

export default function EventPage() {
  return (
    <PageContainer>
      <Suspense>
        <Content />
      </Suspense>
    </PageContainer>
  )
}
