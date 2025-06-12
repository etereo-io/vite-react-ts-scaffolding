import { useCallback, useEffect } from "react";
import { NavigateOptions } from "react-router";

import { useQueryParams } from "./useQueryParams";

interface UseQueryParamStateOptions<T> {
  // whenever the query param is not present, should we look for it in the storage
  // this is incompatible with a non-empty defaultValue
  fallbackStore?: boolean;
  defaultValue?: T;
  storePrefix?: string;
}

// T has to be a string like type
export function useQueryParamState<T = string>(
  key: string,
  options: UseQueryParamStateOptions<T> = {}
) {
  const { params, applyParams, removeParams } = useQueryParams();

  const finalOptions: UseQueryParamStateOptions<T> = {
    storePrefix: "app-",
    defaultValue: null as T,
    ...options
  };

  const setValue = useCallback(
    (value: T, setValueOptions?: NavigateOptions) => {
      if (!value) {
        removeParams(key);
      } else {
        params.set(key, value as string);
      }
      applyParams(params, setValueOptions);
    },
    [key, params, applyParams, removeParams]
  );

  const resetFallback = useCallback(() => {
    if (finalOptions?.fallbackStore) {
      localStorage.setItem(
        `${finalOptions.storePrefix}${key}`,
        finalOptions.defaultValue as string
      );
    }
  }, [
    finalOptions.defaultValue,
    finalOptions?.fallbackStore,
    finalOptions.storePrefix,
    key
  ]);

  const value =
    (finalOptions?.fallbackStore
      ? (params.get(key) ??
        localStorage.getItem(`${finalOptions.storePrefix}${key}`))
      : params.get(key)) ??
    finalOptions?.defaultValue ??
    null;

  useEffect(() => {
    if (finalOptions?.fallbackStore) {
      localStorage.setItem(
        `${finalOptions.storePrefix}${key}`,
        value as string
      );
    }
  }, [finalOptions?.fallbackStore, finalOptions.storePrefix, key, value]);

  return { value: value as NonNullable<T> | null, setValue, resetFallback };
}
