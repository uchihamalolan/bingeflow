import type { PlatformConfig } from "@/common/platforms";

import { Html5VideoController } from "./html5-video-controller";
import { NetflixVideoController } from "./netflix-video-controller";
import type { VideoController } from "./video-controller";

export function createVideoController(
	video: HTMLVideoElement,
	platformConfig: PlatformConfig | null,
): VideoController {
	if (platformConfig?.platform === "netflix") {
		return new NetflixVideoController(video);
	}
	return new Html5VideoController(video);
}
