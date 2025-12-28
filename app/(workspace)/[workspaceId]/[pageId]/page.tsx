"use client";

import { useParams } from "next/navigation";
import { PageContent } from "@/components/views/page-content";

export default function PageViewRoute() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const pageId = params.pageId as string;

  return <PageContent workspaceId={workspaceId} pageId={pageId} />;
}
