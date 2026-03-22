import apiClient from "./apiClient";

const admin = { useAdminToken: true };

const userService = {
  getAll: () => apiClient("/account", admin),

  getById: (id) => apiClient(`/account/${id}`, admin),

  create: (data) =>
    apiClient("/account", {
      ...admin,
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiClient(`/account/${id}`, {
      ...admin,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiClient(`/account/${id}`, {
      ...admin,
      method: "DELETE",
    }),
};

export default userService;
