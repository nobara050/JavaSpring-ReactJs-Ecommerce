import apiClient from "./apiClient";

const user = { useAdminToken: false };

const addressService = {
  getByAccountId: (accountId) =>
    apiClient(`/account/${accountId}/addresses`, { ...user }),

  getById: (id) =>
    apiClient(`/account/addresses/${id}`, { ...user }),

  create: (accountId, data) =>
    apiClient(`/account/${accountId}/addresses`, {
      ...user,
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiClient(`/account/addresses/${id}`, {
      ...user,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiClient(`/account/addresses/${id}`, {
      ...user,
      method: "DELETE",
    }),
};

export default addressService;