import { useEffect, useState } from 'react'

import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { signInWithPopup, signOut } from 'firebase/auth'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { auth, googleProvider, waitForAuthReady } from '#/firebase'
import { useLoginWithGoogle } from '#/hooks/api/useAuth'
import { toast } from 'sonner'

function sanitizeRedirect(url: unknown): string {
  if (typeof url !== 'string' || !url.startsWith('/') || url.startsWith('//')) {
    return '/'
  }
  return url
}

export const Route = createFileRoute('/login')({
  validateSearch: (search) => ({
    redirect: sanitizeRedirect(search.redirect),
  }),
  beforeLoad: async () => {
    const user = await waitForAuthReady()
    if (user) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const loginWithGoogle = useLoginWithGoogle()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    void waitForAuthReady().then((user) => {
      if (active && user) {
        void navigate({ to: '/' })
      }
    })

    return () => {
      active = false
    }
  }, [navigate])

  const handleGoogleLogin = async () => {
    setErrorMessage(null)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      await loginWithGoogle.mutateAsync(idToken)
      await navigate({ to: '/' })
      toast.success('Đăng nhập thành công!')
    } catch (error) {
      if (auth.currentUser) {
        await signOut(auth)
      }

      const message =
        error instanceof Error
          ? error.message
          : 'Không thể đăng nhập bằng Google.'
      setErrorMessage(message)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(79,184,178,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(47,106,74,0.16),transparent_34%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(79,184,178,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(47,106,74,0.16),transparent_34%)]" />
      <Card>
        <CardHeader className="text-center">
          <p>Chào mừng bạn quay lại</p>
          <CardTitle className="display-title text-3xl font-bold tracking-tight">
            Đăng nhập vào Edumate
          </CardTitle>
          <CardDescription className="mx-auto max-w-sm text-sm leading-6">
            Tiếp tục với tài khoản Google của bạn để truy cập hệ thống.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 py-4">
          <Button
            type="button"
            size="lg"
            onClick={handleGoogleLogin}
            disabled={loginWithGoogle.isPending}
            className="cursor-pointer w-full"
          >
            <GoogleIcon />
            {loginWithGoogle.isPending
              ? 'Đang đăng nhập...'
              : 'Tiếp tục với Google'}
          </Button>

          {errorMessage ? (
            <p
              className="mt-4 text-center text-sm text-destructive"
              aria-live="polite"
            >
              {errorMessage}
            </p>
          ) : null}

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Bằng cách tiếp tục, bạn đồng ý đăng nhập bằng Google.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        d="M21.805 10.023H12v3.955h5.613c-.242 1.272-.967 2.35-2.058 3.073v2.552h3.332c1.95-1.794 3.068-4.44 3.068-7.603 0-.66-.06-1.294-.15-1.977Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.79 0 5.13-.925 6.84-2.497l-3.332-2.552c-.925.62-2.105.988-3.508.988-2.7 0-4.987-1.823-5.804-4.275H2.75v2.632A9.997 9.997 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.196 13.664A5.996 5.996 0 0 1 5.87 11.75c0-.665.114-1.311.326-1.914V7.204H2.75A9.997 9.997 0 0 0 2 11.75c0 1.61.386 3.136 1.07 4.546l3.126-2.632Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.561c1.517 0 2.88.522 3.954 1.547l2.964-2.964C17.125 2.477 14.786 1.5 12 1.5A9.997 9.997 0 0 0 3.07 7.204l3.126 2.632C7.013 7.384 9.3 5.561 12 5.561Z"
        fill="#EA4335"
      />
    </svg>
  )
}
