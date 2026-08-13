"use client";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
};

export default function Spinner({ size = "md" }: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-2",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full border-border border-t-primary animate-spin`}
      aria-label="Loading"
      role="status"
    />
  );
}