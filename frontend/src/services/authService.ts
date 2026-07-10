import api from "@/lib/axios";

export const authService = {
  signUp: async (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => {
    const res = await api.post(
      "/auth/signup",
      { username, password, email, firstName, lastName },
      { withCredentials: true },
    );

    return res.data;
  },

  signIn: async (username: string, password: string) => {
    const res = await api.post(
      "auth/signin",
      { username, password },
      { withCredentials: true },
    );
    return res.data; // access token
  },

  signOut: async () => {
    return api.post("/auth/signout", { withCredentials: true });
  },

  fetchMe: async () => {
    const res = await api.get("/users/me", { withCredentials: true });
    return res.data.user; // chạy sau khi loging
  },

  refresh: async () => {
    const res = await api.post<{
      accessToken: string;
    }>("/auth/refresh", { withCredentials: true });
    return res.data.accessToken;
  },

  test: async () => {
    const res = await api.get<{
      message: string;
    }>("/users/test", { withCredentials: true });
    return res.data.message;
  },
};
