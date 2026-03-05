import { composeRefs } from "./compose-refs";

describe("composeRefs", () => {
  test("calls function refs with the node", () => {
    const ref1 = vi.fn();
    const ref2 = vi.fn();
    const node = document.createElement("div");

    const composed = composeRefs(ref1, ref2);
    composed(node);

    expect(ref1).toHaveBeenCalledWith(node);
    expect(ref2).toHaveBeenCalledWith(node);
  });

  test("sets mutable ref object current value", () => {
    const ref1 = { current: null as HTMLDivElement | null };
    const ref2 = { current: null as HTMLDivElement | null };
    const node = document.createElement("div");

    const composed = composeRefs(ref1, ref2);
    composed(node);

    expect(ref1.current).toBe(node);
    expect(ref2.current).toBe(node);
  });

  test("handles mix of function and object refs", () => {
    const fnRef = vi.fn();
    const objRef = { current: null as HTMLDivElement | null };
    const node = document.createElement("div");

    const composed = composeRefs(fnRef, objRef);
    composed(node);

    expect(fnRef).toHaveBeenCalledWith(node);
    expect(objRef.current).toBe(node);
  });

  test("handles undefined refs gracefully", () => {
    const ref1 = vi.fn();
    const node = document.createElement("div");

    const composed = composeRefs(ref1, undefined);
    composed(node);

    expect(ref1).toHaveBeenCalledWith(node);
  });

  test("handles null refs gracefully", () => {
    const ref1 = vi.fn();
    const node = document.createElement("div");

    const composed = composeRefs(ref1, null);
    composed(node);

    expect(ref1).toHaveBeenCalledWith(node);
  });

  test("handles all undefined/null refs without error", () => {
    const node = document.createElement("div");

    const composed = composeRefs(undefined, null, undefined);
    expect(() => composed(node)).not.toThrow();
  });

  test("handles empty refs array", () => {
    const node = document.createElement("div");

    const composed = composeRefs();
    expect(() => composed(node)).not.toThrow();
  });
});
