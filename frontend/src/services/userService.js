import apiClient from "./apiClient";

const userService = {
  getAll: () => apiClient("/account"),

  getById: (id) => apiClient(`/account/${id}`),

  create: (data) =>
    apiClient("/account", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiClient(`/account/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiClient(`/account/${id}`, {
      method: "DELETE",
    }),
};

export default userService;