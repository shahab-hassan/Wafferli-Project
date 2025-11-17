"use client";

import { Button } from "@/components/common/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export function BackLink({ className }: { className?: string }) {
  const router = useRouter();
  const { isLoading } = useSelector((state: any) => state.ad);
  return (
    <div className={className}>
      <Button
        disabled={isLoading}
        variant="link"
        className="px-0 text-muted-foreground hover:text-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
    </div>
  );
}
