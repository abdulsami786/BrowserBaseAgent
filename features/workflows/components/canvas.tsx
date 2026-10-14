"use client"

import { useCallback, useState, useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
  type ColorMode,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"

const initialNodes: Node[] = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
]
const initialEdges: Edge[] = [{ id: "n1-n2", source: "n1", target: "n2" }]

const emptySubscribe = () => () => {}

// false on the server and during hydration, true after mount,
// so the first client render matches the server (no hydration mismatch)
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

export function Canvas() {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()
  const colorMode: ColorMode =
    mounted && resolvedTheme === "dark" ? "dark" : "light"

  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  )
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  )

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={colorMode}
        // App theme tokens are correct before hydration (next-themes sets the
        // class on <html> early), so these colors never flash light → dark.
        style={
          {
            "--xy-background-color": "var(--background)",
            "--xy-node-background-color": "var(--card)",
            "--xy-node-color": "var(--card-foreground)",
            "--xy-node-border": "1px solid var(--border)",
            "--xy-handle-background-color": "var(--foreground)",
            "--xy-handle-border-color": "var(--background)",
            "--xy-edge-stroke": "var(--muted-foreground)",
            "--xy-edge-label-background-color": "var(--background)",
            "--xy-controls-button-background-color": "var(--popover)",
            "--xy-controls-button-background-color-hover": "var(--accent)",
            "--xy-controls-button-color": "var(--popover-foreground)",
            "--xy-controls-button-color-hover": "var(--accent-foreground)",
            "--xy-controls-button-border-color": "var(--border)",
          } as React.CSSProperties
        }
        fitView
      >
     
        <Controls />
      </ReactFlow>
    </div>
  )
}
