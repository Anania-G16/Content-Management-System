"use client";

import Link from "next/link";
import { Mail, RefreshCw, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl p-6 sm:p-8 text-center">
        {/* Email Icon Container */}
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail size={24} />
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-text">
          Check your email
        </h1>

        <p className="text-sm text-text-secondary mb-3">
          We&apos;ve sent a verification link to your email address.
        </p>

        {/* Displayed Email Address */}
        <div className="my-4 inline-block rounded-md bg-background/50 border border-border px-3 py-1.5 font-mono text-sm font-semibold text-text">
          {email || "your email address"}
        </div>

        <p className="text-sm text-text-secondary mb-6">
          Click the link in the email to verify your account and continue.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 px-4 text-sm font-semibold text-text shadow-sm hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={16} />
            <span>Resend verification email</span>
          </button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full rounded-md py-2.5 px-4 text-sm font-medium text-text-secondary hover:text-text transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </Link>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-xs text-text-secondary border-t border-border pt-4">
          Didn&apos;t receive the email? Check your spam or junk folder.
        </p>
      </div>
    </div>
  );
}