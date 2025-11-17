"use client";
import { Button } from "@/components/common/button";
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
} from "@/components/common/alert-dialog";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { DeletedAd } from "@/features/slicer/AdSlice";
import { useState } from "react";
import { toast } from "sonner"; // optional if you're using sonner for alerts

interface DeleteAdButtonProps {
  adId: any; // ✅ pass ad ID here
  onConfirm?: () => void;
}

export function DeleteAdButton({ adId, onConfirm }: DeleteAdButtonProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await dispatch(DeletedAd(adId) as any).unwrap();
      console.log("Delete response:", res);

      if (res.success) {
        toast.success("Ad deleted successfully ✅");
        if (onConfirm) {
          onConfirm();
          router.push("/edit-ad/deleted");
        } else {
          router.push("/all-my-ads"); // ✅ redirect after delete
        }
      } else {
        toast.error(res.message || "Failed to delete ad");
      }
    } catch (error: any) {
      console.error("Error deleting ad:", error);
      toast.error("Something went wrong while deleting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="rounded-full"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete Ad"}
          {!loading && <Trash2 className="ml-2 h-4 w-4" />}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Trash2 className="h-5 w-5" />
          </div>
          <AlertDialogTitle className="text-center">
            Are you sure you want to delete this ad?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Note: This action is permanent and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="grid grid-cols-2 gap-3">
          <AlertDialogCancel className="rounded-full">No</AlertDialogCancel>
          <AlertDialogAction
            className="rounded-full bg-destructive text-white hover:bg-destructive/90"
            onClick={handleDelete}
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
