import { env } from "../config/env.js";

const DEFAULT_TIMEOUT = env.API_TIMEOUT ?? 15000;

let tokenGetter = () => {
  const token =
    localStorage.getItem("moa.accessToken") || localStorage.getItem("token");

  if (!token) return null;

  return token.replace(/^"+|"+$/g, "");
};

let onUnauthorized = null;

export const setTokenGetter = (fn) => {
  tokenGetter = typeof fn === "function" ? fn : () => null;
};

export const setOnUnauthorized = (fn) => {
  onUnauthorized = typeof fn === "function" ? fn : null;
};

const isRawBody = (data) =>
  data instanceof FormData ||
  data instanceof Blob ||
  data instanceof ArrayBuffer;

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
  const url = new URL(path, env.API_BASE_URL);

  // Timeout
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

  // Body
  if (data !== undefined) {
    if (isRawBody(data)) {
      opts.body = data;
    } else {
      opts.headers["Content-Type"] = "application/json";
      opts.body = typeof data === "string" ? data : JSON.stringify(data);
    }
  }

  // Auth
  let token = null;
  if (auth) {
    token = tokenGetter();
    if (token) opts.headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(url, opts);
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 204) return null;

  const text = await res.text();
  const payload = text ? tryParseJSON(text) : null;

  if (res.status === 401 && token && onUnauthorized) {
    try {
      onUnauthorized();
    } catch (e) {
      console.error(e);
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

const tryParseJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const verbs = (auth) => ({
  get: (path, opts) => request(path, { ...opts, method: "GET", auth }),
  post: (path, data, opts) =>
    request(path, { ...opts, method: "POST", data, auth }),
  put: (path, data, opts) =>
    request(path, { ...opts, method: "PUT", data, auth }),
  patch: (path, data, opts) =>
    request(path, { ...opts, method: "PATCH", data, auth }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE", auth }),
});

export const apiClient = {
  public: verbs(false),
  private: verbs(true),
};
