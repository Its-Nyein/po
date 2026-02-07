import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export function useRegister() {
  return useMutation({
    mutationFn: (data: {
      name: string;
      username: string;
      bio: string;
      password: string;
    }) => authService.register(data),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => authService.login(username, password),
  });
}
