import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthRoute = originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh-token");

    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh-token");
        const newAccessToken = data.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// const api = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) config.headers.Authorization = Bearer ${token};
//   return config;
// });

// let isRefreshing = false;
// let pendingQueue = [];

// const processQueue = (error, token = null) => {
//   pendingQueue.forEach(({ resolve, reject }) => {
//     if (error) reject(error);
//     else resolve(token);
//   });
//   pendingQueue = [];
// };

// // Routes where a 401 is an EXPECTED, normal outcome (not a session that
// // needs recovering) — never attempt a refresh or redirect for these.
// const isSessionCheckOrAuthRoute = (url = "") =>
//   url.includes("/auth/login") ||
//   url.includes("/auth/register") ||
//   url.includes("/auth/refresh-token") ||
//   url.includes("/auth/me");

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const status = error.response?.status;

//     if (status === 401 && !originalRequest._retry && !isSessionCheckOrAuthRoute(originalRequest.url)) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           pendingQueue.push({ resolve, reject });
//         }).then((token) => {
//           originalRequest.headers.Authorization = Bearer ${token};
//           return api(originalRequest);
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const { data } = await api.post("/auth/refresh-token");
//         const newAccessToken = data.data.accessToken;
//         localStorage.setItem("accessToken", newAccessToken);
//         api.defaults.headers.common.Authorization = Bearer ${newAccessToken};
//         processQueue(null, newAccessToken);
//         originalRequest.headers.Authorization = Bearer ${newAccessToken};
//         return api(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError, null);
//         localStorage.removeItem("accessToken");
//         // No hard redirect here. Clearing the token is enough — Redux state
//         // (isAuthenticated becomes false) and ProtectedRoute/RoleRoute already
//         // handle navigating unauthenticated users away from gated pages.
//         // A window.location redirect here causes full page reloads that can
//         // wipe in-flight state and create reload loops for guest visitors.
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;