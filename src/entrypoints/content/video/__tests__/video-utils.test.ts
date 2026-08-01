import { beforeEach, describe, expect, it } from "vitest";

import { findVideo, getPlayerContainer } from "../video-utils";

describe("video-utils", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("findVideo", () => {
    it("should return null when no video elements exist", () => {
      expect(findVideo()).toBeNull();
      expect(findVideo("#nonexistent")).toBeNull();
    });

    it("should return video matching selector when valid selector is provided", () => {
      const video = document.createElement("video");
      video.id = "target-video";
      document.body.appendChild(video);

      const found = findVideo("#target-video");
      expect(found).toBe(video);
    });

    it("should fallback to largest video when no selector is passed", () => {
      const smallVideo = document.createElement("video");
      const largeVideo = document.createElement("video");

      smallVideo.getBoundingClientRect = () => ({ width: 100, height: 100 }) as DOMRect;
      largeVideo.getBoundingClientRect = () => ({ width: 500, height: 500 }) as DOMRect;

      document.body.appendChild(smallVideo);
      document.body.appendChild(largeVideo);

      const found = findVideo();
      expect(found).toBe(largeVideo);
    });
  });

  describe("getPlayerContainer", () => {
    it("should return matching container when playerContainerSelector matches ancestor", () => {
      const container = document.createElement("div");
      container.className = "player-root";

      const video = document.createElement("video");
      container.appendChild(video);
      document.body.appendChild(container);

      const result = getPlayerContainer(video, ".player-root");
      expect(result).toBe(container);
    });

    it("should fallback to grandparent/parent when container selector is omitted", () => {
      const grandparent = document.createElement("div");
      const parent = document.createElement("div");
      const video = document.createElement("video");

      parent.appendChild(video);
      grandparent.appendChild(parent);
      document.body.appendChild(grandparent);

      const result = getPlayerContainer(video);
      expect(result).toBe(grandparent);
    });
  });
});
