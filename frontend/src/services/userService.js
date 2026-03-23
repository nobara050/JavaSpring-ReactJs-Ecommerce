import apiClient from "./apiClient";
import BASE_URL from "../utils/constants";

const admin = { useAdminToken: true };
const user = { useAdminToken: false };

const userService = {
  // Admin
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

  // User tu cap nhat thong tin cua chinh minh
  updateMe: (data) =>
    apiClient("/account/me", {
      ...user,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Upload avatar - dung fetch truc tiep vi multipart/form-data
  uploadAvatar: async (file) => {
    const accessToken = localStorage.getItem("userAccessToken");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/account/me/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error: ${response.status}`);
    }

    return response.json();
  },
};

export default userService;