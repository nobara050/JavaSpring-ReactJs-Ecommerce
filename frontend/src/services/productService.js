import apiClient from "./apiClient";

const productService = {
  getAll: () => apiClient("/product"),

  getById: (id) => apiClient(`/product/${id}`),

  create: (data) =>
    apiClient("/product", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiClient(`/product/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiClient(`/product/${id}`, {
      method: "DELETE",
    }),

  addImage: (productId, data) =>
    apiClient(`/product/${productId}/images`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  uploadImage: (productId, file, isPrimary) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("isPrimary", isPrimary);
    return fetch(`http://localhost:8080/product/${productId}/images/upload`, {
      method: "POST",
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