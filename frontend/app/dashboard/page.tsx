"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ApiError,
  getCurrentUser,
  type AuthenticatedUser,
} from "../../lib/api";
import { clearAuth, getToken } from "../../lib/storage";
import { EditProfile } from "../../components/EditProfile";
import { UserManagement } from "../../components/UserManagement";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    const loadUser = async () => {
      try {
        const response = await getCurrentUser(token);
        if (!cancelled) {
          setUser(response.user);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          clearAuth();
          if (err instanceof ApiError && err.status === 401) {
            router.replace("/login");
          } else {
            setError("Failed to load your profile. Please try again.");
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-600">Loading your dashboard...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        <p className="text-sm text-red-600">{error}</p>
      </section>
    );
  }

  if (!user) {
    return null;
  }

  // Admin Dashboard
  if (user.role === "admin") {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="mt-2 text-purple-100">
            Admin Dashboard - Manage your application
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">1,234</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">+12% from last month</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">89</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">+5% from last week</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="mt-2 text-3xl font-bold text-green-600">99.9%</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">All systems operational</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <div className="mt-4 space-y-3">
              <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span>Manage Users</span>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
              <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span>View Analytics</span>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
              <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span>System Settings</span>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <svg
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New user registered</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">System backup completed</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-yellow-100 p-2">
                  <svg
                    className="h-4 w-4 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Security alert resolved</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {isEditingProfile ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>
          {isEditingProfile ? (
            <div className="mt-4">
              <EditProfile
                user={user}
                onUpdate={(updatedUser) => {
                  setUser(updatedUser);
                  setIsEditingProfile(false);
                }}
                onCancel={() => setIsEditingProfile(false)}
              />
            </div>
          ) : (
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                    Admin
                  </span>
                </dd>
              </div>
            </dl>
          )}
        </div>

        <UserManagement currentUserId={user.id} />
      </div>
    );
  }

  // User Dashboard
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="mt-2 text-blue-100">
          Your personal dashboard - Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {isEditingProfile ? (
          <div className="md:col-span-2">
            <EditProfile
              user={user}
              onUpdate={(updatedUser) => {
                setUser(updatedUser);
                setIsEditingProfile(false);
              }}
              onCancel={() => setIsEditingProfile(false)}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">My Profile</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-600">Name</span>
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm font-medium text-gray-900">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Type</span>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  User
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="mt-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Edit Profile
            </button>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Quick Links</h2>
          <div className="mt-4 space-y-3">
            <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <span>View Documents</span>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
            <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <span>Settings</span>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
            <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <span>Help & Support</span>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <div className="rounded-full bg-blue-100 p-2">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Account created successfully</p>
              <p className="text-xs text-gray-500">Welcome to the platform!</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <div className="rounded-full bg-green-100 p-2">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Profile completed</p>
              <p className="text-xs text-gray-500">Your account is ready to use</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


