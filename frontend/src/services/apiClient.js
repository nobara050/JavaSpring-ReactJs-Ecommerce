import BASE_URL from "../utils/constants";

const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error: ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json();
};

export default apiClient;