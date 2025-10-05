import { PageContainer } from "@/components/common/page-container"
import { PageHeader } from "@/components/common/page-header"
import { Button } from "@/components/common/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function PostAdSuccessPage() {
  return (
    <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center">
      <PageHeader title="Post Your Ad" className="mb-8" />
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle2 className="h-20 w-20 text-green-500" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Your ad is posted successfully !!</h2>
        <p className="text-sm text-muted-foreground">Thank you for posting with us.</p>
        <div className="mt-2 flex gap-2">
          <Button  variant="primary" className="rounded-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}
