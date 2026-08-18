import { render, screen, fireEvent } from "@testing-library/react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
    className?: string;
  }) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
}));

const mockedUsePathname = usePathname as jest.MockedFunction<
  typeof usePathname
>;

describe("AdminSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUsePathname.mockReturnValue("/admin/dashboard");
  });

  it("renders all navigation links", () => {
    render(<AdminSidebar />);

    expect(screen.getByText("CMS Admin")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.getByText("Back to Docs")).toBeInTheDocument();
  });

  it("uses the correct hrefs for navigation links", () => {
    render(<AdminSidebar />);

    expect(screen.getByText("Dashboard").closest("a")).toHaveAttribute(
      "href",
      "/admin/dashboard",
    );

    expect(screen.getByText("Documents").closest("a")).toHaveAttribute(
      "href",
      "/admin/docs",
    );

    expect(
      screen.getByText("User Management").closest("a"),
    ).toHaveAttribute("href", "/admin/users");

    expect(screen.getByText("Back to Docs").closest("a")).toHaveAttribute(
      "href",
      "/docs",
    );
  });

  it("marks the current pathname as active", () => {
    mockedUsePathname.mockReturnValue("/admin/docs");

    render(<AdminSidebar />);

    const documentsLink = screen.getByText("Documents").closest("a");

    expect(documentsLink).toHaveClass("bg-accent/40");
    expect(documentsLink).toHaveClass("font-semibold");
  });

  it("does not mark unrelated links as active", () => {
    mockedUsePathname.mockReturnValue("/admin/docs");

    render(<AdminSidebar />);

    const dashboardLink = screen.getByText("Dashboard").closest("a");
    const usersLink = screen.getByText("User Management").closest("a");

    expect(dashboardLink).not.toHaveClass("bg-accent/40");
    expect(usersLink).not.toHaveClass("bg-accent/40");
  });

  it("opens and closes the mobile navigation", () => {
    render(<AdminSidebar />);

    const toggleButton = screen.getByRole("button", {
      name: "Toggle Navigation",
    });

    const sidebar = screen.getByRole("complementary");

    expect(sidebar).toHaveClass("-translate-x-full");

    fireEvent.click(toggleButton);

    expect(sidebar).toHaveClass("translate-x-0");
    expect(
      screen.getByRole("button", { name: "Toggle Navigation" }),
    ).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(sidebar).toHaveClass("-translate-x-full");
  });

  it("closes the mobile navigation when a navigation link is clicked", () => {
    render(<AdminSidebar />);

    const toggleButton = screen.getByRole("button", {
      name: "Toggle Navigation",
    });

    const sidebar = screen.getByRole("complementary");

    fireEvent.click(toggleButton);

    expect(sidebar).toHaveClass("translate-x-0");

    fireEvent.click(screen.getByText("Documents"));

    expect(sidebar).toHaveClass("-translate-x-full");
  });

  it("closes the mobile navigation when the backdrop is clicked", () => {
    render(<AdminSidebar />);

    const toggleButton = screen.getByRole("button", {
      name: "Toggle Navigation",
    });

    fireEvent.click(toggleButton);

    const backdrop = document.querySelector(".bg-black\\/60");

    expect(backdrop).toBeInTheDocument();

    fireEvent.click(backdrop!);

    expect(screen.getByRole("complementary")).toHaveClass(
      "-translate-x-full",
    );
  });
});