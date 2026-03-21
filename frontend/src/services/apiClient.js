import BASE_URL from "../utils/constants";

const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const accessToken = localStorage.getItem("adminAccessToken");
  const defaultHeaders = { "Content-Type": "application/json" };

  if (accessToken) {
    defaultHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const config = { ...options, headers: { ...defaultHeaders, ...options.headers } };
  const response = await fetch(url, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
};

export default apiClient;