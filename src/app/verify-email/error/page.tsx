import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function VerifyEmailErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 text-text">
      <div className="w-full max-w-md bg-surface border border-border rounded-lg p-6 sm:p-8 shadow-lg text-center">
        {/* Error Icon Container */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <AlertCircle size={32} />
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-text">
          Verification failed
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          This verification link is invalid or has expired.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/register/verify-email"
            className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 px-4 text-sm font-semibold text-background shadow-sm hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full rounded-md py-2.5 px-4 text-sm font-medium text-text-secondary hover:text-text transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}