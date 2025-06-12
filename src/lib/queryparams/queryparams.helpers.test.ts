import { getQueryString, queryToObject } from "./queryparams.helpers";

describe("getQueryString and queryToObject", () => {
  const testCases = [
    {
      params: { name: "John", age: 30 },
      expectedQuery: "age=30&name=John",
      expectedObject: { name: "John", age: "30" },
    },
    {
      params: { name: "John", age: null },
      expectedQuery: "name=John",
      expectedObject: { name: "John" },
    },
    {
      params: { name: "John", hobbies: ["reading", "gaming"] },
      expectedQuery: "hobbies=reading,gaming&name=John",
      expectedObject: { name: "John", hobbies: ["reading", "gaming"] },
    },
  ];

  it.each(testCases)(
    `should correctly convert params to querystring and vice versa:`,
    (testCase) => {
      const { params, expectedQuery, expectedObject } = testCase;
      expect(getQueryString(params)).toStrictEqual(expectedQuery);
      expect(queryToObject(expectedQuery)).toStrictEqual(expectedObject);
    },
  );
});
