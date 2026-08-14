"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { registerClient } from "../services/authService";
import axios from "axios";
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("REGISTER PAYLOAD:", {
        fullName: name,
        email,
        password,
      });
      await registerClient({
        fullName: name,
        email,
        password,
      });

      router.push(`/register/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Registration failed. Please try again.",
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Blurred UI Backdrop (Dummy Background Layout) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none filter blur-md opacity-40 flex flex-col"
      >
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 lg:pl-64 p-8 space-y-6">
            <div className="h-8 w-1/3 bg-surface rounded" />
            <div className="h-4 w-2/3 bg-surface rounded" />
            <div className="h-4 w-1/2 bg-surface rounded" />
            <div className="h-32 w-full bg-surface rounded" />
          </main>
        </div>
      </div>

      {/* Overlay Backdrop Blur & Dimming */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-10" />

      {/* Main Registration Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Back to Docs Link */}
        <Link
          href="/docs"
          className="absolute top-6 left-6 flex items-center gap-2 text-xs text-text-secondary hover:text-text transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to documentation</span>
        </Link>

        {/* Registration Card */}
        <div className="w-full max-w-md bg-surface/90 backdrop-blur-xl border border-border/80 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-1 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-text tracking-tight">
              Create an Account
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              Register to get access to documentation resources
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-danger/10 border border-danger/30 text-danger text-sm">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User
                  size={16}
                  className="absolute left-3 text-text-secondary shrink-0"
                />
                <input
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-background/60 border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
            </div>

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
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-background/60 border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock
                  size={16}
                  className="absolute left-3 text-text-secondary shrink-0"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-sm rounded-md bg-background/60 border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 text-text-secondary hover:text-text transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Lock
                  size={16}
                  className="absolute left-3 text-text-secondary shrink-0"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-sm rounded-md bg-background/60 border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 text-text-secondary hover:text-text transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
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
              className="w-full py-2.5 px-4 text-sm font-medium rounded-md bg-primary text-primary-text hover:bg-primary-active transition-colors shadow-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-border">
            <p className="text-xs text-text-secondary">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-text font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
