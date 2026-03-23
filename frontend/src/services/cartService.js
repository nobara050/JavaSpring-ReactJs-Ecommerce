import apiClient from "./apiClient";

const user = { useAdminToken: false };

const cartService = {
  getCartByAccountId: (accountId) =>
    apiClient(`/cart/account/${accountId}`, { ...user }),

  createCart: (accountId) =>
    apiClient(`/cart/account/${accountId}`, {
      ...user,
      method: "POST",
    }),

  clearCart: (cartId) =>
    apiClient(`/cart/${cartId}/clear`, {
      ...user,
      method: "DELETE",
    }),

  addItem: (cartId, productId, quantity) =>
    apiClient(`/cart/${cartId}/items`, {
      ...user,
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),

  updateItemQuantity: (cartId, cartItemId, quantity) =>
    apiClient(`/cart/${cartId}/items/${cartItemId}?quantity=${quantity}`, {
      ...user,
      method: "PUT",
    }),

  removeItem: (cartId, cartItemId) =>
    apiClient(`/cart/${cartId}/items/${cartItemId}`, {
      ...user,
      method: "DELETE",
    }),
};

export default cartService;