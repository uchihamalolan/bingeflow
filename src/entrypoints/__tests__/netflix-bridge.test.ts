import { beforeEach, describe, expect, it, vi } from "vitest";

import defineBridge from "../netflix-bridge";

describe("netflix-bridge script", () => {
  beforeEach(() => {
    (window as any).netflix = undefined;
  });

  it("should attempt to seek on netflix player when custom event is dispatched", () => {
    defineBridge.main();

    const seekSpy = vi.fn();
    (window as any).netflix = {
      appContext: {
        state: {
          playerApp: {
            getAPI: () => ({
              videoPlayer: {
                getAllPlayerSessionIds: () => ["session-123"],
                getVideoPlayerBySessionId: () => ({
                  seek: seekSpy,
                }),
              },
            }),
          },
        },
      },
    };

    window.dispatchEvent(
      new CustomEvent("bingeflow:netflix:seek", {
        detail: JSON.stringify({ targetTimeMs: 45000 }),
      }),
    );

    expect(seekSpy).toHaveBeenCalledWith(45000);
  });
});
