import type { Command } from "@/common/commands";

import type { CommandDispatcher } from "../commands/dispatcher";
import type { PlatformManager } from "../platform/platform-manager";
import type { VideoManager } from "../video/video-manager";

interface Props {
  dispatcher: CommandDispatcher;
  videoManager: VideoManager;
  platformManager: PlatformManager;
  platformShortcuts: Set<string>;
}

export class KeyboardListener {
  private dispatcher: CommandDispatcher;
  private videoManager: VideoManager;
  private platformManager: PlatformManager;
  private platformShortcuts: Set<string>;

  constructor({ dispatcher, videoManager, platformManager, platformShortcuts }: Props) {
    this.dispatcher = dispatcher;
    this.videoManager = videoManager;
    this.platformManager = platformManager;
    this.platformShortcuts = platformShortcuts;
  }

  public start(): void {
    document.addEventListener("keydown", this.onKeyDown);
  }

  public stop(): void {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (!this.isValidPress(e)) return;

    // Check video control keyboard bindings if key is not reserved by platform shortcut
    if (this.videoManager.hasActiveVideo() && !this.platformShortcuts.has(e.key)) {
      const { keyBindings } = this.videoManager.getConfig();
      let matchedCommand: Command | null = null;

      if (e.key === keyBindings.seekBack) matchedCommand = "seekBack";
      else if (e.key === keyBindings.seekFwd) matchedCommand = "seekFwd";
      else if (e.key === keyBindings.speedDown) matchedCommand = "speedDown";
      else if (e.key === keyBindings.speedUp) matchedCommand = "speedUp";
      else if (e.key === keyBindings.resetSpeed) matchedCommand = "resetSpeed";
      else if (e.key === keyBindings.toggleOverlay) matchedCommand = "toggleOverlay";

      if (matchedCommand !== null) {
        this.dispatcher.executeCommand(matchedCommand);
        return;
      }
    }

    // Check platform behavior shortcuts (e.g., skip, next)
    const platformCommand = this.platformManager.getCommandForKey(e.key);
    if (platformCommand !== null) {
      this.dispatcher.executeCommand(platformCommand);
    }
  };

  private isValidPress(event: KeyboardEvent): boolean {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) {
      return false;
    }
    if (this.isTypingContext(event.target)) {
      return false;
    }
    return true;
  }

  private isTypingContext(target: EventTarget | null): boolean {
    const nodesToCheck = [target, document.activeElement];

    for (const node of nodesToCheck) {
      if (!node || !(node instanceof HTMLElement)) {
        continue;
      }

      const tagName = node.tagName ? node.tagName.toLowerCase() : "";
      if (tagName === "input" || tagName === "textarea" || tagName === "select") {
        return true;
      }

      if (node.isContentEditable || node.closest("[contenteditable='true']")) {
        return true;
      }
    }

    return false;
  }
}
