import { useCallback, useEffect, useRef, useState } from "react";
import { searchArticles, ApiError } from "./api";
import type { Article, Filters, SearchParams } from "./types";

const PER_PAGE = 24;

interface UsePaginatedSearchResult {
  articles: Article[];
  facets: Record<string, { value: string; count: number }[]>;
  total: number;
  loading: boolean; // initial load / new query
  loadingMore: boolean; // subsequent pages
  error: string | null;
  refresh: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

/**
 * Drives a search results list: refetches from page 1 whenever `query` or
 * `filters` change, and supports appending further pages via loadMore().
 */
export function usePaginatedSearch(
  query: string,
  filters: Filters,
  sort: string = "first_seen_at:desc"
): UsePaginatedSearchResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [facets, setFacets] = useState<UsePaginatedSearchResult["facets"]>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const buildParams = useCallback(
    (pageNum: number): SearchParams => ({
      q: query || "*",
      brand: filters.brand.length ? filters.brand : undefined,
      category: filters.category.length ? filters.category : undefined,
      in_stock: filters.in_stock ?? undefined,
      price_min: filters.price_min ?? undefined,
      price_max: filters.price_max ?? undefined,
      sort,
      page: pageNum,
      per_page: PER_PAGE,
    }),
    [query, filters, sort]
  );

  const fetchPage = useCallback(
    async (pageNum: number, append: boolean) => {
      const thisRequest = ++requestId.current;
      append ? setLoadingMore(true) : setLoading(true);
      setError(null);
      try {
        const res = await searchArticles(buildParams(pageNum));
        if (thisRequest !== requestId.current) return; // a newer request superseded this one
        setArticles((prev) => (append ? [...prev, ...res.hits] : res.hits));
        setFacets(res.facets ?? {});
        setTotal(res.total);
        setPage(pageNum);
      } catch (err) {
        if (thisRequest !== requestId.current) return;
        setError(err instanceof ApiError ? err.message : "Something went wrong.");
      } finally {
        if (thisRequest === requestId.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [buildParams]
  );

  // Refetch from page 1 whenever the query or filters change.
  useEffect(() => {
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, JSON.stringify(filters), sort]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || articles.length >= total) return;
    fetchPage(page + 1, true);
  }, [loading, loadingMore, articles.length, total, page, fetchPage]);

  const refresh = useCallback(() => fetchPage(1, false), [fetchPage]);

  return {
    articles,
    facets,
    total,
    loading,
    loadingMore,
    error,
    refresh,
    loadMore,
    hasMore: articles.length < total,
  };
}
