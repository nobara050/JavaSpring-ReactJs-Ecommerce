import BASE_URL from "../utils/constants";
import { getBearerTokenForRequest } from "../utils/authToken";

/**
 * @param {string} endpoint
 * @param {RequestInit & { useAdminToken?: boolean }} options
 *        useAdminToken: true  → luôn dùng adminAccessToken (trang quản trị, tránh 403 khi còn userAccessToken)
 *        useAdminToken: false → chỉ userAccessToken
 *        không truyền       → theo pathname (authToken.js)
 */
const apiClient = async (endpoint, options = {}) => {
  const { useAdminToken, headers: customHeaders = {}, ...restOptions } = options;
  const url = `${BASE_URL}${endpoint}`;

  let accessToken;
  if (useAdminToken === true) {
    accessToken = localStorage.getItem("adminAccessToken");
  } else if (useAdminToken === false) {
    accessToken = localStorage.getItem("userAccessToken");
  } else {
    accessToken = getBearerTokenForRequest();
  }

  const defaultHeaders = { "Content-Type": "application/json" };
  if (accessToken) {
    defaultHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const config = { ...restOptions, headers: { ...defaultHeaders, ...customHeaders } };
  const response = await fetch(url, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
};

export default apiClient;