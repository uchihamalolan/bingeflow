export type VideoCommand =
  | "seekBack"
  | "seekFwd"
  | "speedDown"
  | "speedUp"
  | "resetSpeed"
  | "toggleOverlay";

export type PlatformCommand = "skip" | "next";

export type Command = VideoCommand | PlatformCommand;

export const VIDEO_COMMANDS: VideoCommand[] = [
  "seekBack",
  "seekFwd",
  "speedDown",
  "speedUp",
  "resetSpeed",
  "toggleOverlay",
];
