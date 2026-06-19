---
name: svelte-styling
description: HTML and CSS authoring conventions for Svelte components in this project. Use when writing or reviewing markup and styles in any .svelte file — covers semantic HTML element choice, CSS class rules, and the minimal styling philosophy.
---

# Svelte Styling Conventions

## Semantic HTML

Prefer semantic elements over generic `<div>` / `<span>`. Quick reference:

| Use case | Element |
|---|---|
| Self-contained card/unit | `<article>` |
| Heading area of a card | `<header>` |
| Card title | `<h2>`–`<h6>` (pick appropriate level) |
| Key/value metadata pair | `<dl>` / `<dt>` / `<dd>` |
| Status annotation / highlight | `<mark>` |
| Keyboard shortcut | `<kbd>` |
| Enumerable list of items | `<ul>` / `<li>` |
| Distinct content region | `<section>` |
| Loading / live feedback | `<div role="status">` |
| Decorative emoji / icon | `<span aria-hidden="true">` |

- Add `aria-hidden="true"` on all decorative SVG icons and emoji. The parent interactive element (e.g. `<button>`) should carry a descriptive `aria-label` instead.
- Use CSS grid/flex layouts to eliminate unnecessary wrapper elements rather than adding extra `<div>` nesting.

## CSS Class Rules

**Always use named CSS classes** on every styled element. Do **not** target bare HTML element selectors or structural pseudo-selectors inside component stylesheets.

✅ Correct:
```svelte
<h3 class="title">...</h3>

<style>
.title { margin: 0; }
</style>
```

❌ Incorrect:
```svelte
<h3>...</h3>

<style>
h3 { margin: 0; }        /* bare element selector */
p:first-child { ... }    /* structural pseudo-selector */
</style>
```

> Svelte scopes styles per-component so bare selectors feel safe, but they make intent opaque and surprise future readers.

## Minimal CSS Philosophy

Only write rules that are strictly necessary. Three permitted categories:

1. **Layout** — `display`, flex/grid properties, `gap`, `padding`, `margin`
2. **Color** — `color`, `background`, `border-color` using Catppuccin theme variables:
   `--text`, `--subtext0`, `--surface0`, `--surface1`, `--mantle`, `--mauve`, `--green`, `--red`, `--blue`, etc.
3. **Border** — `border`, `border-radius` using Open Props tokens

**Avoid** unless specifically justified:
- `font-size`, `font-weight`, `letter-spacing`, `text-transform`, `line-height`
- `transition`, `animation`

Prefer browser and inherited defaults wherever possible.

## CSS Nesting

Nesting is enabled and encouraged for pseudo-classes and pseudo-elements:

```css
.btn {
  color: var(--subtext0);
  &:hover { color: var(--text); }
}
```

## Open Props Tokens

Never hardcode spacing, radii, borders, or timing values. Always use Open Props variables:

| Category | Examples |
|---|---|
| Size / spacing | `var(--size-1)` … `var(--size-9)` |
| Border radius | `var(--radius-1)`, `var(--radius-2)`, `var(--radius-round)` |
| Border width | `var(--border-size-1)`, `var(--border-size-2)` |
| Easing | `var(--ease-2)` |
| Duration | `var(--duration-2)` |
