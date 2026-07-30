import { clsx, type ClassValue } from "clsx";

export type StyleCategoryKey =
  /** Display types (flex, grid, block), flex/grid alignment, self-positioning, and gaps (gap-*, gap-x-*, gap-y-*). */
  | "layout"
  /** Internal padding (p-*, px-*, py-*) and external margins (m-*, mb-*, mt-*). */
  | "spacing"
  /** Surface backgrounds, accent colors, text colors, and border colors. */
  | "colors"
  /** Dimensions, width (w-*), height (h-*), and max responsive constraints. */
  | "sizing"
  /** Font family, text size, font weight, line height, and text alignment. */
  | "typography"
  /** Border presence, side borders, and corner border-radius tokens. */
  | "borders"
  /** Elevation shadows, positioning (sticky, relative, absolute), and z-index. */
  | "elevation"
  /** Interactive state behaviors, transitions, opacity levels, and pointer events. */
  | "state";

export type CategorizedStyles = Partial<Record<StyleCategoryKey, ClassValue>>;

export function cx(categories: CategorizedStyles): string {
  const parts: string[] = [];

  for (const key in categories) {
    const val = categories[key as keyof CategorizedStyles];
    const evaluated = clsx(val);
    if (evaluated) {
      parts.push(evaluated.trim());
    }
  }

  return parts.join(" ").replace(/\s+/g, " ");
}
