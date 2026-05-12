import api from "./api";
import { loginMockAccount } from "./mockClinicStore";

export const login = async (payload) => {
  const mockResponse = loginMockAccount(payload);

  if (mockResponse) {
    return mockResponse;
  }

  try {
    const response = await api.post("/doctors/login", payload);
    return response.data;
  } catch (error) {
    const fallbackResponse = loginMockAccount(payload);

    if (fallbackResponse) {
      return fallbackResponse;
    }

    throw error;
  }
};
