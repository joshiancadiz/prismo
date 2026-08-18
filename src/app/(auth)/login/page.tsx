'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Chrome, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setErrorMsg(null)
      const supabase = createClient()

      const origin = typeof window !== 'undefined' ? window.location.origin : ''

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      })

      if (error) {
        setErrorMsg(error.message)
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred')
    } finally {
      // Don't set isLoading to false if successful, as we are redirecting away
      // but in case of error, we can enable the button again
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative font-sans">
      {/* Background Decorative Gradients Container (prevents overflow scrollbars) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Main Login Content Area (fills 100% of viewport) */}
      <div className="min-h-screen flex items-center justify-center w-full p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo/Brand Area */}
          <div className="flex flex-col items-center mb-10 text-center">
            <img
              src="/prismo-logo.svg"
              alt="Prismo Logo"
              className="w-28 h-28 md:w-40 md:h-40 mb-6"
            />
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
              Welcome to <span className="bg-clip-text text-transparent bg-linear-to-r from-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-600">Prismo AI</span>
            </h1>
          </div>

          {/* Login Card */}
          <div className="bg-card backdrop-blur-xl border border-border p-6 md:p-8 rounded-3xl shadow-2xl">
            <div className="flex flex-col space-y-6">

              <div className="space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="cursor-pointer group relative w-full flex items-center justify-center space-x-3 bg-foreground text-background py-3.5 px-4 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-background/40 border-t-background rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Chrome className="w-5 h-5 text-[#4285F4]" />
                      <span>Continue with Google</span>
                    </>
                  )}
                  {/* Subtle outer glow effect on hover */}
                  <div className="absolute inset-0 rounded-xl ring-2 ring-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
                  {errorMsg}
                </div>
              )}

              <div className="mt-8 text-center">
                <p className="text-sm text-muted">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-4">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-4">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
