import { apiClient } from "@/lib/api-client";

export const authService = {
  register: (data: {
    name: string;
    username: string;
    bio: string;
    password: string;
  }) => apiClient.post("/users", data),

  login: (username: string, password: string) =>
    apiClient.post("/login", { username, password }),

  verify: () => apiClient.get("/verify"),
};
