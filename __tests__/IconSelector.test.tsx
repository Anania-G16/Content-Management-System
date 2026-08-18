import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IconSelector, { AVAILABLE_ICONS } from "@/components/IconSelector";

describe("IconSelector", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all available icons with their labels", () => {
    render(<IconSelector selectedIcon={null} onSelect={mockOnSelect} />);

    AVAILABLE_ICONS.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(AVAILABLE_ICONS.length);
  });

  test("applies selected styling to the active icon button", () => {
    const selectedId = "Code2";
    render(<IconSelector selectedIcon={selectedId} onSelect={mockOnSelect} />);

    const selectedButton = screen.getByText("Code").closest("button");
    const unselectedButton = screen.getByText("Book").closest("button");

    expect(selectedButton).toHaveClass("bg-primary");
    expect(unselectedButton).not.toHaveClass("bg-primary");
  });

  test("calls onSelect with the correct icon ID when clicked", async () => {
    const user = userEvent.setup();
    render(<IconSelector selectedIcon={null} onSelect={mockOnSelect} />);

    const rocketButton = screen.getByText("Rocket").closest("button")!;
    await user.click(rocketButton);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith("Rocket");
  });

  test("handles keyboard interaction via Enter key", async () => {
    const user = userEvent.setup();
    render(<IconSelector selectedIcon={null} onSelect={mockOnSelect} />);

    const settingsButton = screen.getByText("Settings").closest("button")!;
    settingsButton.focus();
    expect(settingsButton).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(mockOnSelect).toHaveBeenCalledWith("Settings");
  });
});