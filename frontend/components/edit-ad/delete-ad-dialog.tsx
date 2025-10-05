"use client"
import { Button } from "@/components/common/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/common/alert-dialog"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function DeleteAdButton({ onConfirm }: { onConfirm?: () => void }) {
  const router = useRouter()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="rounded-full">
          Delete Ad
          <Trash2 className="ml-2 h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Trash2 className="h-5 w-5" />
          </div>
          <AlertDialogTitle className="text-center">Are you sure you want to delete this ad?</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Note: This is a permanent action, and cannot be reversed
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid grid-cols-2 gap-3">
          <AlertDialogCancel className="rounded-full">No</AlertDialogCancel>
          <AlertDialogAction
            className="rounded-full bg-destructive text-white hover:bg-destructive/90"
            onClick={() => {
              if (onConfirm) {
                onConfirm()
              } else {
                router.push("/edit-ad/deleted")
              }
            }}
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
