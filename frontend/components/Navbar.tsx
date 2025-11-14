"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AUTH_EVENT, clearAuth, getStoredUser } from "../lib/storage";

export const Navbar = () => {
  const router = useRouter();
  const [name, setName] = useState<string | null>(() => {
    const storedUser = getStoredUser();
    return storedUser?.name ?? null;
  });

  useEffect(() => {
    const handleAuthChange = () => {
      const storedUser = getStoredUser();
      setName(storedUser?.name ?? null);
    };

    window.addEventListener(AUTH_EVENT, handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    setName(null);
    router.push("/login");
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          inbotiq Auth
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-gray-600">
          {name ? (
            <>
              <span className="text-gray-500">Hi, {name}</span>
              <Link href="/dashboard" className="hover:text-gray-900">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-900">
                Login
              </Link>
              <Link href="/signup" className="hover:text-gray-900">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

