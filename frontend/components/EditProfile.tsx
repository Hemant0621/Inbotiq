"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError, updateCurrentUser, type AuthenticatedUser } from "../lib/api";
import { getToken, updateStoredUser } from "../lib/storage";

type EditProfileForm = {
  name: string;
  password: string;
  confirmPassword: string;
};

type EditProfileProps = {
  user: AuthenticatedUser;
  onUpdate: (user: AuthenticatedUser) => void;
  onCancel: () => void;
};

export const EditProfile = ({ user, onUpdate, onCancel }: EditProfileProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<EditProfileForm>({
    defaultValues: {
      name: user.name,
      password: "",
      confirmPassword: "",
    },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const password = watch("password");

  const onSubmit = async (values: EditProfileForm) => {
    setFormError(null);

    if (values.password && values.password !== values.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setFormError("Not authenticated");
        return;
      }

      const payload: { name?: string; password?: string } = {};
      if (values.name !== user.name) {
        payload.name = values.name;
      }
      if (values.password) {
        payload.password = values.password;
      }

      if (Object.keys(payload).length === 0) {
        setFormError("No changes to save");
        return;
      }

      const result = await updateCurrentUser(token, payload);
      updateStoredUser(result.user);
      onUpdate(result.user);
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError("Failed to update profile. Please try again.");
      }
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
      <p className="mt-1 text-sm text-gray-600">
        Update your name or password. Email cannot be changed.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password (leave blank to keep current)
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            placeholder="••••••••"
            {...register("password", {
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {password && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              placeholder="••••••••"
              {...register("confirmPassword", {
                validate: (value) =>
                  !password || value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

