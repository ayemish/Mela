import type { Brand, SearchParams, SearchResponse } from "./types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

function buildSearchQuery(params: SearchParams): string {
  const usp = new URLSearchParams();
  if (params.q !== undefined) usp.set("q", params.q);
  params.brand?.forEach((b) => usp.append("brand", b));
  params.category?.forEach((c) => usp.append("category", c));
  if (params.in_stock !== undefined && params.in_stock !== null) {
    usp.set("in_stock", String(params.in_stock));
  }
  if (params.price_min !== undefined && params.price_min !== null) {
    usp.set("price_min", String(params.price_min));
  }
  if (params.price_max !== undefined && params.price_max !== null) {
    usp.set("price_max", String(params.price_max));
  }
  if (params.sort) usp.set("sort", params.sort);
  if (params.page) usp.set("page", String(params.page));
  if (params.per_page) usp.set("per_page", String(params.per_page));
  return usp.toString();
}

async function apiFetch<T>(path: string): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "EXPO_PUBLIC_API_URL is not set. Add it to your .env file (see .env.example)."
    );
  }
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`);
  } catch (err) {
    throw new ApiError(0, "Network request failed — is the API reachable from your device?");
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, `API error ${res.status}: ${body}`);
  }
  return res.json();
}

/** GET /search — hybrid keyword + vector search with filters, pagination, facets. */
export function searchArticles(params: SearchParams = {}): Promise<SearchResponse> {
  const query = buildSearchQuery({ q: "*", per_page: 24, page: 1, ...params });
  return apiFetch<SearchResponse>(`/search?${query}`);
}

/** GET /search/new-arrivals — items first scraped in the last N days. */
export function getNewArrivals(days = 7, per_page = 48): Promise<SearchResponse> {
  return apiFetch<SearchResponse>(`/search/new-arrivals?days=${days}&per_page=${per_page}`);
}

/** GET /brands — every brand with its article count. */
export function getBrands(): Promise<{ brands: Brand[] }> {
  return apiFetch(`/brands`);
}

/** GET /brands/{brand_name} — all articles for one brand, newest first. */
export function getBrandArticles(brand: string, page = 1, per_page = 24): Promise<SearchResponse> {
  return apiFetch<SearchResponse>(
    `/brands/${encodeURIComponent(brand)}?page=${page}&per_page=${per_page}`
  );
}

/** GET /categories */
export function getCategories(): Promise<{ categories: { category: string; count: number }[] }> {
  return apiFetch(`/categories`);
}
