import { Room } from "@/features/workflows/components/room";
import { WorkflowShell } from "@/features/workflows/components/workflow-shell"
import { WorkflowRunsProvider } from "@/features/workflows/components/workflow-runs-provider"
import { getWorkflow } from "@/features/workflows/data";
import { auth } from "@clerk/nextjs/server";
import { auth as triggerAuth } from "@trigger.dev/sdk"
import { notFound } from "next/navigation";
import { ReactFlowProvider } from "@xyflow/react";
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
    organizationId:orgId,
    defaultAccesses: [],
    groupsAccesses: { [orgId]: ["room:write"] },
    metadata: { title: workflow.name },
  })

  // A read-only token scoped to this workflow's run tag, so the client can
  // subscribe to its runs in realtime. Good for ~an hour of an open canvas.
  const runsToken = await triggerAuth.createPublicToken({
    scopes: {
      read: {
        tags: [`workflow:${id}`],
      },
    },
    expirationTime: "1hr",
  })

  return (
    <Room roomId={id}>
      {/* Canvas and the sidebar palette are separate components; one provider
          above both gives them a single shared React Flow store. */}
      <ReactFlowProvider>
        <WorkflowRunsProvider workflowId={id} accessToken={runsToken}>
          <WorkflowShell workflowId={id} />
        </WorkflowRunsProvider>
      </ReactFlowProvider>
    </Room>
  );
}
