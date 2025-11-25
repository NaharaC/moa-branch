import { env } from "../config/env.js";
import { API_PATHS } from "../config/api-paths.js";
import { mockHomeApi } from "../mocks/api/home.js";
import { apiClient } from "./api-client.js";

const normalizeLanding = (payload = {}) => ({
  hero: payload.hero ?? null,
  categories: Array.isArray(payload.categories) ? payload.categories : [],
  featuredProducts: Array.isArray(payload.featuredProducts) ? payload.featuredProducts : [],
  editorialSections: Array.isArray(payload.editorialSections) ? payload.editorialSections : [],
  testimonials: Array.isArray(payload.testimonials) ? payload.testimonials : [],
  contact: payload.contact ?? null,
});

const remoteHomeApi = {
  async getLanding() {
    const data = await apiClient.public.get(API_PATHS.home.landing);
    return normalizeLanding(data);
  },
};

const mockHomeApiWrapper = {
  async getLanding() {
    const data = await mockHomeApi.getLanding();
    return normalizeLanding(data);
  },
};

export const homeApi = env.USE_MOCKS ? mockHomeApiWrapper : remoteHomeApi;
