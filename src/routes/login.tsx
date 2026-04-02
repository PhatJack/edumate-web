import { useState } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { signInWithPopup } from 'firebase/auth'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { auth, googleProvider } from '#/firebase'
import { useLoginWithGoogle } from '#/hooks/api/useAuth'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const loginWithGoogle = useLoginWithGoogle()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setErrorMessage(null)

    try {
      await signInWithPopup(auth, googleProvider)
      await loginWithGoogle.mutateAsync()
      await navigate({ to: '/' })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Không thể đăng nhập bằng Google.'
      setErrorMessage(message)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(79,184,178,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(47,106,74,0.16),transparent_34%)]" />

      <Card className="island-shell rise-in w-full max-w-md border-white/60 bg-white/80 py-0 backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
        <CardHeader className="space-y-3 border-b border-border/60 px-8 py-8 text-center">
          <p className="island-kicker">Chào mừng bạn quay lại</p>
          <CardTitle className="display-title text-3xl font-bold tracking-tight">
            Đăng nhập vào Edumate
          </CardTitle>
          <CardDescription className="mx-auto max-w-sm text-sm leading-6">
            Tiếp tục với tài khoản Google của bạn để truy cập hệ thống.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 py-8">
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loginWithGoogle.isPending}
            className="h-12 w-full justify-center gap-3 rounded-xl border-border/70 bg-background/80 text-base shadow-sm hover:bg-accent/70"
          >
            <GoogleIcon />
            {loginWithGoogle.isPending ? 'Đang đăng nhập...' : 'Tiếp tục với Google'}
          </Button>

          {errorMessage ? (
            <p className="mt-4 text-center text-sm text-destructive" aria-live="polite">
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
