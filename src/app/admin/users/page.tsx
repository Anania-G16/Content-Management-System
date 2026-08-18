"use client";

import { useState, useEffect } from "react";
import {
  getClients,
  updateUserStatus,
  deleteUser,
  promoteUserToAdmin,
} from "@/app/services/userService";
import {
  Search,
  MoreVertical,
  UserPlus,
  ShieldCheck,
  User as UserIcon,
  UserX,
  UserCheck,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { User, UserRole } from "@/data/userData";
import Spinner from "@/components/Spinner";

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
    openUpward: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getClients();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Search filter matching name or email
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleMenu = (
    userId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (activeMenuId === userId) {
      setActiveMenuId(null);
      setMenuPosition(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < 180;

    setMenuPosition({
      top: openUpward ? rect.top - 140 : rect.bottom + 8,
      right: window.innerWidth - rect.right,
      openUpward,
    });
    setActiveMenuId(userId);
  };

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      await promoteUserToAdmin(userId);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: "Admin" } : user,
        ),
      );

      setActiveMenuId(null);
      setMenuPosition(null);
    } catch (error) {
      console.error("Failed to promote user to admin:", error);
    }
  };

  const handleToggleDeactivate = async (userId: string) => {
    const user = users.find((u) => u.id === userId);

    if (!user) return;

    try {
      const newIsActive = user.isDeactivated === true;

      await updateUserStatus(userId, newIsActive);

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, isDeactivated: !newIsActive } : u,
        ),
      );

      setActiveMenuId(null);
      setMenuPosition(null);
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);

      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== userToDelete.id),
      );

      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    if (role === "Admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <ShieldCheck size={12} />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-text-secondary border border-white/8">
        <UserIcon size={12} />
        User
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/8">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage user accounts, roles, and system access.
          </p>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/8 text-sm text-text placeholder:text-text-secondary/60 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-white/8 bg-[#1a1a1a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/2 text-text-secondary text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex justify-center">
                      <Spinner size="md" />
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`transition-colors group ${
                      user.isDeactivated
                        ? "opacity-60 bg-white/1"
                        : "hover:bg-white/2"
                    }`}
                  >
                    {/* User Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/8 border border-white/1 flex items-center justify-center text-text font-medium text-xs">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex flex-col truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text truncate">
                              {user.name}
                            </span>
                            {user.isDeactivated && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Deactivated
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-text-secondary truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-text-secondary text-xs">
                      {user.createdAt}
                    </td>

                    {/* Action Menu */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => toggleMenu(user.id, e)}
                        className="p-1.5 rounded-lg text-text-secondary hover:text-text hover:bg-white/6 transition-colors"
                        aria-label="Actions"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Fixed Positioned Dropdown Menu */}
                      {activeMenuId === user.id && menuPosition && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => {
                              setActiveMenuId(null);
                              setMenuPosition(null);
                            }}
                          />
                          <div
                            style={{
                              top: `${menuPosition.top}px`,
                              right: `${menuPosition.right}px`,
                            }}
                            className="fixed z-50 w-48 rounded-lg bg-[#222222] border border-white/1 shadow-xl py-1 text-left animate-in fade-in zoom-in-95 duration-150"
                          >
                            {/* Promote to Admin Option */}
                            {user.role !== "Admin" && (
                              <button
                                onClick={() => handlePromoteToAdmin(user.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-purple-400 hover:bg-purple-500/10 transition-colors"
                              >
                                <ShieldCheck size={14} />
                                Promote to Admin
                              </button>
                            )}

                            {/* Deactivate / Reactivate Option */}
                            <button
                              onClick={() => handleToggleDeactivate(user.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/10 transition-colors"
                            >
                              {user.isDeactivated ? (
                                <>
                                  <UserCheck size={14} />
                                  Reactivate User
                                </>
                              ) : (
                                <>
                                  <UserX size={14} />
                                  Deactivate User
                                </>
                              )}
                            </button>

                            <div className="my-1 border-t border-white/8" />

                            {/* Delete Option */}
                            <button
                              onClick={() => {
                                setUserToDelete(user);
                                setActiveMenuId(null);
                                setMenuPosition(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete User
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-text-secondary text-sm"
                  >
                    {searchTerm
                      ? `No users found matching "${searchTerm}"`
                      : "No users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1a1a1a] border border-white/1 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-semibold text-text">
                Delete User Account
              </h3>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-text">
                {userToDelete.name}
              </span>{" "}
              ({userToDelete.email})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-sm text-text hover:bg-white/8 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white font-medium text-sm hover:bg-rose-500 transition-colors shadow-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
