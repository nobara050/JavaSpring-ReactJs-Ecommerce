import apiClient from "./apiClient";
import BASE_URL from "../utils/constants";

const admin = { useAdminToken: true };

const productService = {
  getAll: () => apiClient("/product"),

  getById: (id) => apiClient(`/product/${id}`),

  create: (data) =>
    apiClient("/product", {
      ...admin,
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiClient(`/product/${id}`, {
      ...admin,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiClient(`/product/${id}`, {
      ...admin,
      method: "DELETE",
    }),

  addImage: (productId, data) =>
    apiClient(`/product/${productId}/images`, {
      ...admin,
      method: "POST",
      body: JSON.stringify(data),
    }),

  uploadImage: (productId, file, isPrimary) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("isPrimary", isPrimary);
    const token = localStorage.getItem("adminAccessToken");
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(`${BASE_URL}/product/${productId}/images/upload`, {
      method: "POST",
      headers,
      body: formData,
    }).then((res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.json();
    });
  },

  deleteImage: (productId, imageId) =>
    apiClient(`/product/${productId}/images/${imageId}`, {
      method: "DELETE",
    }),

  updateImage: (productId, imageId, data) =>
    apiClient(`/product/${productId}/images/${imageId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export default productService;