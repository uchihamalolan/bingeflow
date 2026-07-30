import { CommandDispatcher } from "./commands/dispatcher";
import { GamepadListener } from "./input/gamepad-listener";
import { KeyboardListener } from "./input/keyboard-listener";
import type { PlatformManager } from "./platform/platform-manager";
import type { VideoManager } from "./video/video-manager";

interface Props {
  videoManager: VideoManager;
  platformManager: PlatformManager;
  platformShortcuts: Set<string>;
}

export function addEventListeners({ videoManager, platformManager, platformShortcuts }: Props) {
  const dispatcher = new CommandDispatcher({
    videoManager,
    platformManager,
  });

  // Initialize keyboard listener
  const keyboardListener = new KeyboardListener({
    dispatcher,
    videoManager,
    platformManager,
    platformShortcuts,
  });
  keyboardListener.start();

  // Initialize gamepad listener
  const gamepadListener = new GamepadListener({
    dispatcher,
    getBindings: () => videoManager.getConfig().gamepadBindings,
  });
  gamepadListener.start();

  return {
    keyboardListener,
    gamepadListener,
  };
}
