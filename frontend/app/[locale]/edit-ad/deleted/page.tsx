"use client"

import { PageContainer } from "@/components/common/page-container"
import { PageHeader } from "@/components/common/page-header"
import { BackLink } from "@/components/common/back-link"
import { Button } from "@/components/common/button"
import { Trash2 } from "lucide-react"
import Link from "next/link"

export default function AdDeletedPage() {
  return (
    <PageContainer>
      <BackLink className="mb-2" />
      <PageHeader title="Ad Deleted" />
      <div className="mx-auto mt-6 max-w-md rounded-2xl border bg-card p-8 text-center">
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Trash2 className="h-6 w-6" />
        </div>
        <h2 className="mb-2 text-lg font-semibold">Your ad has been deleted</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          The ad was removed successfully. You can post a new ad or return to the editor.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild className="rounded-full px-6">
            <Link href="/post-ad">Post a New Ad</Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-full px-6">
            <Link href="/edit-ad">Back to Edit</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}
