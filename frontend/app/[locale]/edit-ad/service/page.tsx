"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageContainer } from "@/components/common/page-container"
import { PageHeader } from "@/components/common/page-header"
import { BackLink } from "@/components/common/back-link"
import { Badge } from "@/components/common/badge"
import { DeleteAdButton } from "@/components/edit-ad/delete-ad-dialog"
import { EditServiceInfoForm } from "@/components/edit-ad/edit-service-info-form"

function Content() {
  const params = useSearchParams()
  const router = useRouter()
  const status = (params.get("status") ?? "active").toLowerCase()

  return (
    <>
      <BackLink className="mb-2" />
      <PageHeader title="Edit Ad" actions={<DeleteAdButton />} className="items-start" />
      {status === "active" ? (
        <Badge className="mb-6 rounded-full bg-green-500 text-white hover:bg-green-500">Active</Badge>
      ) : (
        <Badge variant="secondary" className="mb-6 rounded-full bg-destructive/10 text-destructive">
          Rejected
        </Badge>
      )}

      <EditServiceInfoForm
        onChangeType={() => router.push("/edit-ad")}
        onContinue={() => router.push("/post-ad/billing")}
      />
    </>
  )
}

export default function EditAdServicePage() {
  return (
    <PageContainer>
      <Suspense>
        <Content />
      </Suspense>
    </PageContainer>
  )
}
