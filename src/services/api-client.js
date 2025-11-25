import { env } from "../config/env.js";

const DEFAULT_TIMEOUT = env.API_TIMEOUT ?? 15000;

let tokenGetter = () => {
  const token =
    localStorage.getItem("moa.accessToken") || localStorage.getItem("token");
  return token ?? null;
};

let onUnauthorized = null;

export function setTokenGetter(fn) {
  tokenGetter = typeof fn === "function" ? fn : () => null;
}

export function setOnUnauthorized(fn) {
  onUnauthorized = typeof fn === "function" ? fn : null;
}

const isRawBody = (data) =>
  (typeof FormData !== "undefined" && data instanceof FormData) ||
  (typeof Blob !== "undefined" && data instanceof Blob) ||
  (typeof ArrayBuffer !== "undefined" && data instanceof ArrayBuffer);

async function request(
  path,
  {
    method = "GET",
    data,
    headers = {},
    auth = false,
    timeout = DEFAULT_TIMEOUT,
  } = {}
) {
  const baseURL = env.API_BASE_URL;
  const url = new URL(path, baseURL);

  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(new Error("Request timeout")),
    timeout
  );

  const opts = {
    method,
    headers: { ...headers },
    signal: controller.signal,
  };

  if (data !== undefined) {
    if (isRawBody(data)) {
      opts.body = data;
    } else {
      opts.headers["Content-Type"] = "application/json";
      opts.body = typeof data === "string" ? data : JSON.stringify(data);
    }
  }

  // 🔥 Obtener token una sola vez
  let token = null;
  if (auth) {
    token = tokenGetter();
    opts.headers.Authorization = token ? `Bearer ${token}` : "";
  }

  let res;
  try {
    res = await fetch(url, opts);
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 204) return null;

  const text = await res.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  // 🔥 Usar el MISMO token leído antes
  if (res.status === 401 && token && onUnauthorized) {
    try {
      onUnauthorized();
    } catch (e) {
      console.error("onUnauthorized handler failed", e);
    }
  }

  if (!res.ok) {
    const err = new Error(payload?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = payload;
    throw err;
  }

  return payload;
}

const verbs = (auth) => ({
  get: (path, opts = {}) => request(path, { ...opts, method: "GET", auth }),
  post: (path, data, opts = {}) =>
    request(path, { ...opts, method: "POST", data, auth }),
  put: (path, data, opts = {}) =>
    request(path, { ...opts, method: "PUT", data, auth }),
  patch: (path, data, opts = {}) =>
    request(path, { ...opts, method: "PATCH", data, auth }),
  delete: (path, opts = {}) =>
    request(path, { ...opts, method: "DELETE", auth }),
});

export const apiClient = {
  public: verbs(false),
  private: verbs(true),
};
