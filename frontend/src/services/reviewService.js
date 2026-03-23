import apiClient from "./apiClient";

const user = { useAdminToken: false };

const reviewService = {
  getByProductId: (productId) =>
    apiClient(`/review/product/${productId}`),

  create: (productId, accountId, rating, comment) =>
    apiClient(`/review`, {
      ...user,
      method: "POST",
      body: JSON.stringify({ productId, accountId, rating, comment }),
    }),

  update: (reviewId, rating, comment) =>
    apiClient(`/review/${reviewId}`, {
      ...user,
      method: "PUT",
      body: JSON.stringify({ rating, comment }),
    }),

  delete: (reviewId) =>
    apiClient(`/review/${reviewId}`, {
      ...user,
      method: "DELETE",
    }),
};

export default reviewService;