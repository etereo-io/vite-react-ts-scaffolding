import { isObjectEmpty, removeEmptyOrNull } from "./object";

describe("removeEmptyOrNull", () => {
  it("removes empty or null properties from an object", () => {
    const obj = {
      name: "John",
      age: null,
      address: {
        street: "",
        city: "New York",
        state: null
      }
    };

    const expected = {
      name: "John",
      address: {
        city: "New York"
      }
    };

    const actual = removeEmptyOrNull(obj);
    expect(actual).toStrictEqual(expected);
  });
});

describe("isObjectEmpty", () => {
  test("returns true if the object is empty", () => {
    const obj = {};
    expect(isObjectEmpty(obj)).toBe(true);
  });

  test("returns false if the object is not empty", () => {
    const obj = { name: "John" };
    expect(isObjectEmpty(obj)).toBe(false);
  });

  test("returns true if the object is null or undefined", () => {
    expect(isObjectEmpty(null)).toBe(true);
    expect(isObjectEmpty(undefined)).toBe(true);
  });
});
