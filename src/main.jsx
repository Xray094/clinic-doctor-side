import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getErrorMessage = (error) => {
  if (!error) return "Something went wrong. Please try again.";

  if (typeof error === "string") return error;

  if (error.response?.status === 401) return null;

  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.error) return error.response.data.error;

  if (typeof error.response?.data?.errors === "object") {
    const firstFieldError = Object.values(error.response.data.errors)[0];
    if (Array.isArray(firstFieldError) && firstFieldError[0]) {
      return firstFieldError[0];
    }
  }

  if (error.message) return error.message;

  return "An unexpected error occurred.";
};

const handleGlobalError = (error) => {
  const message = getErrorMessage(error);
  if (!message) return;

  toast.error(message, {
    toastId: `rq-error-${message}`,
    icon: false,
  });
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleGlobalError,
  }),
  mutationCache: new MutationCache({
    onError: handleGlobalError,
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        newestOnTop
        closeButton={false}
        className="medics-toast-container"
        toastClassName="medics-toast"
        bodyClassName="medics-toast-body"
        progressClassName="medics-toast-progress"
      />
    </QueryClientProvider>
  </StrictMode>,
);
