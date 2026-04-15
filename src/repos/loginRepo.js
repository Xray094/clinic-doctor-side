import { useMutation } from "@tanstack/react-query";
import { login } from "../services/loginService";
import { useAuthStore } from "../store/useAuthStore";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
    },
  });
};
