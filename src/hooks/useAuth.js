import { useMutation } from "@tanstack/react-query";
import { fetchLogin, fetchRegister } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useCallback, useState } from "react";
import { apiErrorMessage } from "../lib/apiError";

export const useAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSuccess = (data) => {
    localStorage.setItem("token", data.token);
    useAuthStore.getState().setToken(data.token);
    setError(null);
    navigate("/dashboard");
  };

  const handleError = (err) => {
    const status = err?.response?.status;

    if (!err?.response) {
      setError("Network error. Check your connection and try again.");
      return;
    }
    if (status === 401) {
      setError("Wrong email or password.");
      return;
    }
    setError(apiErrorMessage(err, "Something went wrong. Please try again."));
  };

  const loginMutation = useMutation({
    mutationFn: (params) => fetchLogin(params),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const registerMutation = useMutation({
    mutationFn: (params) => fetchRegister(params),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const submitAuth = async (data, type) => {
    setError(null);
    const mutation = type === "login" ? loginMutation : registerMutation;
    return mutation.mutateAsync(data);
  };

  // Must be stable: AuthForm clears the banner in an effect keyed on the tab,
  // and this function. Recreating it every render made that effect run after
  // every render — including the one that had just set the error — so the
  // banner was wiped before it could ever be painted.
  const clearError = useCallback(() => setError(null), []);

  return {
    submitAuth,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error,
    clearError,
  };
};
