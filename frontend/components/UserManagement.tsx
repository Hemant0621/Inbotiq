"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ApiError,
  getAllUsers,
  deleteUser,
  type AuthenticatedUser,
} from "../lib/api";
import { getToken } from "../lib/storage";

type UserManagementProps = {
  currentUserId: string;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const UserManagement = ({ currentUserId }: UserManagementProps) => {
  const [users, setUsers] = useState<AuthenticatedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const result = await getAllUsers(token, {
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
      });
      setUsers(result.users);
      setPagination(result.pagination);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (userId: string) => {
    try {
      const token = getToken();
      if (!token) {
        setError("Not authenticated");
        return;
      }

      await deleteUser(token, userId);
      await loadUsers();
      setDeleteConfirmId(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={loadUsers}
          className="mt-2 text-sm text-red-700 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 sm:w-64"
            />
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={loadUsers}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-900">Name</th>
              <th className="px-4 py-3 font-medium text-gray-900">Email</th>
              <th className="px-4 py-3 font-medium text-gray-900">Role</th>
              <th className="px-4 py-3 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-gray-900">{user.name}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.id !== currentUserId && (
                    <>
                      {deleteConfirmId === user.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(user.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-600">
            Showing {users.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
            {Math.min(page * limit, pagination.total)} of {pagination.total}{" "}
            users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      page === pageNum
                        ? "bg-gray-900 text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages || loading}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {users.length === 0 && !loading && (
        <div className="mt-6 text-center text-sm text-gray-500">
          {debouncedSearch ? "No users found matching your search." : "No users found."}
        </div>
      )}
    </div>
  );
};

