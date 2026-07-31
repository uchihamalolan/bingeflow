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
      this.executeVideoCommand(command);
    } else {
      this.platformManager.execute(command);
    }
  }

  private executeVideoCommand(command: VideoCommand): void {
    const controller = this.videoManager.getController();
    if (controller === null) return;

    const { seekSeconds, speedStep } = this.videoManager.getConfig();

    switch (command) {
      case "toggleOverlay":
        this.videoManager.toggleOverlay();
        break;
      case "togglePlay":
        controller.togglePlay();
        this.videoManager.triggerActivity();
        break;
      case "seekBack":
        controller.seek(-seekSeconds);
        this.videoManager.triggerActivity();
        break;
      case "seekFwd":
        controller.seek(seekSeconds);
        this.videoManager.triggerActivity();
        break;
      case "speedDown": {
        const current = controller.getPlaybackRate();
        controller.setPlaybackRate(current - speedStep);
        this.videoManager.triggerActivity();
        break;
      }
      case "speedUp": {
        const current = controller.getPlaybackRate();
        controller.setPlaybackRate(current + speedStep);
        this.videoManager.triggerActivity();
        break;
      }
      case "resetSpeed":
        controller.setPlaybackRate(1.0);
        this.videoManager.triggerActivity();
        break;
    }
  }
}
