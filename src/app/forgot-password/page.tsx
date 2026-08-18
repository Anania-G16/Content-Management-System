"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { forgotPassword } from "@/app/services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (err: unknown) {
      console.error("Forgot Password Error:", err);
      setError("Failed to send reset link. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-md bg-surface/90 backdrop-blur-xl border border-border/80 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="space-y-1 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-text tracking-tight">
            Forgot Password?
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Enter your email address to receive password reset instructions
          </p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-3 rounded-md bg-danger/10 border border-danger/30 text-danger text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm flex items-start gap-2">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>
              If an account exists for{" "}
              <strong className="font-semibold text-text">{email}</strong>, a
              reset link has been sent. Please check your inbox.
            </span>
          </div>
        )}

        {/* Form or Resend State */}
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail
                  size={16}
                  className="absolute left-3 text-text-secondary shrink-0"
                />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-background/60 border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-sm font-medium rounded-md bg-primary text-primary-text hover:bg-primary-active transition-colors shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setEmail("");
            }}
            className="w-full py-2.5 px-4 text-sm font-medium rounded-md bg-background/60 border border-border text-text hover:bg-background transition-colors"
          >
            Send to a different email
          </button>
        )}

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-border">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}