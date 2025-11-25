const importMetaEnv =
  typeof import.meta !== "undefined" && import.meta?.env
    ? import.meta.env
    : undefined;

const processEnv =
  typeof globalThis !== "undefined" && globalThis.process?.env
    ? globalThis.process.env
    : undefined;

const rawEnv = importMetaEnv || processEnv || {};
const mode = rawEnv.MODE ?? rawEnv.NODE_ENV ?? "development";

export const env = {
  API_BASE_URL: (
    rawEnv.VITE_API_URL ??
    processEnv?.VITE_API_URL ??
    "http://localhost:3000"
  ).trim(),
  API_TIMEOUT:
    Number(rawEnv.VITE_API_TIMEOUT ?? processEnv?.VITE_API_TIMEOUT) ||
    undefined,
  USE_MOCKS:
    String(rawEnv.VITE_USE_MOCKS ?? processEnv?.VITE_USE_MOCKS ?? "true")
      .trim()
      .toLowerCase() === "true",
  NODE_ENV: mode,
  IS_DEV: mode === "development",
  IS_PROD: mode === "production",
};
