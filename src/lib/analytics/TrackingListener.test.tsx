/** biome-ignore-all lint/style/noNonNullAssertion: test */
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/analytics/ga", () => ({
  gtag: vi.fn()
}));

import { gtag } from "@/lib/analytics/ga";
import { TrackingListener } from "./TrackingListener";

const gtagMock = vi.mocked(gtag);

describe("TrackingListener", () => {
  beforeEach(() => {
    gtagMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("should fire gtag event when clicking element with data-track attribute", () => {
    render(
      <>
        <TrackingListener />
        <button type="button" data-track="cta_click">
          Click me
        </button>
      </>
    );

    fireEvent.click(document.querySelector("[data-track]")!);

    expect(gtagMock).toHaveBeenCalledWith("event", "cta_click");
  });

  it("should use closest() to find tracked ancestor when clicking child element", () => {
    render(
      <>
        <TrackingListener />
        <div data-track="card_click">
          <span data-testid="inner">Nested child</span>
        </div>
      </>
    );

    fireEvent.click(document.querySelector("[data-testid='inner']")!);

    expect(gtagMock).toHaveBeenCalledWith("event", "card_click");
  });

  it("should NOT fire event when clicking untracked element", () => {
    render(
      <>
        <TrackingListener />
        <button type="button">No tracking</button>
      </>
    );

    fireEvent.click(document.querySelector("button")!);

    expect(gtagMock).not.toHaveBeenCalled();
  });

  it("should extract data-track-* attributes as event params", () => {
    render(
      <>
        <TrackingListener />
        <button type="button" data-track="signup" data-track-plan="premium">
          Sign up
        </button>
      </>
    );

    fireEvent.click(document.querySelector("[data-track]")!);

    expect(gtagMock).toHaveBeenCalledWith("event", "signup", {
      plan: "premium"
    });
  });

  it("should handle multiple data-track-* params", () => {
    render(
      <>
        <TrackingListener />
        <button
          type="button"
          data-track="purchase"
          data-track-item-id="42"
          data-track-category="shoes"
          data-track-session-id="abc-123"
        >
          Buy
        </button>
      </>
    );

    fireEvent.click(document.querySelector("[data-track]")!);

    expect(gtagMock).toHaveBeenCalledWith("event", "purchase", {
      itemId: "42",
      category: "shoes",
      sessionId: "abc-123"
    });
  });

  it("should fire event with no params when no data-track-* attributes exist", () => {
    render(
      <>
        <TrackingListener />
        <button type="button" data-track="simple_click">
          Simple
        </button>
      </>
    );

    fireEvent.click(document.querySelector("[data-track]")!);

    expect(gtagMock).toHaveBeenCalledWith("event", "simple_click");
    expect(gtagMock).toHaveBeenCalledTimes(1);
  });

  it("should clean up listener on unmount", () => {
    const { unmount } = render(
      <>
        <TrackingListener />
        <button type="button" data-track="click_event">
          Track
        </button>
      </>
    );

    unmount();

    // Click after unmount should NOT trigger gtag
    const orphanBtn = document.createElement("button");
    orphanBtn.setAttribute("data-track", "orphan");
    document.body.appendChild(orphanBtn);

    fireEvent.click(orphanBtn);

    expect(gtagMock).not.toHaveBeenCalled();

    document.body.removeChild(orphanBtn);
  });
});
