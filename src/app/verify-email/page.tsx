import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function VerifyEmailSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 text-text">
      <div className="w-full max-w-md bg-surface border border-border rounded-lg p-6 sm:p-8 shadow-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <CheckCircle2 size={32} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-text">
          Email verified!
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          Your email address has been successfully verified. Your account is now ready.
        </p>

        <Link
          href="/login"
          className="w-full flex items-center justify-center rounded-md bg-primary py-2.5 px-4 text-sm font-semibold text-background shadow-sm hover:opacity-90 transition-opacity"
        >
          Continue to Sign In
        </Link>
      </div>
    </div>
  );
}