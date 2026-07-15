import { defineUnlistedScript } from "wxt/utils/define-unlisted-script";

export default defineUnlistedScript(() => {
  function getNetflixPlayer() {
    try {
      const videoPlayer = (window as any).netflix?.appContext?.state?.playerApp?.getAPI()
        ?.videoPlayer;
      if (!videoPlayer) return null;

      const sessionId = videoPlayer.getAllPlayerSessionIds()?.[0];
      if (!sessionId) return null;

      return videoPlayer.getVideoPlayerBySessionId(sessionId);
    } catch (err) {
      console.error("[BingeFlow Bridge] Failed to access Netflix player:", err);
      return null;
    }
  }

  window.addEventListener("bingeflow:netflix:seek", (e: Event) => {
    const player = getNetflixPlayer();
    if (!player) return;

    try {
      const customEvent = e as CustomEvent;
      const { targetTimeMs } = JSON.parse(customEvent.detail);
      player.seek(targetTimeMs);
    } catch (err) {
      console.error("[BingeFlow Bridge] Failed to seek:", err);
    }
  });
});
