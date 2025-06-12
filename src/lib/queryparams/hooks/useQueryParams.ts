import { useCallback, useMemo } from "react";
import { NavigateOptions, useLocation, useNavigate } from "react-router";

export function useQueryParams() {
  const { search } = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(search), [search]);

  const clear = useCallback(() => {
    navigate({
      search: ""
    });
  }, [navigate]);

  const applyParams = useCallback(
    (params: URLSearchParams, options?: NavigateOptions) => {
      navigate(
        {
          search: params.toString()
        },
        options
      );
    },
    [navigate]
  );

  const removeParams = useCallback(
    (keys: string | string[], options?: NavigateOptions) => {
      if (Array.isArray(keys)) {
        keys.forEach((key) => params.delete(key));
      } else {
        params.delete(keys);
      }

      applyParams(params, options);
    },
    [applyParams, params]
  );

  return { params, clear, applyParams, removeParams };
}
