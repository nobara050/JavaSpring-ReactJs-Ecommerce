/**
 * Tránh gửi JWT user cho API admin (403) và ngược lại.
 * — Trang /admin/* (trừ /admin/login) → chỉ dùng adminAccessToken
 * — Còn lại → userAccessToken
 */
export function getBearerTokenForRequest() {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname || "";
  const onAdminPanel = path.startsWith("/admin") && !path.startsWith("/admin/login");
  if (onAdminPanel) {
    return localStorage.getItem("adminAccessToken");
  }
  return localStorage.getItem("userAccessToken");
}
