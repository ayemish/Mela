export interface Article {
  id: string;
  brand: string;
  name: string;
  price: number;
  currency: string;
  url: string;
  image_url: string | null;
  category: string[];
  in_stock: boolean;
}

export interface FacetValue {
  value: string;
  count: number;
}

export interface SearchResponse {
  hits: Article[];
  total: number;
  page: number;
  facets: Record<string, FacetValue[]>;
}

export interface SearchParams {
  q?: string;
  brand?: string[];
  category?: string[];
  in_stock?: boolean;
  price_min?: number;
  price_max?: number;
  sort?: string;
  page?: number;
  per_page?: number;
}

export interface Brand {
  brand: string;
  count: number;
}

export interface Filters {
  brand: string[];
  category: string[];
  in_stock: boolean | null;
  price_min: number | null;
  price_max: number | null;
}

export const EMPTY_FILTERS: Filters = {
  brand: [],
  category: [],
  in_stock: null,
  price_min: null,
  price_max: null,
};
