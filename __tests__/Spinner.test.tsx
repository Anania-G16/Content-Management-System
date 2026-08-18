import React from "react";
import { render, screen } from "@testing-library/react";
import Spinner from "@/components/Spinner";

describe("Spinner Component", () => {
  test("renders with accessible role and label", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status", { name: /loading/i });
    expect(spinner).toBeInTheDocument();
  });

  test("applies default 'md' size classes when no size prop is provided", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-6", "w-6", "border-2");
  });

  test("applies correct classes for 'sm' size prop", () => {
    render(<Spinner size="sm" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-4", "w-4", "border-2");
    expect(spinner).not.toHaveClass("h-6", "w-6");
  });

  test("applies correct classes for 'lg' size prop", () => {
    render(<Spinner size="lg" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-8", "w-8", "border-2");
    expect(spinner).not.toHaveClass("h-6", "w-6");
  });

  test("includes required animation and border styling classes", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass(
      "rounded-full",
      "border-border",
      "border-t-primary",
      "animate-spin"
    );
  });
});