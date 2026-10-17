import { Room } from "@/features/workflows/components/room";
import { WorkflowShell } from "@/features/workflows/components/workflow-shell"
import { getWorkflow } from "@/features/workflows/data";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { liveblocks } from "@/lib/liveblocks";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const {orgId } = await auth();
  if(!orgId) notFound();

  const workflow = await getWorkflow(orgId,id)
  if (!workflow) notFound()

  // ID-token rooms are private by default. Grant write access only to the
  // owning org's group, matching `groupIds: [orgId]` from /api/liveblocks/auth.
  await liveblocks.getOrCreateRoom(id, {
    defaultAccesses: [],
    groupsAccesses: { [orgId]: ["room:write"] },
    metadata: { title: workflow.name },
  })

  return (
    <Room roomId={id}>
     <WorkflowShell workflowId={id} />
    </Room>
  );
}
