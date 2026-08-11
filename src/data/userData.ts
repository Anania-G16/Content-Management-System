export type UserRole = "Admin" | "User";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isDeactivated?: boolean;
  createdAt: string;
}

export const dummyUsers: User[] = [
  {
    id: "usr_1",
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    role: "Admin",
    isDeactivated: false,
    createdAt: "2026-01-15",
  },
  {
    id: "usr_2",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "User",
    isDeactivated: false,
    createdAt: "2026-02-01",
  },
  {
    id: "usr_3",
    name: "Marcus Vance",
    email: "marcus.vance@example.com",
    role: "User",
    isDeactivated: true,
    createdAt: "2026-03-10",
  },
  {
    id: "usr_4",
    name: "Elena Rostova",
    email: "elena.rostova@example.com",
    role: "User",
    isDeactivated: false,
    createdAt: "2025-11-20",
  },
  {
    id: "usr_5",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "User",
    isDeactivated: false,
    createdAt: "2026-04-05",
  },
];