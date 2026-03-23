import BASE_URL from "../utils/constants";

/**
 * Auth không dùng Bearer (trừ refresh có thể sau này) — gọi trực tiếp để đọc HTTP status.
 */
async function postJson(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const err = new Error(text || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

async function fetchMe(accessToken) {
  const res = await fetch(`${BASE_URL}/account/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) return null;
  return res.json();
}

function clearAdminSession() {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("adminUsername");
}

function clearUserSession() {
  localStorage.removeItem("userAccessToken");
  localStorage.removeItem("userRefreshToken");
  localStorage.removeItem("userUsername");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userAccountId");
}

const authService = {
  login: (username, password) =>
    postJson("/auth/login", { username, password }),

  register: ({ username, password, email, fullName, phone }) =>
    postJson("/auth/register", { username, password, email, fullName, phone }),

  refresh: (refreshToken) =>
    postJson("/auth/refresh", { refreshToken }),

  logout: async (refreshToken) => {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok && res.status !== 204) {
      const t = await res.text();
      throw new Error(t || `HTTP ${res.status}`);
    }
  },

  clearAdminSession,

  /**
   * Lưu session user — xóa admin trước để tránh trùng hai JWT.
   * Sau khi lưu token, gọi /account/me để lấy accountId và lưu vào localStorage.
   */
  persistUserSession: async (auth) => {
    if (!auth) return;
    clearAdminSession();
    localStorage.setItem("userAccessToken", auth.accessToken);
    localStorage.setItem("userRefreshToken", auth.refreshToken);
    localStorage.setItem("userUsername", auth.username || "");
    localStorage.setItem("userEmail", auth.email || "");

    // Lấy accountId từ /account/me
    const me = await fetchMe(auth.accessToken);
    if (me?.id) {
      localStorage.setItem("userAccountId", String(me.id));
    }
  },

  clearUserSession,
};

export default authService;