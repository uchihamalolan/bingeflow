(() => {
	function getNetflixPlayer() {
		try {
			const videoPlayer = window.netflix?.appContext?.state?.playerApp?.getAPI()?.videoPlayer;
			if (!videoPlayer) return null;

			const sessionId = videoPlayer.getAllPlayerSessionIds()?.[0];
			if (!sessionId) return null;

			return videoPlayer.getVideoPlayerBySessionId(sessionId);
		} catch (err) {
			console.error("[Skip Intro Bridge] Failed to access Netflix player:", err);
			return null;
		}
	}

	window.addEventListener("skip-intro:netflix:seek", (e) => {
		const player = getNetflixPlayer();
		if (!player) return;

		try {
			const { targetTimeMs } = JSON.parse(e.detail);
			player.seek(targetTimeMs);
		} catch (err) {
			console.error("[Skip Intro Bridge] Failed to seek:", err);
		}
	});
})();
