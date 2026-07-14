import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAdminToken } from "../features/auth/adminAuth/adminAuthSlice";
import {
  fetchAdminResource,
  selectAdminEntry,
  invalidateAdminResource,
  STALE_MS,
} from "./adminDataSlice";

/**
 * Stale-while-revalidate for an admin dataset.
 *
 * Returns cached `data` straight away (so the page paints with no spinner),
 * refetches in the background when it's older than STALE_MS, and only reports
 * `loading: true` on a genuinely cold load — i.e. when there is nothing to show.
 *
 * @param resource  key from adminDataSlice FETCHERS ("users", "esims", …)
 * @param pollMs    optional background poll interval
 */
export default function useAdminData(resource, { pollMs } = {}) {
  const dispatch = useDispatch();
  const token = useSelector(selectAdminToken);
  const { data, fetchedAt, loading, error } = useSelector(selectAdminEntry(resource));

  const refresh = useCallback(
    (force = true) => {
      if (!token) return;
      if (!force && fetchedAt && Date.now() - fetchedAt < STALE_MS) return;
      dispatch(fetchAdminResource({ resource, token }));
    },
    [dispatch, resource, token, fetchedAt]
  );

  // On mount: paint from cache, revalidate only if the data is stale.
  useEffect(() => {
    if (!token) return;
    if (!fetchedAt || Date.now() - fetchedAt >= STALE_MS) {
      dispatch(fetchAdminResource({ resource, token }));
    }
    // fetchedAt is intentionally not a dep: including it would re-run the effect
    // on every successful fetch and loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, resource, token]);

  useEffect(() => {
    if (!pollMs || !token) return;
    const id = setInterval(() => dispatch(fetchAdminResource({ resource, token })), pollMs);
    return () => clearInterval(id);
  }, [dispatch, resource, token, pollMs]);

  const invalidate = useCallback(
    (keys) => dispatch(invalidateAdminResource(keys || resource)),
    [dispatch, resource]
  );

  return {
    data,
    // Only a COLD load blocks the UI. A background revalidate must not blank the page.
    loading: loading && !data,
    refreshing: loading && !!data,
    error,
    refresh,
    invalidate,
  };
}
