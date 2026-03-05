/**
 * Idle Detection Constants
 */

/**
 * Time in milliseconds before the user is considered idle.
 * After this period of inactivity, TanStack Query refetch intervals
 * will be paused (except queries with refetchIntervalInBackground: true).
 */
export const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
