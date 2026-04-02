import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace')({
  component: WorkspaceRoute,
})

function WorkspaceRoute() {
  return <Navigate to="/" />
}
