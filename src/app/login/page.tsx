"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, X } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface LoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function LoginModal({
  isOpen = true,
  onClose,
}: LoginModalProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      console.log("Login successful:", response.data);
      localStorage.setItem("accessToken", response.data.accessToken);
      if (response.data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/docs");
      }
    } catch (error) {
      console.error("Login failed:", error);

      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent Blurred Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-all animate-in fade-in duration-200"
      />

      {/* Login Card Modal */}
      <div className="relative w-full max-w-md bg-surface/90 backdrop-blur-xl border border-border/80 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-md text-text-secondary hover:text-text hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        )}

        <div className="space-y-1 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-text tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Sign in to access restricted documentation
          </p>
        </div>
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
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-background/60 border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-text">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-text-secondary hover:text-text transition-colors"
              >
                Forgot password?
              </Link>
            </div>
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

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-sm font-medium rounded-md bg-primary text-primary-text hover:bg-primary-active transition-colors shadow-sm mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border">
          <p className="text-xs text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-text font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
