import { type Command, type VideoCommand, VIDEO_COMMANDS } from "@/common/commands";

import type { PlatformManager } from "../platform/platform-manager";
import type { VideoManager } from "../video/video-manager";

interface Props {
  videoManager: VideoManager;
  platformManager: PlatformManager;
}

export class CommandDispatcher {
  private videoManager: VideoManager;
  private platformManager: PlatformManager;

  constructor({ videoManager, platformManager }: Props) {
    this.videoManager = videoManager;
    this.platformManager = platformManager;
  }

  private isVideoCommand(command: Command): command is VideoCommand {
    return (VIDEO_COMMANDS as Command[]).includes(command);
  }

  public executeCommand(command: Command): void {
    if (this.isVideoCommand(command)) {
      this.videoManager.execute(command);
    } else {
      this.platformManager.execute(command);
    }
  }
}
