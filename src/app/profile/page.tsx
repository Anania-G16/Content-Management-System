"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { changePassword } from "../services/authService";
import { toast } from "react-toastify";
import axios from "axios";
import {
  User,
  Mail,
  Shield,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  BookOpen,
} from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Personal Information State
  const [fullName, setFullName] = useState("");

  // Sync initial user state once authenticated user object loads
  useEffect(() => {
    if (user?.fullName) {
      setFullName(user.fullName);
    }
  }, [user?.fullName]);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Password Visibility Toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Validation & Interaction State
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [touched, setTouched] = useState<{
    currentPassword?: boolean;
    newPassword?: boolean;
    confirmPassword?: boolean;
  }>({});

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background p-4">
        <div className="flex items-center gap-3 text-text-secondary text-sm">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background p-4 text-text">
        <div className="max-w-md w-full bg-surface border border-border rounded-lg p-6 sm:p-8 text-center shadow-lg">
          <h1 className="text-xl font-bold mb-2 text-text">Access Denied</h1>
          <p className="text-sm text-text-secondary mb-6">
            You must be signed in to view your profile settings.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-sm font-semibold text-background hover:opacity-90 transition-opacity"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : "U";

  // Safely format dates with fallback strings if the backend hasn't supplied them yet
  const createdAtFormatted = (user as { createdAt?: string }).createdAt
    ? new Date((user as { createdAt?: string }).createdAt!).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : "N/A";

  const updatedAtFormatted = (user as { updatedAt?: string }).updatedAt
    ? new Date((user as { updatedAt?: string }).updatedAt!).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : "N/A";

  // Client-side Validation Logic
  const validate = (current: string, newPass: string, confirmPass: string) => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!current) {
      newErrors.currentPassword = "Current password is required.";
    }

    if (!newPass) {
      newErrors.newPassword = "New password is required.";
    } else if (newPass.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long.";
    }

    if (!confirmPass) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (newPass && confirmPass !== newPass) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleBlur = (
    field: "currentPassword" | "newPassword" | "confirmPassword",
  ) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(currentPassword, newPassword, confirmPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    const validationErrors = validate(
      currentPassword,
      newPassword,
      confirmPassword,
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success("Password changed successfully.");
    } catch (error: unknown) {
      console.error("Failed to change password:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Failed to change password. Please try again.",
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSavePersonalInfo = () => {
    // Client-only handler placeholder without endpoint invocation
    // TODO: Connect to backend update profile API endpoint once available
    console.log("Updated Full Name locally (Backend pending):", fullName);
  };

  const isNameChanged =
    fullName.trim() !== (user.fullName || "") && fullName.trim().length > 0;

  const isFormInvalid =
    !currentPassword ||
    !newPassword ||
    !confirmPassword ||
    Object.keys(validate(currentPassword, newPassword, confirmPassword))
      .length > 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background text-text px-6 sm:px-8 lg:px-10 py-6">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Minimal YGS Docs Brand Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <Link
            href="/docs"
            className="flex items-center gap-2 text-text hover:opacity-90 transition-opacity focus:outline-none focus:ring-1 focus:ring-primary/50 rounded-md py-1 px-1.5 -ml-1.5"
          >
            <div className="p-1.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              <BookOpen size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight text-text">
              YGS <span className="text-primary">Docs</span>
            </span>
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-surface border border-border rounded-lg p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-2xl font-bold text-text shrink-0">
            {initial}
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-text">
                {user.fullName}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                  {user.role}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border ${
                    user.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <p className="text-sm text-text-secondary flex items-center justify-center sm:justify-start gap-1.5">
              <Mail size={14} className="shrink-0" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-semibold text-text flex items-center gap-2">
              <User size={18} className="text-primary" />
              <span>Personal Information</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md bg-background border border-border text-text focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 text-sm rounded-md bg-background/50 border border-border/60 text-text-secondary cursor-not-allowed select-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Role
              </label>
              <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-background/50 border border-border/60 text-text-secondary">
                <Shield size={15} className="shrink-0" />
                <span>{user.role}</span>
              </div>
            </div>

            {/* Email Verification Status */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Email Verification
              </label>
              <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-background/50 border border-border/60">
                {user.isEmailVerified ? (
                  <>
                    <CheckCircle2
                      size={15}
                      className="text-emerald-500 shrink-0"
                    />
                    <span className="text-emerald-400 font-medium">
                      Verified
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle size={15} className="text-rose-500 shrink-0" />
                    <span className="text-rose-400 font-medium">
                      Unverified
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Account Status
              </label>
              <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-background/50 border border-border/60">
                {user.isActive ? (
                  <>
                    <CheckCircle2
                      size={15}
                      className="text-emerald-500 shrink-0"
                    />
                    <span className="text-emerald-400 font-medium">Active</span>
                  </>
                ) : (
                  <>
                    <XCircle size={15} className="text-rose-500 shrink-0" />
                    <span className="text-rose-400 font-medium">Inactive</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={handleSavePersonalInfo}
              disabled={!isNameChanged}
              className="rounded-md bg-primary py-2 px-4 text-sm font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Security / Password Change Section */}
        <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="text-base font-semibold text-text flex items-center gap-2">
              <Lock size={18} className="text-primary" />
              <span>Security</span>
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md pt-1"
            noValidate
          >
            {/* Current Password */}
            <div>
              <label
                htmlFor="current-password"
                className="block text-xs font-medium text-text-secondary mb-1.5"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (touched.currentPassword) {
                      setErrors(
                        validate(e.target.value, newPassword, confirmPassword),
                      );
                    }
                  }}
                  onBlur={() => handleBlur("currentPassword")}
                  placeholder="••••••••"
                  className={`w-full pl-3 pr-10 py-2 text-sm rounded-md bg-background border text-text focus:outline-none focus:ring-1 transition-colors ${
                    touched.currentPassword && errors.currentPassword
                      ? "border-rose-500/80 focus:ring-rose-500/50"
                      : "border-border focus:ring-primary/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={
                    showCurrentPassword
                      ? "Hide current password"
                      : "Show current password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text focus:outline-none transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {touched.currentPassword && errors.currentPassword && (
                <p className="flex items-center gap-1.5 mt-1 text-xs text-rose-400">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{errors.currentPassword}</span>
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="block text-xs font-medium text-text-secondary mb-1.5"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (touched.newPassword) {
                      setErrors(
                        validate(
                          currentPassword,
                          e.target.value,
                          confirmPassword,
                        ),
                      );
                    }
                  }}
                  onBlur={() => handleBlur("newPassword")}
                  placeholder="••••••••"
                  className={`w-full pl-3 pr-10 py-2 text-sm rounded-md bg-background border text-text focus:outline-none focus:ring-1 transition-colors ${
                    touched.newPassword && errors.newPassword
                      ? "border-rose-500/80 focus:ring-rose-500/50"
                      : "border-border focus:ring-primary/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text focus:outline-none transition-colors"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.newPassword && errors.newPassword && (
                <p className="flex items-center gap-1.5 mt-1 text-xs text-rose-400">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{errors.newPassword}</span>
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-xs font-medium text-text-secondary mb-1.5"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (touched.confirmPassword) {
                      setErrors(
                        validate(currentPassword, newPassword, e.target.value),
                      );
                    }
                  }}
                  onBlur={() => handleBlur("confirmPassword")}
                  placeholder="••••••••"
                  className={`w-full pl-3 pr-10 py-2 text-sm rounded-md bg-background border text-text focus:outline-none focus:ring-1 transition-colors ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-rose-500/80 focus:ring-rose-500/50"
                      : "border-border focus:ring-primary/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text focus:outline-none transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="flex items-center gap-1.5 mt-1 text-xs text-rose-400">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isFormInvalid || isChangingPassword}
              className="rounded-md bg-primary py-2 px-4 text-sm font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
