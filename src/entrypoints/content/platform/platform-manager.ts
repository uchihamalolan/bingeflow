import type { PlatformCommand } from "@/common/commands";
import { getPlatformBehaviors, type PlatformConfig } from "@/common/platforms";

export class PlatformManager {
  private readonly platformConfig: PlatformConfig | null;

  constructor(platformConfig: PlatformConfig | null) {
    this.platformConfig = platformConfig;
  }

  public getConfig(): PlatformConfig | null {
    return this.platformConfig;
  }

  public execute(command: PlatformCommand): void {
    if (this.platformConfig === null) return;

    for (const behavior of getPlatformBehaviors(this.platformConfig)) {
      if (behavior.enabled && behavior.type === command) {
        document.querySelector<HTMLElement>(behavior.selector)?.click();
        break;
      }
    }
  }
}
