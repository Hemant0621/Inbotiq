export const API_BASE_URL =
  process.env.BACKEND_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

export type UserRole = "user" | "admin";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = {
  token: string;
  user: AuthenticatedUser;
};

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message || "Something went wrong";
    throw new ApiError(message, response.status);
  }

  return data as T;
};

export const signup = async (payload: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<AuthResponse>(response);
};

export const login = async (payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<AuthResponse>(response);
};

export const getCurrentUser = async (token: string): Promise<{
  user: AuthenticatedUser;
}> => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return handleResponse<{ user: AuthenticatedUser }>(response);
};

export const updateCurrentUser = async (
  token: string,
  payload: {
    name?: string;
    password?: string;
  }
): Promise<{ user: AuthenticatedUser }> => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<{ user: AuthenticatedUser }>(response);
};

// Admin only functions
export const getAllUsers = async (
  token: string,
  options?: {
    page?: number;
    limit?: number;
    search?: string;
  }
): Promise<{
  users: AuthenticatedUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const params = new URLSearchParams();
  if (options?.page) params.append("page", options.page.toString());
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.search) params.append("search", options.search);

  const queryString = params.toString();
  const url = `${API_BASE_URL}/auth/users${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return handleResponse<{
    users: AuthenticatedUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(response);
};

export const deleteUser = async (
  token: string,
  userId: string
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<{ message: string }>(response);
};

export const api = {
  signup,
  login,
  getCurrentUser,
  updateCurrentUser,
  getAllUsers,
  deleteUser,
};

export { ApiError };

