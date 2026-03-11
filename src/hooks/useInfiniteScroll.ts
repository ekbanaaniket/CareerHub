// ============= Infinite Scroll Hook =============
import { useState, useCallback, useRef, useEffect } from "react";

interface UseInfiniteScrollOptions<T> {
  fetchFn: (page: number, limit: number) => Promise<{ data: T[]; total: number }>;
  limit?: number;
  deps?: any[];
}

interface UseInfiniteScrollResult<T> {
  items: T[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
  total: number;
  sentinelRef: (node: HTMLDivElement | null) => void;
}

export function useInfiniteScroll<T>({
  fetchFn,
  limit = 10,
  deps = [],
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const hasMore = items.length < total;

  const fetchPage = useCallback(
    async (pageNum: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      try {
        const result = await fetchFn(pageNum, limit);
        setTotal(result.total);
        setItems((prev) => (append ? [...prev, ...result.data] : result.data));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [fetchFn, limit]
  );

  // Reset on deps change
  useEffect(() => {
    setPage(1);
    setItems([]);
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, limit]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage, true);
  }, [page, loadingMore, hasMore, fetchPage]);

  const reset = useCallback(() => {
    setPage(1);
    setItems([]);
    fetchPage(1, false);
  }, [fetchPage]);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node) return;
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingMore) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );
      observerRef.current.observe(node);
    },
    [hasMore, loadingMore, loadMore]
  );

  return { items, loading, loadingMore, hasMore, loadMore, reset, total, sentinelRef };
}
