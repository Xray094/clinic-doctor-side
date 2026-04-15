import api from "./api";

export const login = (payload) => {
  return api.post("/doctors/login", payload).then((response) => response.data);
};
