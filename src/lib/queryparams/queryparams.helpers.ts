import queryString from "query-string";

import { removeEmptyOrNull } from "../object";

export const getQueryString = (params: Record<string, unknown> = {}) => {
  return queryString.stringify(removeEmptyOrNull(params), {
    arrayFormat: "comma",
    // use encodeURIComponent to escape special characters instead of internal one
    strict: false,
  });
};

export const queryToObject = (querystring: string) => {
  // remove null prototype
  return { ...queryString.parse(querystring, { arrayFormat: "comma" }) };
};
