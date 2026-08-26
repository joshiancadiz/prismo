'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Chrome, Sparkles } from 'lucide-react'
import Image from 'next/image'
import dashboard from '../../../../public/dashboard.webp';

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
        <div className="absolute top-[-5%] right-[-5%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse"></div>
      </div>

      {/* Main Content: Split Layout */}
      <div className="min-h-screen flex items-center w-full relative z-10 overflow-hidden">

        {/* Left Side: Full-height Glass Panel (approx 40% width on desktop) */}
        <div className="w-full lg:w-[40%] min-h-screen flex flex-col items-center justify-center p-8 bg-white/[0.02] backdrop-blur-3xl border-r border-white/10 shadow-[8px_0_40px_rgba(0,0,0,0.25)] relative z-20">
          <div className="w-full max-w-sm flex flex-col justify-center min-h-[450px]">
            {/* Logo/Brand Area */}
            <div className="flex flex-col items-center mb-8 text-center">
              <img
                src="/prismo-logo.svg"
                alt="Prismo Logo"
                className="w-20 h-20 md:w-24 md:h-24 mb-4"
              />
              <h1 className="text-xl md:text-3xl font-extrabold tracking-tight mb-1">
                Welcome to <span className="bg-clip-text text-transparent bg-linear-to-r from-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-600">Prismo AI</span>
              </h1>
              <p className="text-sm text-muted mt-2">
                Sign in to continue to your dashboard
              </p>
            </div>

            {/* Login Box */}
            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="cursor-pointer group relative w-full flex items-center justify-center space-x-3 bg-foreground text-background py-3.5 px-4 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-md"
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
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
                {errorMsg}
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-xs text-muted leading-relaxed">
                By signing in, you agree to our{' '}
                <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-4">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-4">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Dashboard Preview (occupies 60% width) */}
        <div className="hidden lg:flex flex-col justify-center w-[60%] h-screen relative pl-12 z-10">
          <div className="mb-6 max-w-lg z-20">
            <h2 className="text-2xl xl:text-3xl font-bold text-foreground/90 tracking-tight leading-tight">
              Extract and transform YouTube scripts with <span className="bg-clip-text text-transparent bg-linear-to-r from-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-600">Prismo AI</span>
            </h2>
          </div>
          <div className="relative w-full">
            <Image
              src={dashboard}
              alt="Prismo Dashboard Preview"
              width={1920}
              height={1080}
              priority
              className="w-[100%] xl:w-[110%] 2xl:w-[130%] h-auto max-w-none rounded-l-2xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.4)] transition-all duration-300"
            />
          </div>
        </div>

      </div>

    </div>
  )
}
