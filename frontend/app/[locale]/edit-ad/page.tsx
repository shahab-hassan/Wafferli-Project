"use client"

import { PageContainer } from "@/components/common/page-container"
import { PageHeader } from "@/components/common/page-header"
import { BackLink } from "@/components/common/back-link"
import { Badge } from "@/components/common/badge"
import { Alert, AlertDescription } from "@/components/common/alert"
import { DeleteAdButton } from "@/components/edit-ad/delete-ad-dialog"
import { EditGeneralInfoForm } from "@/components/edit-ad/edit-general-info-form"
import { useSearchParams } from "next/navigation"
import { TriangleAlert } from "lucide-react"

export default function EditAdGeneralPage() {
  const params = useSearchParams()
  const status = (params.get("status") ?? "active").toLowerCase() // "active" | "rejected"

  return (
    <PageContainer>
      <BackLink className="mb-2" />
      <PageHeader title="Edit Ad" actions={<DeleteAdButton />} subtitle="" className="items-start" />
      <div className="mb-6">
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
      </div>

      <EditGeneralInfoForm initialType={null} />
    </PageContainer>
  )
}
