// src/routes/_authenticated.tsx
import { waitForAuthReady } from '#/firebase'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const user = await waitForAuthReady()
    if (!user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  // component defaults to Outlet — no need to declare it
})
