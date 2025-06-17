// src/api.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const BASE_URL = "https://coding-platform-backend.vercel.app/api";
const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";

function getAccess() {
  return localStorage.getItem(ACCESS_KEY);
}
function getRefresh() {
  return localStorage.getItem(REFRESH_KEY);
}
function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
  api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
}
function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  delete api.defaults.headers.common["Authorization"];
}

export const api = axios.create({ baseURL: BASE_URL });

/* ───────────────────────────────
   1.  REQUEST INTERCEPTOR
   • Inject Authorization header if access token exists
──────────────────────────────── */
api.interceptors.request.use((config) => {
  const token = getAccess();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ───────────────────────────────
   2.  RESPONSE INTERCEPTOR
   • If we get 401 once, try to refresh
   • Prevent infinite retry loops with a custom flag
──────────────────────────────── */
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<any>) => {
    const original = err.config as AxiosRequestConfig & { _retry?: boolean };
    if (
      err.response?.status === 401 &&
      !original._retry &&
      getRefresh() // we have a refresh token
    ) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${BASE_URL}/auth/token/refresh/`,
          { refresh: getRefresh() }
        );
        setTokens(data.access, data.refresh ?? getRefresh()!);
        return api(original); // retry original request
      } catch (_e) {
        clearTokens();
      }
    }
    return Promise.reject(err);
  }
);

/* ───────────────────────────────
   3.  AUTH HELPERS
──────────────────────────────── */
export const register = (d: {
  username: string;
  email: string;
  password: string;
}) => api.post("/auth/register/", d);

export const login = async (d: { username: string; password: string }) => {
  const res = await api.post("/auth/login/", d);
  setTokens(res.data.access, res.data.refresh);
  return res;
};

export const logout = () => clearTokens();

/* ───────────────────────────────
   4.  PROBLEM & SUBMISSION ENDPOINTS
──────────────────────────────── */
export const getProblems = () => api.get("/problems/");
export const getProblem = (slug: string) => api.get(`/problems/${slug}/`);

export const submit = (payload: {
  problem_slug: string;
  language: string;
  code: string;
}) => api.post("/submit/", payload);
