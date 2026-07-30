import type { Command } from "@/common/commands";
import type { GamepadBindings } from "@/common/video-controls";
import type { CommandDispatcher } from "../commands/dispatcher";

interface Props {
  dispatcher: CommandDispatcher;
  getBindings: () => GamepadBindings;
}

export class GamepadListener {
  private dispatcher: CommandDispatcher;
  private getBindings: () => GamepadBindings;
  private animationFrameId: number | null = null;

  /** Map of gamepadIndex -> array of previous button pressed booleans */
  private prevButtonStates: Map<number, boolean[]> = new Map();

  constructor({ dispatcher, getBindings }: Props) {
    this.dispatcher = dispatcher;
    this.getBindings = getBindings;
  }

  public start(): void {
    window.addEventListener("gamepadconnected", this.onGamepadConnected);
    window.addEventListener("gamepaddisconnected", this.onGamepadDisconnected);
    this.checkActiveGamepads();
  }

  public stop(): void {
    window.removeEventListener("gamepadconnected", this.onGamepadConnected);
    window.removeEventListener("gamepaddisconnected", this.onGamepadDisconnected);
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.prevButtonStates.clear();
  }

  public updateConfig = (): void => {
    this.checkActiveGamepads();
  };

  private onGamepadConnected = (_e: GamepadEvent): void => {
    this.checkActiveGamepads();
  };

  private onGamepadDisconnected = (e: GamepadEvent): void => {
    this.prevButtonStates.delete(e.gamepad.index);
    this.checkActiveGamepads();
  };

  private checkActiveGamepads = (): void => {
    const bindings = this.getBindings();
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const hasConnected = Array.from(gamepads).some((gp) => gp !== null && gp.connected);

    if (bindings.enabled && hasConnected && this.animationFrameId === null) {
      this.pollLoop();
    } else if ((!bindings.enabled || !hasConnected) && this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  };

  private pollLoop = (): void => {
    const bindings = this.getBindings();

    if (!bindings.enabled) {
      this.animationFrameId = null;
      return;
    }

    const gamepads = navigator.getGamepads?.() ?? [];

    for (const gamepad of gamepads) {
      if (!gamepad?.connected) continue;

      const prevStates = this.prevButtonStates.get(gamepad.index) ?? [];
      const currentStates: boolean[] = [];

      for (let i = 0; i < gamepad.buttons.length; i++) {
        const isPressed = gamepad.buttons[i].pressed;
        const wasPressed = prevStates[i] ?? false;

        // Detect rising edge: transition from unpressed to pressed
        if (isPressed && !wasPressed) {
          const command = this.findCommandForButton(i, bindings);
          if (command !== null) {
            this.dispatcher.executeCommand(command);
          }
        }

        currentStates.push(isPressed);
      }

      this.prevButtonStates.set(gamepad.index, currentStates);
    }

    this.animationFrameId = requestAnimationFrame(this.pollLoop);
  };

  private findCommandForButton(buttonIndex: number, bindings: GamepadBindings): Command | null {
    if (bindings.seekBack === buttonIndex) return "seekBack";
    if (bindings.seekFwd === buttonIndex) return "seekFwd";
    if (bindings.speedDown === buttonIndex) return "speedDown";
    if (bindings.speedUp === buttonIndex) return "speedUp";
    if (bindings.resetSpeed === buttonIndex) return "resetSpeed";
    if (bindings.toggleOverlay === buttonIndex) return "toggleOverlay";
    return null;
  }
}
