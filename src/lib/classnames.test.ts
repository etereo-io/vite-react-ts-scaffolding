import { cn } from "./classnames";

describe("cn function", () => {
  it("should handle string input", () => {
    expect(cn("bg-red-500")).toBe("bg-red-500");
  });

  it("should handle array input", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("should handle object input", () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    expect(
      cn({ "bg-red-500": true, "text-white": false, "p-4": true }, "purple")
    ).toBe("bg-red-500 p-4 purple");
  });

  it("should merge tailwind classes correctly", () => {
    expect(cn("bg-red-500 bg-blue-500")).toBe("bg-blue-500");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });
});
