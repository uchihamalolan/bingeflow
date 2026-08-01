import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";

import { Html5VideoController } from "../html5-video-controller";
import { NetflixVideoController } from "../netflix-video-controller";

describe("Video Controllers", () => {
  let video: HTMLVideoElement;
  let playSpy: ReturnType<typeof vi.fn>;
  let pauseSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fakeBrowser.reset();
    document.body.innerHTML = "";
    video = document.createElement("video");
    Object.defineProperty(video, "duration", { value: 100, writable: true });
    Object.defineProperty(video, "currentTime", { value: 10, writable: true });
    Object.defineProperty(video, "paused", { value: true, writable: true });
    Object.defineProperty(video, "playbackRate", { value: 1.0, writable: true });
    playSpy = vi.fn().mockResolvedValue(undefined);
    pauseSpy = vi.fn();
    video.play = playSpy as any;
    video.pause = pauseSpy as any;
    document.body.appendChild(video);
  });

  describe("Html5VideoController", () => {
    it("should seek within video duration bounds", () => {
      const controller = new Html5VideoController(video);

      controller.seek(15);
      expect(video.currentTime).toBe(25);

      controller.seek(-100);
      expect(video.currentTime).toBe(0);

      controller.seek(200);
      expect(video.currentTime).toBe(100);

      controller.destroy();
    });

    it("should toggle play and pause states", () => {
      const controller = new Html5VideoController(video);

      Object.defineProperty(video, "paused", { value: true });
      controller.togglePlay();
      expect(playSpy).toHaveBeenCalled();

      Object.defineProperty(video, "paused", { value: false });
      controller.togglePlay();
      expect(pauseSpy).toHaveBeenCalled();

      controller.destroy();
    });

    it("should set and clamp playback rate between 0.1 and 16", () => {
      const controller = new Html5VideoController(video);

      controller.setPlaybackRate(1.5);
      expect(video.playbackRate).toBe(1.5);

      controller.setPlaybackRate(0.01);
      expect(video.playbackRate).toBe(0.1);

      controller.setPlaybackRate(20);
      expect(video.playbackRate).toBe(16);

      controller.destroy();
    });

    it("should notify rate change listeners", () => {
      const controller = new Html5VideoController(video);
      const listener = vi.fn();

      const unsubscribe = controller.onPlaybackRateChange(listener);
      expect(listener).toHaveBeenCalledWith(1.0);

      Object.defineProperty(video, "playbackRate", { value: 1.5 });
      video.dispatchEvent(new Event("ratechange"));
      expect(listener).toHaveBeenCalledWith(1.5);

      unsubscribe();
      controller.destroy();
    });
  });

  describe("NetflixVideoController", () => {
    it("should inject bridge script into document", () => {
      const controller = new NetflixVideoController(video);
      const script = document.getElementById("bingeflow-netflix-bridge");
      expect(script).not.toBeNull();
      controller.destroy();
    });

    it("should dispatch bingeflow:netflix:seek event when seek is called", () => {
      const controller = new NetflixVideoController(video);
      const eventSpy = vi.fn();

      window.addEventListener("bingeflow:netflix:seek", eventSpy);
      controller.seek(10);

      expect(eventSpy).toHaveBeenCalled();
      const event = eventSpy.mock.calls[0][0] as CustomEvent;
      const detail = JSON.parse(event.detail);
      expect(detail.targetTimeMs).toBe(20000);

      window.removeEventListener("bingeflow:netflix:seek", eventSpy);
      controller.destroy();
    });
  });
});
