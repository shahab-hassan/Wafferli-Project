import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { PostAdForm } from "@/components/post-ad/post-ad-form";

export default function PostAdPage() {
  return (
    <PageContainer>
      <PageHeader title="Post Your Ad" />
      <PostAdForm />
    </PageContainer>
  );
}
