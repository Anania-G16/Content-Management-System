"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { resetPassword } from "@/app/services/authService";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      console.log("RESET TOKEN:", token);
      await resetPassword({
        token: token!,
        newPassword: password,
      });

      setSuccess(true);
    } catch (err: unknown) {
      console.error("Reset Password Error:", err);
      setError("Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-md bg-surface/90 backdrop-blur-xl border border-border/80 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Missing or Invalid Token State */}
        {!token ? (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-text tracking-tight">
                Invalid Reset Link
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary">
                This password reset link is missing required parameters or is
                invalid. Please request a new link.
              </p>
            </div>

            <div className="p-3 rounded-md bg-danger/10 border border-danger/30 text-danger text-xs sm:text-sm flex items-center justify-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>Token is missing or invalid</span>
            </div>

            <div className="pt-2 border-t border-border">
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 text-sm font-medium rounded-md bg-primary text-primary-text hover:bg-primary-active transition-colors shadow-sm"
              >
                Request New Reset Link
              </Link>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-1 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-text tracking-tight">
                Reset Password
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary">
                Enter and confirm your new password below
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
                  Your password has been successfully reset. You can now sign in
                  with your new password.
                </span>
              </div>
            )}

            {/* Form or Success Redirect CTA */}
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="new-password"
                    className="block text-xs font-medium text-text"
                  >
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock
                      size={16}
                      className="absolute left-3 text-text-secondary shrink-0"
                    />
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-9 pr-10 py-2 text-sm rounded-md bg-background/60 border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 text-text-secondary hover:text-text transition-colors"
                      aria-label={
                        showPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="confirm-password"
                    className="block text-xs font-medium text-text"
                  >
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock
                      size={16}
                      className="absolute left-3 text-text-secondary shrink-0"
                    />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-9 pr-10 py-2 text-sm rounded-md bg-background/60 border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 text-text-secondary hover:text-text transition-colors"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 text-sm font-medium rounded-md bg-primary text-primary-text hover:bg-primary-active transition-colors shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 text-sm font-medium rounded-md bg-primary text-primary-text hover:bg-primary-active transition-colors shadow-sm mt-2"
              >
                Sign In Now
              </Link>
            )}

            {/* Footer Link */}
            {!success && (
              <div className="text-center pt-2 border-t border-border">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}